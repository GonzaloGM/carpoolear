<template>
    <div class="osm-autocomplete" v-clickoutside="clickOutside" :id="name">
        <input ref="input" :disabled="disabled" type="text" :placeholder="placeholder" v-model="input" @keydown="onKeyDown" @keyup="onKeyup" :class="classes" @focus="onFocus" autocomplete="new-password" />
        <div class="osm-autocomplete-results" v-if="results.length || waiting">
            <button v-for="(result, index) in results" @click="onItemClick(result)" v-if="results.length" :key="index">
                {{ result.address[result.type] ? result.address[result.type] : (result.address['county'] ? result.address['county'] : result.address['city']) }}
                <small>{{ result.address.state }}, {{ result.address.country }}</small>
            </button>
            <small class="copy" v-if="results.length || waiting">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" v-if="waiting" />
                <span>© OpenStreetMap</span>
            </small>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import OsmApi from '../services/api/Osm'

const osmApi = new OsmApi()

export default {
    name: 'osmautocomplete',
    props: {
        value: {
            type: String,
            required: false,
            default: ''
        },
        name: {
            type: String,
            required: false,
            default: ''
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
        }
    },
    setup(props, { emit }) {
        const store = useStore()
        const input = ref(props.value)
        const results = ref([])
        const waiting = ref(false)
        const keyUpTimerId = ref(null)
        const indexAutocomplete = ref(-1)

        const classes = computed(() => ({
            'form-control': true,
            'input-border': results.value.length > 0
        }))

        const search = async () => {
            if (input.value.length < 3) {
                results.value = []
                return
            }
            waiting.value = true
            try {
                results.value = await osmApi.search(input.value)
                indexAutocomplete.value = -1
            } catch (error) {
                console.error('Search error:', error)
            }
            waiting.value = false
        }

        const onKeyDown = (e) => {
            if (e.keyCode === 38) { // up
                e.preventDefault()
                indexAutocomplete.value = Math.max(indexAutocomplete.value - 1, 0)
            } else if (e.keyCode === 40) { // down
                e.preventDefault()
                indexAutocomplete.value = Math.min(indexAutocomplete.value + 1, results.value.length - 1)
            } else if (e.keyCode === 13) { // enter
                e.preventDefault()
                if (indexAutocomplete.value >= 0) {
                    onItemClick(results.value[indexAutocomplete.value])
                }
            }
        }

        const onKeyup = (e) => {
            if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
                clearTimeout(keyUpTimerId.value)
                keyUpTimerId.value = setTimeout(search, 500)
            }
        }

        const onItemClick = (item) => {
            input.value = item.address[item.type] || (item.address.county || item.address.city)
            emit('selected', item)
            results.value = []
        }

        const clickOutside = () => {
            results.value = []
        }

        const onFocus = () => {
            if (results.value.length > 0) {
                results.value = results.value
            }
        }

        return {
            input,
            results,
            waiting,
            classes,
            onKeyDown,
            onKeyup,
            onItemClick,
            clickOutside,
            onFocus
        }
    }
}
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

