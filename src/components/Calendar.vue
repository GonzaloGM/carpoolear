<template>
    <div>
        <datePicker :date="date" ref="calendar" :option="option" v-on:change="updateDate" :limit="limit" class='date-picker'></datePicker>
        <div class="date-picker--cross">
            <i v-on:click="resetDatePicker" class="fa fa-times" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch, defineEmits } from 'vue'
import datePicker from 'vue-datepicker'
import moment from 'moment'

export default {
    name: 'calendar',
    components: {
        datePicker
    },
    props: {
        'format': {
            type: String,
            required: false,
            default: 'DD/MM/YYYY'
        },
        'class': {
            type: String,
            required: false,
            default: ''
        },
        'value': {
            type: String,
            required: false,
            default: ''
        },
        'limitFilter': {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    setup(props) {
        const emit = defineEmits(['change'])
        const calendar = ref(null)
        const date = ref({
            time: props.value
        })
        
        const option = ref({
            type: 'day',
            week: ['Lu', 'Ma', 'Mie', 'Ju', 'Vi', 'Sa', 'Do'],
            month: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            format: props.format,
            placeholder: 'Fecha',
            inputStyle: {
                'display': 'inline-block',
                'line-height': '22px',
                'border-radius': '2px',
                'color': '#5F5F5F',
                'width': '100%',
                'border': 'none'
            },
            wrapperClass: props.class,
            color: {
                header: '#016587',
                headerText: '#FFF'
            },
            buttons: {
                ok: 'Aceptar',
                cancel: 'Cancelar'
            },
            overlayOpacity: 0.5,
            dismissible: true
        })

        const limit = ref([props.limitFilter])

        const dateSys = computed(() => {
            return moment(date.value.time, props.format).format('YYYY-MM-DD')
        })

        watch(() => props.value, (newValue) => {
            let format = 'YYYY-MM-DD'
            if (newValue.indexOf('/') >= 0) {
                format = 'DD/MM/YYYY'
            }
            let time = moment(newValue, format).format('DD/MM/YYYY')
            calendar.value.showDay(time)
            date.value.time = moment(newValue, format).format('DD/MM/YYYY')
        })

        const updateDate = () => {
            emit('change', dateSys.value)
        }

        const resetDatePicker = () => {
            date.value.time = ''
            emit('change', '')
        }

        return {
            calendar,
            date,
            option,
            limit,
            dateSys,
            updateDate,
            resetDatePicker
        }
    }
}
</script>

<style scoped>
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
</style>
