<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix" v-if="trip">
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <h3>Confirmá tu asiento</h3>
                    Te han aceptado en el viaje hacia <strong>{{ trip.points[trip.points.length - 1].json_address ? trip.points[trip.points.length - 1].json_address.name : trip.points[trip.points.length - 1].address }} del día {{ formatDate(trip.trip_date, "DD/MM/YYYY") }} a las {{ formatDate(trip.trip_date, "HH:mm") }}</strong> ahora debes realizar el pago de <strong>$ {{ trip.seat_price }}</strong> para confirmar tu asiento.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="onAcceptPayment"> Pagar </button>
                        <button class="btn btn-default" :disabled="rejectInProcess" @click="rejectPayment"> Cancelar </button>
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
    name: 'pending-payment-request',
    components: {
        modal,
        spinner
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()

        const acceptInProcess = ref(false)
        const rejectInProcess = ref(false)
        const showModalPayment = ref(false)

        const user = computed(() => store.getters['auth/user'])
        const config = computed(() => store.getters['auth/appConfig'])
        const trip = computed(() => props.request.trip)

        const formatDate = (date, format) => {
            return moment(date).format(format)
        }

        const onAcceptPayment = () => {
            if (user.value.do_not_alert_payment || config.value.disable_user_hints) {
                acceptPayment()
            } else {
                showModalPayment.value = true
            }
        }

        const acceptPayment = async () => {
            if (acceptInProcess.value) return
            
            acceptInProcess.value = true
            try {
                await store.dispatch('passenger/acceptPayment', props.request)
                router.push({ name: 'payment', params: { id: props.request.id }})
            } catch (error) {
                console.error('Error accepting payment:', error)
                dialogs.error('No se pudo procesar el pago')
            } finally {
                acceptInProcess.value = false
            }
        }

        const rejectPayment = async () => {
            if (rejectInProcess.value) return
            
            rejectInProcess.value = true
            try {
                await store.dispatch('passenger/rejectPayment', props.request)
            } catch (error) {
                console.error('Error rejecting payment:', error)
                dialogs.error('No se pudo rechazar el pago')
            } finally {
                rejectInProcess.value = false
            }
        }

        return {
            acceptInProcess,
            rejectInProcess,
            showModalPayment,
            user,
            config,
            trip,
            formatDate,
            onAcceptPayment,
            acceptPayment,
            rejectPayment
        }
    }
}
</script>
