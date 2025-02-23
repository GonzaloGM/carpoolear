<template>
    <div class="row trip-stats" v-if="!trip.is_passenger && !isPassengersView">

        <div class="list_item" v-if="trip.total_price > 0">
            <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <div class="label-soft" v-if="tripCardTheme !== 'light'" style='color: var(--trip-almost-fill-color); font-weight: bold'>{{ 'Total de combustible + peajes a compartir' }}</div>
            <div><span style='color: var(--trip-almost-fill-color)'>$ {{trip.total_price}}</span> (estimado por el conductor)</div>
        </div>
        <div>
            <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Distancia a recorrer</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ distanceString }} <abbr title="kilometros">km</abbr></span>
        </div>
        <div>
            <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Tiempo estimado de viaje</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ trip.estimated_time }} horas</span>
        </div>
        <div>
            <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Huella de carbono (<abbr title="aproximada">aprox</abbr>)</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ (trip.distance / 1000 * 1.5).toFixed(2) }} <abbr title="kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr></span>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SvgItem from '../SvgItem'

export default {
    name: 'TripDate',
    components: {
        SvgItem
    },
    setup() {
        const store = useStore()

        const trip = computed(() => store.getters['trips/currentTrip'])
        const tripCardTheme = computed(() => store.getters['auth/tripCardTheme'])
        const isMobile = computed(() => store.getters['device/isMobile'])

        const distanceString = computed(() => {
            return Math.floor(trip.value.distance / 1000)
        })

        const isPassengersView = computed(() => {
            return trip.value.is_passenger
        })

        return {
            trip,
            tripCardTheme,
            isMobile,
            distanceString,
            isPassengersView
        }
    }
}
</script>

<style scoped>
</style>
