<template>
    <div>
        <div class="row text-center foreignCountry-select foreignCountry-select-desktop" v-show="!isMobile">
            <div class="foreignCountry-select_wrapper">
                <input type="checkbox" v-model="allowForeignPoints" id="cbxAllowForeignPoints" class="cbx" />
                <label for="cbxAllowForeignPoints" class="cbx_label">
                    Origen o destino fuera de {{ config ? config.country_name : '' }}
                </label>
                <span class="tooltip-bottom" data-tooltip="Marcando esta opción vas a poder seleccionar origen o destino fuera de Argentina. Recordá averiguar con la aseguradora del auto, si tenés cobertura contra terceros fuera de la Argentina. Si no es así, averiguá con ella para obtener la extensión fuera de Argentina, de forma de tener cobertura durante el viaje"></span>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
        </div>
        <div class="row search-section">
            <div class="col-xs-12 col-md-4">
                <button class="btn btn-option" :class="{'active': !isPassenger}" @click="isPassenger = false" >
                    <!--<img alt="" :src="isPassenger ? chofer_logo_gris : chofer_logo_blanco" />-->
                    <span class="fa fa-car" aria-hidden="true"></span>
                    <span>conductor</span>
                </button>
            </div>
            <div class="col-xs-12 col-md-4">
                <button class="btn btn-option" :class="{'active': isPassenger}" @click="isPassenger = true" >
                    <img alt="" :src="isPassenger ? pasajero_logo_blanco : pasajero_logo_gris" />
                    <span>pasajero</span>
                </button>
            </div>
            <div class="row text-center foreignCountry-select foreignCountry-select-mobile" v-show="isMobile">
                <div class="foreignCountry-select_wrapper">
                    <input type="checkbox" v-model="allowForeignPoints" id="cbxAllowForeignPoints" class="cbx" />
                    <label for="cbxAllowForeignPoints" class="cbx_label">
                        Origen o destino fuera de {{ config ? config.country_name : '' }}
                    </label>
                    <span class="tooltip-bottom" data-tooltip="Marcando esta opción vas a poder seleccionar origen o destino fuera de Argentina. Recordá averiguar con la aseguradora del auto, si tenés cobertura contra terceros fuera de la Argentina. Si no es así, averiguá con ella para obtener la extensión fuera de Argentina, de forma de tener cobertura durante el viaje"></span>
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
            </div>

            <div class="col-xs-24 col-md-8 gmap-autocomplete origin">
                <Autocomplete :placeholder="'Origen'" name="from_town" ref="from_town" :value="from_town.name" v-on:place_changed="(data) => getPlace(0, data)" :classes="'form-control form-control-with-icon form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'AR'"></Autocomplete>
                <!-- <GmapAutocomplete name="from_town" ref="from_town" :selectFirstOnEnter="true" :types="['(cities)']"  :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}"  placeholder="Origen"  :value="from_town.name" v-on:place_changed="(data) => getPlace(0, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>-->
                <div class="date-picker--cross">
                    <i v-on:click="resetInput('from_town')" class="fa fa-times" aria-hidden="true"></i>
                </div>
                <div class="optional-warning text-center">(opcional)</div>
                <div class="swap btn">
                    <img alt="swap" class='swap-horizontal' :src="swap_horizontal" @click="swapCities" />
                    <img alt="swap" class='swap-vertical' :src="swap_vertical" @click="swapCities" />
                </div>
            </div>
            <div class="col-xs-24 col-md-8 gmap-autocomplete destiny">
                <Autocomplete :placeholder="'Destino'" name="to_town" ref="to_town" :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" :classes="'form-control form-control-with-icon form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'AR'"></Autocomplete>
                <!-- <GmapAutocomplete name="to_town" ref="to_town" :selectFirstOnEnter="true" :types="['(cities)']"  :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}"  placeholder="Destino"  :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete> -->
                <div class="date-picker--cross">
                    <i v-on:click="resetInput('to_town')" class="fa fa-times" aria-hidden="true"></i>
                </div>
                <div class="optional-warning text-center">(opcional)</div>
            </div>


            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker ref="datepicker" :value="from_date" :class="{'has-error': dateError.state}" v-on:date_changed="(date) => this.from_date = date"></DatePicker>
                <div class="optional-warning text-center">(opcional)</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker ref="datepicker" :value="to_date" :class="{'has-error': dateError.state}" v-on:date_changed="(date) => this.to_date = date"></DatePicker>
                <div class="optional-warning text-center">(opcional)</div>
            </div>



            <div class="col-xs-24 col-md-8 gmap-autocomplete origin">
                <div class="search-users">
                    <input v-model="userSearch" v-on:keyup="onSearchUsers" type="text" class="form-control form-control-with-icon search-users-input" placeholder="Escribe un nombre" />
                    <div v-if="userSearch.length != 0 && showAutocomplete">
                        <loading class="autocomplete-users" :data="userList">
                            <li v-for="user in userList" class="list-group-item conversation_header" @click="selectUser(user)"  v-bind:key="user.id">
                                <div class="media">
                                  <div class="media-body">
                                    <h4 class="media-heading"><span class="conversation-title">{{ user.name }}</span></h4>
                                    <span> {{ user.email }} </span>
                                  </div>
                                </div>
                            </li>
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No se encontro ningun usuario</li>
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">
                                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                                Cargando usuarios ...
                            </li>
                        </loading>
                    </div>
                </div>
                <div class="date-picker--cross">
                    <i v-on:click="resetUser()" class="fa fa-times" aria-hidden="true"></i>
                </div>
                <div class="optional-warning text-center">(opcional)</div>
            </div>



            <div class="col-xs-24 col-md-8 col-lg-8">
                <button class="btn btn-primary btn-search" @click="emit">Buscar</button>
            </div>

        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import DatePicker from '../DatePicker'
