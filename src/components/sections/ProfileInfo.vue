<template>
    <div class="profile-info-component" v-if="profile">
        <div class="list-group">
            <div class="pic-info col-sm-6">
                <div v-if="profile.has_pin == 1" class="user_pin">
                    <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" :title="$t('aportanteMediaNaranja')" />
                </div>
                <div class="circle-box profile" v-imgSrc:profile="profile.image"></div>
                <div class="profile-info">
                    <div class="profile-info--name mobile">{{profile.name}}</div>
                    <div class="profile-info--ratings">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i> <span> {{profile.positive_ratings}} </span>
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i> <span> {{profile.negative_ratings}} </span>
                    </div>
                    <div v-if="profile.is_member == 1" class="member_pin">
                        <img src="https://carpoolear.com.ar/static/img/pin_member.png" alt="" :title="$t('miembroEquipo')" />
                    </div>
                </div>
                <div class="profile-social-accounts" >
                    <div v-for="account in profile.accounts" class="row">
                        <div class="col-xs-24">
                            <a :href="'https://www.facebook.com/search/top/?q=' + encodeURIComponent(profile.name)" target="_blank" class="btn-primary btn-search" style="border: 0" :title="$t('cambioFacebook')">
                                <span class=''>{{ $t('buscarFacebook') }}</span>
                            </a><!-- app_scoped_user_id -->
                        </div>
                    </div>
                    <div class="row" v-if="profile.accounts && profile.accounts.length">
                        <div class="col-xs-24">
                            <small>{{ $t('cambioFacebook') }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-info col-sm-offset-2 col-sm-16 col-md-offset-1">
                <div class="profile-info--name desktop">{{profile.name}}</div>
                <div class='list-container'>
                    <div class="list-group-item" v-if="profile.description">
                        <i class="fa fa-quote-left" aria-hidden="true"></i>
                        <div class="list-group-item--content italic"> {{profile.description}} </div>
                    </div>

                    <div class="list-group-item" v-if="profile.email ">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.email}}</div>
                    </div>
                    <div class="list-group-item" v-if="profile.nro_doc">
                        <i class="fa fa-id-card" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.nro_doc}}</div>
                    </div>

                    <div class="list-group-item" v-if="profile.mobile_phone">
                        <i class="fa fa-mobile bigger" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.mobile_phone}}</div>
                    </div>

                    <div class="list-group-item" v-if="profile.cars && profile.cars.length">
                        <i class="fa fa-car" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.cars[0].patente}}</div>
                    </div>

                </div>
                <div class="edit-action" v-if="user.is_admin && profile.id !== user.id">
                    <button class="btn btn-primary btn-circle" v-on:click="messageUser()">
                        {{ $t('enviarMensaje') }}
                    </button>
                </div>
                <div class="edit-action" v-if="profile.id === user.id">
                    <router-link class="btn btn-primary" tag="button" :to="{name:'profile_update'}"> {{ $t('editarPerfil') }}</router-link>
                    <router-link class="btn btn-primary" tag="button" :to="{name:'friends_setting'}"> {{ $t('verAmigos') }}</router-link>
                    <router-link v-if="config && config.module_trip_seats_payment" class="btn btn-primary" tag="button" :to="{name:'transacciones'}"> transacciones </router-link>
                </div>
                <div class="edit-action edit-action-reference" v-else-if="config && config.module_references && !userReferenceWritten">
                    <button v-if="!sendReferenceFormVisibility" class="btn btn-primary" tag="button" @click="showReferenceForm">{{ $t('enviarReferencia') }}</button>
                    <div v-else class="reply-box">
                        <label for="reply" class="label label-reply">Escribe una referencia sobre el usuario</label>
                        <textarea ref="reference" maxlength="260" v-model="referenceComment" id="reference"></textarea>
                        <div class="reply-btns">
                            <button class="btn btn-primary" @click="sendReference" :disabled="sending">
                                <template v-if="sending">
                                    <spinner class="blue"></spinner>
                                </template>
                                <template v-else>
                                    Comentar
                                </template>
                            </button>
                            <button class="btn btn-primary" @click="sendReferenceFormVisibility = false"> Cancelar </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Spinner from '../Spinner.vue'
import dialogs from '../../services/dialogs.js'

export default {
    name: 'profile-info',
    components: {
        Spinner
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        
        const sendReferenceFormVisibility = ref(false)
        const referenceComment = ref('')
        const sending = ref(false)

        const user = computed(() => store.getters['auth/user'])
        const profile = computed(() => store.getters['profile/user'])
        const config = computed(() => store.getters['auth/appConfig'])

        const userReferenceWritten = computed(() => {
            return profile.value.references_data && 
                   profile.value.references_data.length && 
                   profile.value.references_data.findIndex(item => item.user_id_from === user.value.id) >= 0
        })

        const messageUser = async () => {
            try {
                const conversation = await store.dispatch('conversations/createConversation', profile.value)
                router.push({ name: 'conversation-chat', params: { id: conversation.id } })
            } catch (error) {
                console.error(error)
            }
        }

        const showReferenceForm = () => {
            sendReferenceFormVisibility.value = true
        }

        const sendReference = async () => {
            if (sending.value) return
            
            sending.value = true
            try {
                await store.dispatch('profile/makeReference', {
                    user_id_to: profile.value.id,
                    comment: referenceComment.value
                })
                sendReferenceFormVisibility.value = false
                referenceComment.value = ''
                dialogs.success('Referencia enviada correctamente')
            } catch (error) {
                dialogs.error('Error al enviar la referencia')
            } finally {
                sending.value = false
            }
        }

        return {
            user,
            profile,
            config,
            sendReferenceFormVisibility,
            referenceComment,
            sending,
            userReferenceWritten,
            messageUser,
            showReferenceForm,
            sendReference
        }
    }
}
</script>

<style scoped>
    .btn-primary {
        display: inline-block;
    }
    .label-reply {
        display: block;
        padding: 0;
        font-size: 0.9rem;
        font-weight: bold;
        line-height: 1.5em;
        color: #333;
        text-align: left;
        border-radius: 0;
    }
    .reply-btns button {
        min-width: 7rem;
    }
</style>
