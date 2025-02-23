<template>
    <div class="trip-date">
        <div class="row" v-if="tripCardTheme !== 'light'">
            <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date" v-if="tripCardTheme !== 'light'">
                <span class="trip_datetime_date">{{ formatDate(trip.trip_date, "DD MMMM YYYY") }}</span>
                -
                <span class="trip_datetime_time">{{ formatDate(trip.trip_date, "HH:mm") }}</span>
            </time>
        </div>
        <template v-else>
            <time class="trip_date_right" :datetime="trip.trip_date">
                <div class="trip_date_date">
                    <span class="trip_date_date_day">
                        <span>{{ formatDate(trip.trip_date, "DD") }}</span>
                    </span>
                    <br v-if="isMobile" />
                    <span v-if="isMobile" class="trip_date_date_month">{{ formatDate(trip.trip_date, "MMM") }}</span>
                    <span v-else class="trip_date_date_month">{{ formatDate(trip.trip_date, "MMMM") }}</span>
                </div>
            </time>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
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

        const formatDate = (date, format) => {
            return moment(date).format(format)
        }

        return {
            trip,
            tripCardTheme,
            isMobile,
            formatDate
        }
    }
}
</script>

<style scoped>
    .trip_datetime {
        margin-top: 0;
        margin-bottom: 0;
    }
    @media only screen and (min-width: 768px) {
        .trip_datetime {
            margin-top: 1rem;
            margin-bottom: 1.5rem;
        }
        .trip_date_right {
            float: none;
            padding-right: 0;
        }
        .trip_date_date_month {
            padding-left: .4em;
        }
    }
</style>