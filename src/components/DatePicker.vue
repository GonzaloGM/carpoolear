<template>
    <div class="date-picker">
        <div v-if="browser" class="form-control picker" :class="focus ? 'input-border' : ''">
            <DatepickerSystem
                :clear-button="true"
                :clear-button-icon="'fa fa-times'"
                :calendar-button="true"
                :calendar-button-icon="'fa fa-calendar'"
                :value="dateBrowser"
                :language="'es'"
                v-on:opened="focus = true"
                v-on:closed="focus = false"
                v-on:selected="changeValue"
                :placeholder="'dd/mm/yyyy'"
                :format="'dd/MM/yyyy'"
                :disabled="{
                    to: min,
                    from: max
                }"
                :disabled-picker="disabledPicker"
                autocomplete="off">
            </DatepickerSystem>
        </div>
        <div v-if="!browser" class="form-control form-control-with-icon form-control-date">
            <input
                @focus="openNativeDatePicker"
                @blur="focus = false"
                :value="niceDate"
                @change="changeMobileValue"
                type="text"
                id="datepicker-mobile"
                :min="min"
                :max="max"
                autocomplete="off"
                :placeholder="'dd/mm/yyyy'"
            />
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import DatepickerSystem from 'vuejs-datepicker'
import moment from 'moment'
import bus from '../services/bus-event'

export default {
    name: 'datePicker',
    components: {
        DatepickerSystem
    },
    props: {
        value: {
            type: String,
            required: false,
            default: ''
        },
        min: {
            type: String,
            required: false,
            default: ''
        },
        max: {
            type: String,
            required: false,
            default: ''
        },
        disabledPicker: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props, { emit }) {
        const dateBrowser = ref('')
        const dateMobile = ref('')
        const date = ref('')
        const update = ref(true)
        const focus = ref(false)
        const nextYear = ref(moment().add(2, 'years').format('YYYY-MM-DD'))
        const lastCentury = ref(moment().subtract(100, 'years').format('YYYY-MM-DD'))
        const niceDate = ref('')
        const browser = ref(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

        const clear = () => {
            dateBrowser.value = ''
            dateMobile.value = ''
            niceDate.value = ''
        }

        const changeValue = (value) => {
            dateBrowser.value = value
        }

        const changeMobileValue = (el) => {
            dateMobile.value = el.target.value
        }

        const openNativeDatePicker = (event) => {
            event.target.blur()
            const context = this
            focus.value = true
            let date = new Date()
            if (dateMobile.value) {
                date = moment(dateMobile.value).toDate()
            }
            const options = {
                date: date,
                mode: 'date',
                minDate: Date.parse(moment(props.min).toDate()),
                maxDate: Date.parse(moment(props.max).toDate()),
                androidTheme: 3
            }

            function onSuccess(date) {
                dateMobile.value = moment(date).format('YYYY-MM-DD')
                niceDate.value = moment(date).format('DD/MM/YYYY')
            }

            function onError(error) { // Android only
                console.log(error)
            }

            window.datePicker.show(options, onSuccess, onError)
        }

        watch(() => dateBrowser.value, (value) => {
            value = value && value !== '' ? moment(value).format('YYYY-MM-DD') : ''
            bus.emit('date-change', value)
            emit('date_changed', value)
        })

        watch(() => dateMobile.value, (value) => {
            value = value && value !== '' ? value : ''
            bus.emit('date-change', value)
            emit('date_changed', value)
        })

        onMounted(() => {
            if (props.value !== '') {
                dateBrowser.value = moment(props.value).toDate()
                dateMobile.value = props.value
                niceDate.value = moment(props.value).format('DD/MM/YYYY')
            }
        })

        return {
            browser,
            dateBrowser,
            dateMobile,
            date,
            update,
            focus,
            nextYear,
            lastCentury,
            niceDate,
            clear,
            changeValue,
            changeMobileValue,
            openNativeDatePicker
        }
    }
}
</script>

<style>
    .vdp-datepicker i {
        font-size: 16px;
        padding-left: 4px;
    }
    .vdp-datepicker i.fa-times {
        font-size: 14.4px;
    }

    .vdp-datepicker__calendar-button {
        width: 18px;
    }
    .vdp-datepicker input,
    .user-form .vdp-datepicker input[type='text'] {
        border: 0;
        width: calc(100% - 44px);
        padding-left: .4em;
        line-height: 40px;
        font-size: 13px;
    }

    .user-form .vdp-datepicker input[type='text'] {
        display: inline-block;
        padding: 0;
        margin-bottom: 0;
        padding-left: .4em;
    }

    .date-picker--cross {
        position: absolute;
    }
    .date-picker--cross i {
        cursor: pointer;
    }
    .date-picker {
        width: 100%;
        border: none;
        vertical-align: middle;
    }
    .form-control {
        position: relative;
        vertical-align: middle;
        cursor: pointer;
    }
    .picker.form-control {
        padding: .1em .6em;
    }
    @media only screen and (min-width: 992px) {
        .search-section .picker.form-control {
            padding: .8em .6em;
        }
    }
    .input-border.form-control {
        border-color: #66afe9;
        outline: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    }
    @media only screen and (max-width: 991px) {
        .vdp-datepicker .vdp-datepicker__calendar {
            font-size: 1.6em;
            box-shadow: 2px 2px 11px;
            z-index: 100;
            padding: 2.5em 1em;
            position: fixed;
            /* height: 40%; */
            width: 90%;
            top: 0px;
            left: 0px;
            margin: 5%;
            margin-top: 40%;
        }
    }
</style>
