<template>
  <div :class="tripCardCountClass" v-on:click='clickModal ? openModal() : goToDetail(false)'>
    <tripDisplay v-if="showTrip && clickModal" :trip="trip" :clickOutside="closeModal.bind(this)"></tripDisplay>
    <div class="trip" :class="{ 'trip-fill': seats_available === 0, 'trip-almost-fill': seats_available === 1, 'trip-mostly-available': seats_available > 3, 'trip-with-driver': user, 'trip-with-control': enableChangeSeats }">
        <div class="panel panel-default panel-card card card-trip" :class="[tripCardClass]">
          <div class="panel-heading card_heading">
            <div class="panel-title card-trip_title row">
              <div class="card-icon" v-if="tripCardTheme !== 'light'">
                <span class="trip_visibility">
                  <span v-if="trip.friendship_type_id === 0" title="Visibilidad: Solo amigos">
                    <span class="tooltip" title="Visibilidad: Solo amigos" data-tooltip="Solo amigos.">
                      <i class="fa fa-user" aria-hidden="true"></i>
                    </span>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 1" title="Visibilidad: Amigos de amigos">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 2" title="Visilidad: Público">
                    <span class="tooltip-bottom" title="Visibilidad: Público" data-tooltip="Público">
                      <i class="fa fa-globe" aria-hidden="true"></i>
                    </span>
                  </span>
                </span>
              </div>

            <time class="trip_date_right" :datetime="trip.trip_date" v-if="tripCardTheme === 'light'">
                <div class="trip_date_date">
                    <span class="trip_date_date_day">
                        <span>{{ [ trip.trip_date ] | moment("DD") }}</span>
                    </span>
                    <br />
                    <span class="trip_date_date_month">{{ [ trip.trip_date ] | moment("MMM") }}</span>
                </div>
            </time>
              <template v-if="user">
                <div class="trip_driver_img_container"  v-on:click='goToProfile'>
                  <div class="trip_driver_img circle-box" v-imgSrc:profile="getUserImage"></div>
                </div>
                <div class="trip_driver_details">
                  <div class="trip_driver_name"  v-on:click='goToProfile'>
                    {{ trip.user.name }}
                  </div>
                  <div class="trip_driver_ratings" v-if="config ? config.trip_stars : false && tripStars && tripStars.length > 0">
                    <div v-if="trip.user.positive_ratings || trip.user.positive_ratings">
                        <svg-item v-for="{value, id} in tripStars" :key="id" :size="24" :icon="'star' + value"></svg-item>
                    </div>
                    <div v-else>
                        {{ $t('noCalificado') }}
                    </div>                  
                  </div>
                  <div class="trip_driver_ratings" v-else>
                    {{ trip.user.positive_ratings + trip.user.negative_ratings }} {{ $t('calificaciones') }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="panel-body card_body">
            <template  v-if="tripCardTheme === 'light'">
                <div class="trip_seats-available_with-icons">
                    <div class="trip_seats-available" v-if="!trip.is_passenger">
                        <template v-for="n in trip.total_seats">
                            <span :class="n < (trip.total_seats - trip.seats_available) ? 'seat-taken' : 'seat-free'">
                                <svg-item :icon="'seat'" :size="18"></svg-item>
                            </span>
                        </template>
                    </div>
                </div>
            </template>
            <div class="trip_location">
              <template v-if="trip.points.length >= 2">
                <div class="row trip_location_from">
                  <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                    <span class="trip_from_time">{{ trip.trip_date | moment("HH:mm") }} </span>
                  </div>
                  <div class="text-right" :class="tripCardTheme === 'light' ? 'col-xs-2' : 'col-xs-4'">
                    <i class="fa fa-map-marker" aria-hidden="true" v-if="tripCardTheme !== 'light'"></i>
                    <i class="fa fa-circle" aria-hidden="true" v-else></i>
                  </div>
                  <div :class="config && config.trip_card_design === 'light'? 'col-xs-14' : 'col-xs-18'">
                    <span class="trip_location_from_city" :style="originLongName ? LONG_NAME_STYLE : {}">
                        {{ getLocationName(trip.points[0]) }}
                    </span>
                    <span class="trip_location_from_state-country">
                        {{ getStateName(trip.points[0]) | googleInfoClean }}
                    </span>
                  </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                    <span class="trip_to_time">{{ tripArrivingTime | moment("HH:mm") }} </span>
                  </div>
                  <div class="text-right" :class="tripCardTheme === 'light' ? 'col-xs-2' : 'col-xs-4'">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div :class="config && config.trip_card_design === 'light'? 'col-xs-14' : 'col-xs-18'">
                    <span class="trip_location_to_city" :style="destinyLongName ? LONG_NAME_STYLE : {}">
                        {{ getLocationName(trip.points[trip.points.length - 1]) }}
                    </span>
                    <span class="trip_location_to_state-country">
                        {{ getStateName(trip.points[trip.points.length - 1]) | googleInfoClean }}
                    </span>
                  </div>
                </div>
                <div class="col-xs-4 trip_location-dot-line trip_location-dot-line-small">
                  <div></div>
                </div>
              </template>
              <template v-else>
                  <div class="row trip_location_from">
                    <div class="col-xs-4 text-right">
                      <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div  class="col-xs-20">
                      {{ trip.from_town.slice(0,23) + '' + (trip.from_town.length > 34 ? '...' : '')}}
                    </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    {{ trip.to_town.slice(0,23) + '' + (trip.to_town.length > 34 ? '...' : '')}}
                  </div>
                </div>
              </template>
            </div>
            <div class="row">
                <time class="trip_datetime col-xs-24" :datetime="trip.trip_date" v-if="tripCardTheme !== 'light'">
                    <div class="row">
                        <div class="col-xs-14 trip_datetime_date">
                            <span class="trip_datetime_date_day">
                                <span style="text-transform: uppercase;">{{ [ trip.trip_date ] | moment("ddd") }}</span>
                                {{ [ trip.trip_date ] | moment("DD MMMM") }}
                            </span>
                            <br />
                            <span class="trip_datetime_date_year">{{ [ trip.trip_date ] | moment("YYYY") }}</span>
                        </div>
                        <div class="col-xs-10">
                            <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("HH:mm") }} hs</span>
                        </div>
                    </div>
                </time>
            </div>
            <template v-if="tripCardTheme !== 'light'">
                <template v-if="!enableChangeSeats">
                    <div v-if="trip.seats_available !== 0" class="row">
                        <div class="trip_seats-available col-xs-offset-2 col-xs-12" v-if="!trip.is_passenger">
                            <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                            <span class="trip_seats-available_label" v-if="trip.seats_available > 1">
                                <span>{{ $t('Lugares') }}</span><span>{{ $t('libres') }}</span>
                            </span>
                            <span class="trip_seats-available_label" v-else="trip.seats_available > 1">
                                <span>{{ $t('Lugar') }}</span><span>{{ $t('libre') }}</span>
                            </span>
                        </div>
                        <div class="col-xs-offset-2 col-xs-12" v-else>
                            <div class="passenger-looking-for-trip" v-if="tripCardTheme !== 'light' && trip.is_passenger">
                                <strong class="warning-is-passenger">Pasajero que busca viaje</strong>
                            </div>
                        </div>
                        <div class="trip_actions col-xs-10">
                            <div class="btn btn-default btn-lg btn-trip-detail">{{ $t('Ver') }}</div>
                        </div>
                    </div>
                    <div v-if="trip.seats_available === 0" class="row row--carpooleado">
                        <div class="trip_seats-available col-xs-offset-6 col-xs-18 carpooleado">
                            <span>{{ $t('Carpooleado') }}</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="row">
                        <div v-if="!trip.is_passenger" class="trip-seats-control col-xs-offset-2">
                            <button aria-label="Disminuir en uno la cantidad de asientos" v-on:click.stop="changeSeatsNumber(-1)" :disabled="sending || trip.total_seats < 1" class="btn btn-default">
                                -
                            </button>
                            <span class="trip_seats-available_value">
                                {{ seats_available }}
                            </span>
                            <button aria-label="Aumentar en uno la cantidad de asientos" v-on:click.stop="changeSeatsNumber(1)" :disabled="sending || seats_available > 3" class="btn btn-default">
                                +
                            </button>
                            <span class="trip_seats-available_label" v-if="seats_available > 1">
                                <span>{{ $t('Lugares') }} {{ $t('libres') }}</span>
                            </span>
                            <span class="trip_seats-available_label" v-if="seats_available === 1">
                                <span>{{ $t('Lugar') }} {{ $t('libre') }}</span>
                            </span>
                            <span class="trip_seats-available_label" v-if="seats_available === 0">
                                {{ $t('Carpooleado') }}
                            </span>
                        </div>
                        <div class="trip-inline-controls row">
                            <span class="col-xs-6">
                                <button v-on:click.stop="goToDetail(false)" class="btn btn-default" aria-label="Ver detalle del viaje">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </button>
                            </span>
                            <span class="col-xs-6">
                                <button v-on:click.stop="goToDetail(false, true)" v-if="!trip.is_passenger" :disabled="!trip.passenger.length" class="btn btn-default"  aria-label="Ver pasajeros subidos">
                                    <i class="fa fa-users" aria-hidden="true"></i>
                                </button>
                            </span>
                            <span class="col-xs-6">
                                <button v-on:click.stop="goToDetail(true)" class="btn btn-default" aria-label="Editar viaje">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                            </span>
                            <span class="col-xs-6">
                                <button v-on:click.stop="deleteTrip" class="btn btn-default"  aria-label="Eliminar viaje">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </template>
            </template>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event.js';
