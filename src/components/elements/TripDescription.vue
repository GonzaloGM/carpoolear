<template>
    <div v-if="trip.description && trip.description.length" class="row italic quote" :class="descriptionLength">
        <i class="fa fa-quote-left" aria-hidden="true"></i>
        <span> {{trip.description}} </span>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'TripDescription',
    setup() {
        const store = useStore()

        const trip = computed(() => store.getters['trips/currentTrip'])
        const tripCardTheme = computed(() => store.getters['auth/tripCardTheme'])
        
        const descriptionLength = computed(() => {
            return trip.value.description.length > 215 ? 'long-description' : ''
        })

        return {
            trip,
            tripCardTheme,
            descriptionLength
        }
    }
}
</script>

<style scoped>
    .quote {
        margin-left: 1em;
    }
    @media only screen and (min-width: 768px) {
        .trip-detail-component .quote {
            margin-left: 0;
        }
        .trip-detail-component .quote.long-description {
            font-size: 14px;
        }
    }
</style>