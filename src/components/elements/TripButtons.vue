<template>
    <div>
        <div class="buttons-container"  v-if="!isPassengersView || (isPassengersView && owner)">
            <router-link class="btn btn-primary" v-if="owner && !expired" :to="{name: 'update-trip', params: { id: trip.id}}">
                Editar
            </router-link>
            <a class="btn btn-primary" v-if="owner && !expired" @click="$emit('deleteTrip')" :disabled="sendingStatus">
                <spinner class="blue" v-if="sending && sending.deleteAction"></spinner>
                <span v-else>Cancelar Viaje</span>
            </a>
            <template v-if="!owner && !expired && (!canRequest || !config.module_coordinate_by_message || (config.module_coordinate_by_message && isPassenger))">
                <button class="btn btn-primary" @click="$emit('toMessages')" v-if="!owner" :disabled="sendingStatus">
                    <spinner class="blue" v-if="sending && sending.sendMessageAction"></spinner>
                    <span v-else>Enviar mensaje</span>
                </button>
            </template>
            <template v-if="!owner && !trip.is_passenger && !expired">
                <template v-if="!isPassenger">
                    <button class="btn btn-primary" @click="$emit('onMakeRequest')" v-if="canRequest && trip.seats_available > 0" :disabled="sendingStatus">
                        <template v-if="sending && sending.requestAction">
                            <spinner class="blue"></spinner>
                        </template>
                        <template v-else>
                            <template v-if="trip.user.autoaccept_requests">
                                <template v-if="config && config.module_trip_seats_payment">
                                    Reservar $ {{ trip.seat_price }}
                                </template>
                                <template v-else>
                                    Reservar
                                </template>
                            </template>
                            <template v-else-if="config.module_coordinate_by_message">
                                Enviar mensaje
                            </template>
                            <template v-else>
                                Solicitar asiento
                            </template>
                        </template>
                    </button>
                    <button class="btn" v-if="!canRequest" @click="$emit('cancelRequest')" :disabled="sendingStatus">
                        <spinner class="blue" v-if="sending && sending.requestAction"></spinner>
                        <span v-else>Solicitado (RETIRAR)</span>
                    </button>
                </template>

                <template v-if="isPassenger">
                    <button class="btn btn-primary" @click="$emit('cancelRequest')" v-if="canRequest" :disabled="sendingStatus">
                        <spinner class="blue" v-if="sending && sending.requestAction"></spinner>
                        <span v-else>Bajarme del viaje</span>
                    </button>
                </template>
            </template>
            <template v-if="expired">
                <button class="btn btn-primary" disabled> Finalizado  </button>
            </template>
            <template v-if="trip.seats_available === 0 && !trip.is_passenger">
                <div class="carpooled-trip"> Viaje Carpooleado </div>
            </template>
            <div class="alert alert-warning" role="alert" v-if="config.module_show_pending_request_count && !isPassengersView && !owner && trip.passengerPending_count > 2">
                Atención! Este viaje está siendo muy solicitado: {{ trip.passengerPending_count }} personas lo están solicitando
            </div>
        </div>
        <div class="buttons-container"  v-if="(isPassengersView && !owner)">
            <template v-if="true">
                <button class="btn btn-primary" @click="$emit('toMessages')" v-if="!owner" :disabled="sendingStatus">
                    <spinner class="blue" v-if="sending && sending.sendMessageAction"></spinner>
                    <span v-else>Enviar mensaje</span>
                </button>
            </template>
        </div>
    </div>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import spinner from '../Spinner.vue'

export default {
    name: 'TripButtons',
    components: {
        spinner
    },
    props: ['sending'],
    setup(props) {
        const store = useStore()

        const trip = computed(() => store.getters['trips/currentTrip'])
        const tripCardTheme = computed(() => store.getters['auth/tripCardTheme'])
        const user = computed(() => store.getters['auth/user'])
        const isMobile = computed(() => store.getters['device/isMobile'])
        const config = computed(() => store.getters['auth/appConfig'])

        const sendingStatus = computed(() => {
            return Object.keys(props.sending).some(k => props.sending[k] === true)
        })

        const isPassenger = computed(() => {
            return Array.isArray(trip.value.allPassengerRequest) ? 
                trip.value.allPassengerRequest.findIndex(item => 
                    item.user_id === user.value.id && 
                    (item.request_state === 1 || item.request_state === 4)
                ) >= 0 : false
        })

        const expired = computed(() => {
            return moment(trip.value.trip_date).format() < moment().format()
        })

        const owner = computed(() => {
            return trip.value && user.value && user.value.id === trip.value.user.id
        })

        const canRequest = computed(() => {
            return !owner.value && !trip.value.request
        })

        const isPassengersView = computed(() => {
            return trip.value.is_passenger
        })

        const onShareLinkClick = (event) => {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                event.preventDefault()
                let href = event.target.getAttribute('href')
                if (!href) {
                    href = event.target.parentElement.getAttribute('href')
                }
                if (href) {
                    window.location.href = href
                }
            }
        }

        const onWhatsAppShareClick = (event) => {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                event.preventDefault()
                if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
                    let message = 'Publiqué un viaje para compartir en Carpoolear'
                    window.plugins.socialsharing.shareViaWhatsApp(
                        message, 
                        null /* img */, 
                        decodeURIComponent(this.currentUrl),
                        () => console.log('share ok'),
                        errormsg => console.log('share not ok:', errormsg)
                    )
                }
            }
        }

        return {
            trip,
            tripCardTheme,
            user,
            isMobile,
            config,
            sendingStatus,
            isPassenger,
            expired,
            owner,
            canRequest,
            isPassengersView,
            onShareLinkClick,
            onWhatsAppShareClick
        }
    }
}
</script>
<style scoped>
    .buttons-container button:first-child {
        margin-right: 0;
    }
    .buttons-container button {
        margin-bottom: .4em;
    }
    .buttons-container {
        text-align: center;
        margin-top: 1em;
        padding-bottom: 2rem;
    }
    @media only screen and (min-width: 768px) {
        .buttons-container button:first-child {
            margin-right: 1em;
        }
        .buttons-container {
            left: 42px;
            bottom: -25px;
            position: absolute;
            padding-bottom: 0;
            z-index: 1;
        }
    }
    .alert-warning {
        max-width: 400px;
        margin: 1em auto;
    }
</style>