import tripDisplay from './TripDisplay.vue';
import moment from 'moment';
import SvgItem from '../elements/SvgItem.vue'

export default {
    name: 'trip',
    components: {
        tripDisplay,
        SvgItem
    },
    props: {
        trip: {
            type: Object,
            required: true
        },
        user: {
            type: Object,
            default: null
        },
        clickModal: {
            type: Boolean,
            default: false
        },
        enableChangeSeats: {
            type: Boolean,
            default: false
        },
        tripCardTheme: {
            type: String,
            default: 'default'
        },
        tripCardClass: {
            type: String,
            default: ''
        },
        tripCardCountClass: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()
        
        const showTrip = ref(false)
        const inProgress = ref(false)

        const config = computed(() => store.getters['auth/appConfig'])
        const seats_available = computed(() => props.trip.seats_available)
        const getUserImage = computed(() => props.user ? props.user.image : null)
        const tripStars = computed(() => {
            if (!props.trip.user || !props.trip.user.positive_ratings) return []
            return Array(5).fill().map((_, i) => ({
                id: i,
                value: i < props.trip.user.positive_ratings ? '-full' : '-empty'
            }))
        })

        const openModal = () => {
            showTrip.value = true
        }

        const closeModal = () => {
            showTrip.value = false
        }

        const goToDetail = (fromMap) => {
            if (!props.clickModal) {
                router.push({ 
                    name: 'trip', 
                    params: { 
                        id: props.trip.id,
                        fromMap: fromMap ? 1 : 0
                    }
                })
            }
        }

        const goToProfile = () => {
            router.push({ name: 'profile', params: { id: props.trip.user.id }})
        }

        const updateSeats = async () => {
            if (inProgress.value) return
            
            inProgress.value = true
            try {
                await store.dispatch('trips/updateSeats', {
                    tripId: props.trip.id,
                    seats: seats_available.value
                })
            } catch (error) {
                console.error('Error updating seats:', error)
            } finally {
                inProgress.value = false
            }
        }

        return {
            showTrip,
            inProgress,
            config,
            seats_available,
            getUserImage,
            tripStars,
            openModal,
            closeModal,
            goToDetail,
            goToProfile,
            updateSeats
        }
    },
    data () {
        return {
            sending: false,
            CITY_NAME_LONG_LENGTH: 16,
            LONG_NAME_STYLE: {
                'font-size': '17px'
            },
            showTrip: false
        };
    },
    computed: {
        originLongName () {
            if (this.trip.points) {
                let name = this.getLocationName(this.trip.points[0]);
                return name.length > this.CITY_NAME_LONG_LENGTH;
            } else {
                return false;
            }
        },
        destinyLongName () {
            if (this.trip.points) {
                let name = this.getLocationName(this.trip.points[this.trip.points.length - 1]);
                return name.length > this.CITY_NAME_LONG_LENGTH;
            } else {
                return false;
            }
        },
        tripArrivingTime () {
            if (this.trip && this.trip.estimated_time) {
                let minutes = 0;
                minutes = parseInt(this.trip.estimated_time.split(':')[0]) * 60;
                minutes += parseInt(this.trip.estimated_time.split(':')[1]);
                return moment(this.trip.trip_date).add(minutes, 'minutes');
            }
            return '';
        },
        tripStars () {
            if (this.trip && this.trip.user) {
                let value = this.trip.user.positive_ratings / (this.trip.user.positive_ratings + this.trip.user.negative_ratings) * 5;
                let integerPart = Math.floor(value);
                let decimalPart = value - integerPart;
                let stars = [];
                for (let i = 1; i <= 5; i++) {
                    if (i < integerPart) {
                        stars.push({
                            id: i,
                            value: ''
                        });
                    } else {
                        if (i === integerPart) {
                            if (decimalPart >= 0.5) {
                                stars.push({
                                    id: i,
                                    value: ''
                                });
                            } else {
                                stars.push({
                                    id: i,
                                    value: '-half'
                                });
                            }
                        } else {
                            stars.push({
                                id: i,
                                value: '-empty'
                            });
                        }
                    }
                }
                return stars;
            } else {
                return [];
            }
        }
    },
    mounted () {
        if (this.trip) {
            this.seats_available = this.trip.seats_available;
        }
    },
    updated () {
    }
};
</script>
<style scoped>
    .trip-seats-control .trip_seats-available_value {
        margin-right: .15em;
        margin-left: .15em;
    }
    .trip-seats-control .trip_seats-available_label {
        position: static;
        top: 0;
        margin-left: .5em;
    }
    .trip-fill .trip-seats-control .trip_seats-available_label {
        color: var(--trip-half-free-color);
    }
    .trip-seats-control .btn {
        background: #EEE;
        min-width: 2.5em;
    }
    .trip-seats-control .btn[disabled] {
        opacity: 0.25;
    }
    .trip-seats-control .btn[disabled]:hover {
        background: #EEE;
    }
    .trip-seats-control > * {
        vertical-align: middle;
    }
    .trip-with-control .card-trip {
        height: 470px;
    }
    .trip-inline-controls .btn {
        width: 100%;
    }
    .trip-inline-controls {
        margin-top: 1em;
    }

    .trip-inline-controls .btn[disabled] {
        opacity: 0.20;
    }
    .trip-inline-controls .btn[disabled]:hover {
        background: #EEE;
    }
    @media (min-width: 1200px) {
        .trip-with-control .card-trip {
            height: 500px;
        }
    }
</style>
