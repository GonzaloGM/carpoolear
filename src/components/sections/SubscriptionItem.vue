<template>
    <div class="suscription-item_component panel panel-default" @click="search(true)">
        <div class="row panel-body">
            <div class="col-xs-20">
                <div class="suscription-item-detail" v-if="subscription.from_address">
                    <div class="suscription-item-detail--content">
                        <span>Origen:</span>
                        <strong>{{ subscription.from_address }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.to_address">
                    <div class="suscription-item-detail--content">
                        <span>Destino:</span>
                        <strong>{{ subscription.to_address }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.trip_date">
                    <div class="suscription-item-detail--content">
                        <span>Fecha aproximada:</span>
                        <strong>{{ formattedDate }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.is_passenger == 1">
                    <div class="suscription-item-detail--content">
                        <span>Busco pasajeros</span>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="resultCount > 0">
                    <div class="suscription-item-detail--content">
                        <span>Coincidencias:</span>
                        <span class="badge">
                            {{ resultCount }}
                            {{ resultCount === 20 ? '+' : '' }}
                        </span>
                    </div>
                </div>

            </div>
            <div class="col-xs-4">
                <button v-on:click.stop="remove" :disabled="inProgress" class="btn btn-default"  aria-label="Eliminar suscripción">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>

    </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'
import dialogs from '../../services/dialogs'

export default {
    name: 'subscription-item',
    props: {
        subscription: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()
        
        const inProgress = ref(false)
        
        const isMobile = computed(() => store.getters['app/isMobile'])
        const user = computed(() => store.getters['auth/user'])
        const config = computed(() => store.getters['auth/appConfig'])
        const formattedDate = computed(() => {
            return moment(props.subscription.created_at).format('DD/MM/YYYY')
        })

        const search = (fromSubscription) => {
            router.push({
                name: 'trips',
                query: {
                    from_address: props.subscription.from_address,
                    to_address: props.subscription.to_address,
                    fromSubscription: fromSubscription ? 1 : 0
                }
            })
        }

        const deleteSubscription = async () => {
            if (inProgress.value) return
            
            inProgress.value = true
            try {
                await store.dispatch('subscriptions/delete', props.subscription)
                dialogs.success('Suscripción eliminada')
            } catch (error) {
                console.error('Error deleting subscription:', error)
                dialogs.error('No se pudo eliminar la suscripción')
            } finally {
                inProgress.value = false
            }
        }

        return {
            formattedDate,
            isMobile,
            user,
            config,
            inProgress,
            search,
            deleteSubscription
        }
    }
}
</script>
<style scoped>
    .badge {
        background: red;
    }
</style>