import moment from 'moment'
import dialogs from '../../services/dialogs.js'
import loading from '../Loading'
import Autocomplete from '../Autocomplete'

export default {
    name: 'search-trip',
    components: {
        DatePicker,
        loading,
        Autocomplete
    },
    setup() {
        const store = useStore()
        
        const minDate = ref(moment().toDate())
        const isPassenger = ref(false)
        const isAdmin = ref(true)
        const from_town = ref({
            name: '',
            location: null,
            radio: 0,
            country: 'ARG'
        })
        const to_town = ref({
            name: '',
            location: null,
            radio: 0,
            country: 'ARG'
        })
        const from_date = ref('')
        const to_date = ref('')
        const dateAnswer = ref('')
        const dateError = ref({
            message: '',
            state: ''
        })
        const userSearch = ref('')
        const userList = ref([])
        const showAutocomplete = ref(true)
        const selectedUser = ref(null)
        const allowForeignPoints = ref(false)

        const isMobile = computed(() => store.getters['device/isMobile'])
        const config = computed(() => store.getters['auth/appConfig'])

        const chofer_logo_blanco = ref(process.env.ROUTE_BASE + 'static/img/icono-conductor-blanco.png')
        const pasajero_logo_blanco = ref(process.env.ROUTE_BASE + 'static/img/icono-pasajero-blanco.png')
        const chofer_logo_gris = ref(process.env.ROUTE_BASE + 'static/img/icono-conductor-gris.png')
        const pasajero_logo_gris = ref(process.env.ROUTE_BASE + 'static/img/icono-pasajero-gris.png')
        const swap_horizontal = ref(process.env.ROUTE_BASE + 'static/img/flechas_horizontales.png')
        const swap_vertical = ref(process.env.ROUTE_BASE + 'static/img/flechas_verticales.png')

        const getPlace = (index, place) => {
            if (index === 0) {
                from_town.value.name = place.name
                from_town.value.location = place.location
                from_town.value.radio = place.radio
                from_town.value.country = place.country
            } else {
                to_town.value.name = place.name
                to_town.value.location = place.location
                to_town.value.radio = place.radio
                to_town.value.country = place.country
            }
        }

        const resetInput = (ref) => {
            if (ref === 'from_town') {
                from_town.value.name = ''
                from_town.value.location = null
            } else {
                to_town.value.name = ''
                to_town.value.location = null
            }
        }

        const swapCities = () => {
            const temp = { ...from_town.value }
            from_town.value = { ...to_town.value }
            to_town.value = temp
        }

        const onSearchUsers = async () => {
            if (userSearch.value.length > 2) {
                showAutocomplete.value = true
                userList.value = await store.dispatch('users/searchUsers', userSearch.value)
            } else {
                userList.value = []
            }
        }

        const selectUser = (user) => {
            selectedUser.value = user
            userSearch.value = user.name
            showAutocomplete.value = false
        }

        const resetUser = () => {
            selectedUser.value = null
            userSearch.value = ''
        }

        const emit = () => {
            store.dispatch('admin/searchTrips', {
                from_town: from_town.value,
                to_town: to_town.value,
                from_date: from_date.value,
                to_date: to_date.value,
                is_passenger: isPassenger.value,
                user: selectedUser.value
            })
        }

        onMounted(() => {
            from_town.value.country = config.value.osm_country
            to_town.value.country = config.value.osm_country
        })

        return {
            minDate,
            isPassenger,
            isAdmin,
            from_town,
            to_town,
            from_date,
            to_date,
            dateAnswer,
            dateError,
            userSearch,
            userList,
            showAutocomplete,
            selectedUser,
            allowForeignPoints,
            isMobile,
            config,
            chofer_logo_blanco,
            pasajero_logo_blanco,
            chofer_logo_gris,
            pasajero_logo_gris,
            swap_horizontal,
            swap_vertical,
            getPlace,
            resetInput,
            swapCities,
            onSearchUsers,
            selectUser,
            resetUser,
            emit
        }
    }
}
</script>

