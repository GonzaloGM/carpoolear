<template>
    <div class="osm-autocomplete" v-clickoutside="clickOutside" :id="name">
        <input ref="input" :disabled="disabled"  type="text" :placeholder="placeholder" v-model="input" @keydown="onKeyDown" @keyup="onKeyup" :class="classes" @focus="onFocus" autocomplete="new-password" />
        <div class="osm-autocomplete-results" v-if="results.length || this.waiting">
            <button v-for="(result, index) in results" @click="onItemClick(result)" v-if="results.length" :key="index">
                {{ result.name }}
                <small>{{ result.state }}, {{ result.country }}</small>
            </button>
            <small class="copy" v-if="results.length || this.waiting">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" v-if="this.waiting" />
                <span>© OpenStreetMap</span>
            </small>
        </div>
    </div>
</template>
<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import TripApi from '../services/api/Trips';

export default {
    name: 'autocomplete',
    props: ['value'],
    setup(props, { emit }) {
        const store = useStore()
        const input = ref('')
        const keyUpTimerId = ref(0)
        const waiting = ref(false)
        const selectedValue = ref(null)
        const results = ref([])
        const lastResults = ref([])
        const indexAutocomplete = ref(-1)
        const resultFilterWatcher = ref(null)

        const config = computed(() => store.getters['auth/appConfig'])

        watch(() => props.value, (newVal) => {
            input.value = newVal || ''
        })

        const onFocus = ($event) => {
            $event.target.select()
            if (input.value !== '') {
                results.value = lastResults.value
            }
        }

        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                if (results.value && results.value.length > 0) {
                    onItemClick(results.value[indexAutocomplete.value])
                } else {
                    if (props.vJumpDisabled) {
                        // Assuming props.vJumpDisabled is passed as a prop
                        // Implement the logic to jump to the type
                    }
                    emit('keyUpEnter', event)
                }
            }
            if (event.key === 'Tab' || event.key === 'Escape') {
                clickOutside()
                if (document) {
                    document.activeElement.blur()
                }
            }
            if (event.key === 'ArrowDown') {
                if (results.value && results.value.length > 0) {
                    event.preventDefault()
                    if (indexAutocomplete.value < results.value.length - 1) {
                        indexAutocomplete.value++
                    }
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                if (indexAutocomplete.value > 0) {
                    indexAutocomplete.value--
                }
            }
        }

        const onKeyup = (event) => {
            if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].indexOf(event.key) > -1) {
                return
            }
            waiting.value = true
            results.value = []
            if (props.inputCallback) {
                props.inputCallback()
            }
            if (keyUpTimerId.value) {
                clearTimeout(keyUpTimerId.value)
            }
            keyUpTimerId.value = setTimeout(() => {
                forceEmitChangeEvent()
                autocomplete()
            }, 750)
        }

        const autocomplete = () => {
            waiting.value = true
            results.value = []
            /* eslint-disable */
            let tripsApi = new TripApi()
            let multi = props.country ? false : true
            tripsApi.autocomplete(input.value, config.value.osm_country, multi).then(data => {
                waiting.value = false
                console.log('data', data)
                data = data.nodes_geos
                if (data) {
                    data.sort((a, b) => {
                        return b.importance - a.importance
                    })
                    results.value = data
                } else {
                    results.value = []
                }
            }).then(() => {
                waiting.value = false
            })
        }

        const onItemClick = (item) => {
            waiting.value = false
            emit('place_changed', item)
            results.value = []
            input.value = item.name
        }

        const clickOutside = () => {
            if (keyUpTimerId.value) {
                clearTimeout(keyUpTimerId.value)
                waiting.value = false
            }
            if (results.value && results.value.length > 0) {
                lastResults.value = results.value
                results.value = []
            }
        }

        const forceEmitChangeEvent = () => {
            if ('createEvent' in document) {
                let event = document.createEvent('HTMLEvents')
                event.initEvent('change', false, true)
                input.value.dispatchEvent(event)
            } else {
                input.value.fireEvent('onchange')
            }
        }

        return {
            input,
            results,
            lastResults,
            onFocus,
            onKeyDown,
            onKeyup,
            autocomplete,
            onItemClick,
            clickOutside,
            forceEmitChangeEvent,
            waiting,
            config
        }
    },
    props: {
        name: {
            type: String,
            required: false
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        inputCallback: {
            type: Function,
            required: false
        },
        vJumpDisabled: {
            required: false
        },
        classes: {
            required: false
        },
        country: {
            required: false
        }
    }
};
</script>

<style scoped>
    .osm-autocomplete {
        position: relative;
    }
    .osm-autocomplete-results {
        position: absolute;
        top: 100%;
        z-index: 100;
        width: 100%;
    }
    .osm-autocomplete-results button {
        white-space: nowrap;
        width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        padding: 5px 4px;
        background: #FFF;
        border: 1px solid #AAA;
        color: #000;
        text-align: left;
        border-bottom: 0;
    }
    .osm-autocomplete-results button small {
        font-size: 11px;
        color: #AAA;
    }
    .osm-autocomplete-results .copy {
        white-space: nowrap;
        width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        padding: 5px 4px;
        background: #FFF;
        border: 1px solid #AAA;
        color: #000;
        text-align: right;
    }
    .osm-autocomplete input[disabled] {
        background-color: #DDD;
        color: #555;
        opacity: 0.85;
    }
</style>
