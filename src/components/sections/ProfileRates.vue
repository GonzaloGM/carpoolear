<template>
    <div class="profile-rates-component container">
        <div class="clearfix">
            <h2>{{ $t('calificaciones') }}</h2>
            <Loading :data="rates">
                <div class="list-group">
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col1">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col2">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col3">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                </div>
                <!--
                <div v-if="morePages">
                    <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                </div>
                -->

                <p slot="no-data" class="alert alert-warning"  role="alert">{{ $t('noCalificaciones') }}</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    {{ $t('cargandoNotificaciones') }}
                </p>
            </Loading>
        </div>

        <template v-if="config && config.module_references">
            <div class="clearfix">
                <h2>{{ $t('referencias') }}</h2>
                <Loading :data="references">
                    <div class="list-group">
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col1">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col2">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col3">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                    </div>
                    <!--
                    <div v-if="morePages">
                        <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                    </div>
                    -->
                    <p slot="no-data" class="alert alert-warning"  role="alert">{{ $t('noReferences') }}</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        {{ $t('cargandoNotificaciones') }}
                    </p>
                </Loading>
            </div>
        </template>

    </div>
</template>
<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import Loading from '../Loading.vue';
import RateItem from '../RateItem';

const emptyCols = {
    col1: [],
    col2: [],
    col3: []
}

export default {
    setup() {
        const store = useStore()
        const state = reactive({
            rating: {},
            referencesCol: {}
        })

        const cleanCols = (array) => {
            state[array] = JSON.parse(JSON.stringify(emptyCols))
        }

        const makeRows = (arrayToCheck, arrayToPush) => {
            if (state[arrayToCheck]) {
                cleanCols(arrayToPush)
                if (isMobile.value) {
                    state[arrayToPush].col1 = state[arrayToCheck].slice(0)
                } else {
                    let rows = isTablet.value ? 2 : 3
                    for (let j = 0; j < rows; j++) {
                        for (let i = j; i < state[arrayToCheck].length; i += rows) {
                            state[arrayToPush][`col${j + 1}`].push(state[arrayToCheck][i])
                        }
                    }
                }
            }
        }

        // Computed properties using Vuex store
        const user = computed(() => store.getters['auth/user'])
        const rates = computed(() => store.getters['profile/rates'])
        const isMobile = computed(() => store.getters['device/isMobile'])
        const isTablet = computed(() => store.getters['device/isTablet'])
        const isDesktop = computed(() => store.getters['device/isDesktop'])
        const config = computed(() => store.getters['auth/appConfig'])
        const references = computed(() => store.getters['profile/references'])

        return {
            ...state,
            cleanCols,
            makeRows,
            user,
            rates,
            isMobile,
            isTablet,
            isDesktop,
            config,
            references
        }
    },
    components: {
        Loading,
        RateItem
    },
    props: [
        'id'
    ]
};
</script>
<style scoped>
    .profile-rates-component {
        padding-bottom: 6em;
    }
</style>
