<template>
  <div class="profile-trip-component container">
        <div class="col-xs-24">
            <h2>Viajes <strong>Creados</strong></h2>
            <Loading :data="driverTrips">
                <template #default>
                    <div class="trips-list">
                        <Trip v-for="trip in driverTrips" 
                             :key="trip.id" 
                             :clickModal="user.is_admin" 
                             :trip="trip" 
                             :user="user" />
                    </div>
                </template>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">No hay viajes</p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        Cargando viajes ...
                    </p>
                </template>
            </Loading>
        </div>

        <div v-if="user.is_admin">
            <div class="col-xs-24">
                <h2>Viajes <strong>Pasajero</strong></h2>
                <Loading :data="passengerTrips">
                    <template #default>
                        <div class="trips-list">
                            <Trip v-for="trip in passengerTrips" 
                                 :key="trip.id" 
                                 :trip="trip" 
                                 :clickModal="user.is_admin"  
                                 :user="user" />
                        </div>
                    </template>
                    <template #no-data>
                        <p class="alert alert-warning" role="alert">No estas subido a ningún viaje.</p>
                    </template>
                    <template #loading>
                        <p class="alert alert-info" role="alert">
                            <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                            Cargando viajes ...
                        </p>
                    </template>
                </Loading>
            </div>

            <div class="col-xs-24" v-if="oldDriverTrips">
                <h2>Mis viajes pasados</h2>
                <Loading :data="oldDriverTrips">
                    <template #default>
                        <div class="trips-list">
                            <Trip v-for="trip in oldDriverTrips" :key="trip.id" :clickModal="user.is_admin" :trip="trip" :user="user" />
                        </div>
                    </template>
                    <template #no-data>
                        <p class="alert alert-warning" role="alert">No hay ningún viaje pasado</p>
                    </template>
                    <template #loading>
                        <p class="alert alert-info" role="alert">
                            <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                            Cargando viajes ...
                        </p>
                    </template>
                </Loading>
            </div>

            <div class="col-xs-24" v-if="oldPassengerTrips">
                <Loading :data="oldPassengerTrips">
                    <template #title>
                        <h2>Viajes a los que me <strong>subí</strong></h2>
                    </template>
                    <template #default>
                        <div class="trips-list">
                            <Trip v-for="trip in oldPassengerTrips" :key="trip.id" :clickModal="user.is_admin" :trip="trip" :user="user" />
                        </div>
                    </template>
                    <template #no-data>
                        <p class="alert alert-warning" role="alert">No te has subido a ningún viaje.</p>
                    </template>
                    <template #loading>
                        <p class="alert alert-info" role="alert">
                            <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                            Cargando viajes ...
                        </p>
                    </template>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Trip from '../sections/Trip.vue'
import Loading from '../Loading.vue'
import Tab from '../elements/Tab.vue'

export default {
    name: 'profile-trip',
    components: {
        Trip,
        Loading,
        Tab
    },
    props: {
        userId: {
            type: [String, Number],
            required: false
        }
    },
    setup(props) {
        const store = useStore()
        
        const driverTrips = ref([])
        const passengerTrips = ref([])
        const oldDriverTrips = ref([])
        const oldPassengerTrips = ref([])

        const user = computed(() => store.getters['auth/user'])

        onMounted(async () => {
            try {
                // Load current trips
                const [currentDriverTrips, currentPassengerTrips] = await Promise.all([
                    store.dispatch('trips/getDriverTrips', props.userId),
                    store.dispatch('trips/getPassengerTrips', props.userId)
                ])
                driverTrips.value = currentDriverTrips
                passengerTrips.value = currentPassengerTrips

                // Load old trips
                const [oldDriverTripsData, oldPassengerTripsData] = await Promise.all([
                    store.dispatch('trips/getOldDriverTrips', props.userId),
                    store.dispatch('trips/getOldPassengerTrips', props.userId)
                ])
                oldDriverTrips.value = oldDriverTripsData
                oldPassengerTrips.value = oldPassengerTripsData
            } catch (error) {
                console.error('Error loading trips:', error)
            }
        })

        return {
            driverTrips,
            passengerTrips,
            oldDriverTrips,
            oldPassengerTrips,
            user
        }
    }
}
</script>

<style scoped>
    h2 {
        font-weight: 300;
    }
</style>
