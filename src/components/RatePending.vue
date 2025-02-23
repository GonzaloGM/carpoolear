<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{ name: 'profile', params: { id: to.id, userProfile: to, activeTab: 1} }">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="to.image">
                    </div>
                </router-link>
            </div>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    ¿Cómo calificarías a <strong>{{ to.name }}</strong> como
                    <span v-if="rate.user_to_type === DRIVER"> conductor </span>
                    <span v-if="rate.user_to_type === PASSENGER"> pasajero </span>
                    en el viaje hacía <strong>{{ trip.points[trip.points.length - 1].json_address.ciudad }}</strong> el día <strong>{{ formatDate(trip.trip_date, 'dddd DD [de] MMMM') }}</strong> ?
                </div>
            </div>
            <div class="float-margin">
                <div class='rate-buttons'>
                    <button class="btn rate-positive" @click="setRate(1)" :class="{active: vote === 1}">
                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                    </button>
                    <button class="btn rate-negative" @click="setRate(0)" :class="{active: vote === 0}">
                        <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="rate-pending-message--content" v-if="expanded">
                <div class="rate-pending-message--content">
                    <div class="form-group">
                        <label for="comment">Comentario (opcional)</label>
                        <textarea class="form-control" v-model="comment" rows="3"></textarea>
                    </div>
                    <div class="rate-buttons">
                        <button class="btn btn-primary" :disabled="sending" @click="makeVote">
                            <spinner class="blue" v-if="sending"></spinner>
                            <span v-else>Enviar</span>
                        </button>
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
    name: 'rate-pending',
    components: {
        modal,
        spinner
    },
    props: {
        rate: {
            type: Object,
            required: true
        },
        trip: {
            type: Object,
            required: true
        },
        to: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()

        const DRIVER = 1
        const PASSENGER = 2

        const showModalRequestRate = ref(false)
        const rateRequestValue = ref(0)
        const rating = ref(null)
        const comment = ref('')
        const sending = ref(false)
        const vote = ref(-1)
        const expanded = ref(false)

        const user = computed(() => store.getters['auth/user'])

        const formatDate = (date, format) => {
            return moment(date).format(format)
        }

        const setRate = (value) => {
            vote.value = value
            expanded.value = true
        }

        const makeVote = async () => {
            if (sending.value) return
            
            sending.value = true
            try {
                await store.dispatch('rates/rate', {
                    trip_id: props.trip.id,
                    user_id: props.to.id,
                    user_type: props.rate.user_to_type,
                    rating: vote.value,
                    comment: comment.value
                })
                dialogs.success('Calificación enviada')
            } catch (error) {
                console.error('Error rating:', error)
                dialogs.error('No se pudo enviar la calificación')
            } finally {
                sending.value = false
            }
        }

        return {
            showModalRequestRate,
            rateRequestValue,
            rating,
            comment,
            sending,
            vote,
            expanded,
            user,
            DRIVER,
            PASSENGER,
            formatDate,
            setRate,
            makeVote
        }
    }
}
</script>