<style scoped>
    .search-section {
        padding-left: 0;
        padding-right: 0;
    }
    .search-section .btn-option {
        width: 100%;
        margin-bottom: 1em;
    }
    .search-users {
        position: relative;
    }

    .search-users-input {
        line-height: 42px;
    }

    .autocomplete-users {
        position: absolute;
        top: 100%;
        z-index: 100;
        width: 100%;
        cursor: pointer;
    }

    .btn-option {
        height: 72px;
    }
    .btn-option .fa,
    .btn-option img {
        width: 20px;
        display: inline-block;
        top: 10px;
        margin-right: 0;
        font-size: 20px;
    }
    .btn-option span {
        vertical-align: middle;
        display: inline-block;
        width: calc(100% - 30px);
    }
    .swap {
        display: none;
    }
    .swap-horizontal {
        display: none;
    }
    .foreignCountry-select {
        margin-bottom: 1em;
    }
    .foreignCountry-select-mobile {
        width: 100%;
    }
    .foreignCountry-select-desktop .foreignCountry-select_wrapper {
        margin-left: -10%;
    }
    .cbx,
    .cbx_label {
        vertical-align: middle;
        margin: 0;
    }
    .cbx_label {
        margin-left: .5em;
    }
    .optional-warning {
        font-size: .8em;
        color: #999;
        position: relative;
        top: -.8em;
        clear: both;
    }
    @media only screen and (min-width: 300px) {
        .swap {
            bottom: -6px;
            left: -30px;
            border-radius: 0;
            position: absolute;
            z-index: 1;
            text-align: center;
            cursor: pointer;
            background-color: #eee;
            box-sizing: border-box;
            padding: 2px 6px 3px;
            border: 1px solid #aaa;
            display: inline-block;
            margin: 0em;
        }
        .search-section {
            margin-left: 30px;
            padding-right: 15px;
        }
    }
    @media only screen and (min-width: 429px) {
        .btn-option {
            height: initial;
        }
        .btn-option img {
            width: initial;
            display: initial;
            top: initial;
            margin-right: 6px;
        }
        .btn-option span {
            display: initial;
            width: initial;
        }
    }
    @media only screen and (min-width: 768px) {
        .search-section {
            padding-left: 0;
            padding-right: 0;
            width: calc(100% - 30px);
        }
    }
    @media only screen and (min-width: 856px) {
        .search-section {
             width: 100%;
             margin-left: 0;
             padding-left: 0;
        }
    }
    @media only screen and (min-width: 992px) {
        .swap {
            bottom: unset;
            top: 20px;
            right: -17px;
            left: unset;
        }
        .btn-option {
            height: 66px;
            padding: 1em .4em;
        }
        .btn-option span {
            vertical-align: middle;
            display: inline-block;
            width: calc(100% - 30px);
        }
        .btn-option img {
            width: 20px;
            display: inline-block;
            top: 10px;
            margin-right: 0;
        }
    }
    @media only screen and (min-width: 992px) {
        .swap-horizontal {
            display: block;
        }
        .swap-vertical {
            display: none;
        }
    }
</style>
