<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{name: 'profile', params: { id: user.id, userProfile: user, activeTab: 1}}">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image">
                    </div>
                </router-link>
            </div>
            <modal v-model:visible="showModalRequestSeat" title="Carpoodatos">
                <template #header>
                    <h3>
                        <span>¡Carpoodatos!</span>
                        <i @click="onModalClose" class="fa fa-times float-right-close"></i>
                    </h3>
                </template>
                <template #body>
                    <div class="text-left carpoodatos">
                      <p>Antes de aceptar solicitud de asiento, mandale mensaje a la otra persona para coordinar todo lo vinculado al viaje: punto de encuentro, punto de llegada, tamaño de bolsos, contribución para combustible y peajes, etc.</p>
                      <p>Si aceptás una solicitud de asiento, se genera el compromiso de viajar entre vos y la otra persona, habilitándose la posibilidad de calificación 24hs después de comenzado el viaje. Tendrán 14 días para calificarse.</p>
                      <p>Se podrán calificar aunque canceles el viaje o bajes a / se baje la otra persona.</p>
                      <p>No ofrezcas un viaje si no tenés seguridad de que vas a viajar. Si ocurriera algo que te obligue a cancelarlo, avisale lo más rápido que puedas a las personas que iban a viajar.</p>
                      <p>Cualquier duda escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o nuestras redes sociales.</p>
                    </div>
                    <div class="check" style="margin-bottom:10px;">
                        <label class="check-inline">
                            <input type="checkbox" name="acceptRequestValor" value="0" v-model="acceptRequestValue"><span> No volver a mostrar mensaje</span>
                        </label>
                    </div>
                </template>
                <template #footer>
                    <div class="text-center">
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="toAcceptRequest">
                            <spinner v-if="acceptInProcess" />
                            <span v-else>Aceptar</span>
                        </button>
                        <button class="btn btn-chat" @click="onModalToChat">Chatear</button>
                    </div>
                </template>
            </modal>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{user.name}}</strong> quiere subirse al viaje hacia <strong>{{trip.points[trip.points.length - 1].json_address.ciudad}}</strong> del día {{ formatDate(trip.trip_date, "DD/MM/YYYY") }} a las  {{ formatDate(trip.trip_date, "HH:mm") }}.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess || rejectInProcess" @click="onAcceptRequest"> 
                            <spinner class="blue" v-if="acceptInProcess"></spinner>
                            <span v-else>Aceptar</span>
                        </button>
                        <button class="btn btn-primary" :disabled="rejectInProcess || acceptInProcess" @click="reject">
                            <spinner class="blue" v-if="rejectInProcess"></spinner>
                            <span v-else>Rechazar</span>
                        </button>
                    </div>
                    <div class="message-button">
                        <button class="btn btn-secondary"  @click="chat"> Enviar Mensaje </button>
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
import dialogs from '../services/dialogs'
import modal from './Modal.vue'
import spinner from './Spinner.vue'
import moment from 'moment'

export default {
    name: 'pending-request',
    props: ['user', 'trip'],
    components: {
        modal,
        spinner
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()
        
        const acceptInProcess = ref(false)
        const rejectInProcess = ref(false)
        const showModalRequestSeat = ref(false)
        const acceptRequestValue = ref(0)

        const currentUser = computed(() => store.getters['auth/user'])
        const config = computed(() => store.getters['auth/appConfig'])

        const formatDate = (date, format) => {
            return moment(date).format(format)
        }

        const onAcceptRequest = () => {
            if (currentUser.value.do_not_alert_accept_passenger || config.value.disable_user_hints) {
                toAcceptRequest()
            } else {
                showModalRequestSeat.value = true
            }
        }

        const toAcceptRequest = async () => {
            if (acceptRequestValue.value) {
                await store.dispatch('profile/changeProperty', {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                })
            }

            acceptInProcess.value = true
            try {
                await store.dispatch('passenger/accept', { 
                    user: props.user, 
                    trip: props.trip 
                })
            } catch (error) {
                if (checkError(error, 'not_seat_available')) {
                    dialogs.message('No puedes aceptar esta solicitud, todos los asientos del viaje están ocupados.', 
                        { duration: 10, estado: 'error' })
                    return
                }
                console.error(error)
            } finally {
                acceptInProcess.value = false
            }
        }

        const reject = async () => {
            rejectInProcess.value = true
            try {
                await store.dispatch('passenger/reject', { 
                    user: props.user, 
                    trip: props.trip 
                })
            } catch (error) {
                console.error('Error rejecting request:', error)
                dialogs.error('No se pudo rechazar la solicitud')
            } finally {
                rejectInProcess.value = false
            }
        }

        const chat = () => {
            router.push({ 
                name: 'conversation', 
                params: { 
                    id: props.user.id 
                }
            })
        }

        const onModalClose = () => {
            if (acceptRequestValue.value) {
                store.dispatch('profile/changeProperty', {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                }).then(() => {
                    console.log('do not alert success')
                })
            }
            showModalRequestSeat.value = false
        }

        const onModalToChat = () => {
            showModalRequestSeat.value = false

            if (acceptRequestValue.value) {
                store.dispatch('profile/changeProperty', {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                }).then(() => {
                    console.log('do not alert success')
                })
            }
            chat()
        }

        return {
            acceptInProcess,
            rejectInProcess,
            showModalRequestSeat,
            acceptRequestValue,
            currentUser,
            config,
            formatDate,
            onAcceptRequest,
            toAcceptRequest,
            reject,
            chat,
            onModalClose,
            onModalToChat
        }
    }
}
</script>
