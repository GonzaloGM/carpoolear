<template>
    <div class="row passengers" v-if="!trip.is_passenger && owner && acceptedPassengers.length">
        <div class="col-xs-24" v-if="owner && acceptedPassengers.length">
            <h4 class="title-margined">
                <strong>Pasajeros subidos</strong>
            </h4>
            <div v-for="p in acceptedPassengers" class="list-item" v-bind:key="p.id">
                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                    {{ p.user ? p.user.name : p.name }}
                </a>
                <a href="#" @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                        <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button @click="removePassenger(p)" class="trip_passenger-remove pull-right" aria-label="Bajar pasajero del viaje">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div v-if="trip.passenger.length === 0">
                Aún no hay pasajeros subidos a este viaje.
            </div>
        </div>
        <div v-else style="height: 2em;"></div>
        <div class="col-xs-24" v-if="owner && waitingForPaymentsPassengers.length">
            <h4 class="title-margined">
                <strong>Pasajeros pendiente de pago</strong>
            </h4>
            <div v-for="p in waitingForPaymentsPassengers" class="list-item" v-bind:key="p.id">
                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                    {{ p.user ? p.user.name : p.name }}
                </a>
                <a href="#" @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                        <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button @click="removePassenger(p)" class="trip_passenger-remove pull-right" aria-label="Bajar pasajero del viaje">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import dialogs from '../../services/dialogs.js'
import bus from '../../services/bus-event'

export default {
    name: 'TripPassengers',
    setup() {
        const store = useStore()
        const router = useRouter()
        const sending = ref(false)

        const trip = computed(() => store.getters['trips/currentTrip'])
        const tripCardTheme = computed(() => store.getters['auth/tripCardTheme'])
        const user = computed(() => store.getters['auth/user'])

        const owner = computed(() => {
            return trip.value && user.value && user.value.id === trip.value.user.id
        })

        const acceptedPassengers = computed(() => {
            console.log('acceptedPassengers', trip.value)
            return trip.value.allPassengerRequest ? trip.value.allPassengerRequest.filter(item => item.request_state === 1) : []
        })

        const waitingForPaymentsPassengers = computed(() => {
            return trip.value.allPassengerRequest ? trip.value.allPassengerRequest.filter(item => item.request_state === 4) : []
        })

        const calculateHeight = () => {
            nextTick(() => {
                bus.emit('calculate-height')
            })
        }

        const toUserMessages = async (user) => {
            try {
                const conversation = await store.dispatch('conversations/createConversation', user)
                router.push({ name: 'conversation-chat', params: { id: conversation.id } })
            } catch (error) {
                console.error(error)
                sending.value = false
            }
        }

        const toUserProfile = (user) => {
            router.replace({
                name: 'profile',
                params: {
                    id: user.id,
                    userProfile: user,
                    activeTab: 1
                }
            })
        }

        const removePassenger = async (user) => {
            if (window.confirm('¿Estás seguro que deseas bajar a este pasajero de tu viaje?')) {
                sending.value = true
                try {
                    await store.dispatch('passenger/cancel', { user, trip: trip.value })
                    sending.value = false
                    dialogs.message('removerPasajeroExitoso', { estado: 'success' })
                } catch {
                    sending.value = false
                }
            }
        }

        watch([acceptedPassengers, waitingForPaymentsPassengers], () => {
            calculateHeight()
        })

        onMounted(() => {
            calculateHeight()
        })

        return {
            trip,
            tripCardTheme,
            user,
            owner,
            acceptedPassengers,
            waitingForPaymentsPassengers,
            sending,
            toUserMessages,
            toUserProfile,
            removePassenger
        }
    }
}
</script>

<style scoped>
    .trip_driver_img.circle-box.passenger {
        width: 3.5em;
        height: 3.5em;
        position: relative;
        margin-right: .5em;
    }
    .passengers {
        margin-bottom: .8em;
    }
        .trip_passenger-chat,
    .trip_passenger-remove,
    .trip_passenger_image,
    .trip_passenger_name {
        vertical-align: middle;
        cursor: pointer;
    }
    .trip_passenger-chat,
    .trip_passenger-remove {
        font-size: 1.8em;
        background: none;
        border: 0;
    }
    .trip_passenger-remove {
        margin-left: .5em;
        margin-top: .25em;
    }
    .trip_passenger-chat {
        margin-left: .5em;
    }
    @media only screen and (min-width: 400px) and (max-width: 767px) {
        .trip_driver_img {
            width: 6.7rem;
            height: 6.7rem;
        }
    }
</style>
