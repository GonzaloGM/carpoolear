<template>
    <div class="card">
        <LineChart class="chart" v-if="usersData"  :chartdata="usersData" :options="usersOptions"></LineChart>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LineChart from './LineChart'
import moment from 'moment'

export default {
    name: 'monthly-users-chart',
    components: {
        LineChart
    },
    props: {
        minDate: {
            default: moment(Date(new Date().getFullYear(), 0, 1), 'YYYY-MM')
        },
        maxDate: {
            default: moment(Date(), 'YYYY-MM')
        }
    },
    setup(props) {
        const store = useStore()
        
        const users = ref({})
        const usersData = ref({})
        const usersOptions = ref({
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Usuarios registrados por mes'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Mes'
                    },
                    stacked: true
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cantidad'
                    }
                }]
            }
        })

        const processUsers = (usuarios, minDate, maxDate) => {
            let labels = []
            let dataset = []
            usuarios.forEach(function (el) {
                if (el.key <= maxDate && el.key >= minDate) {
                    labels.push(el.key)
                    dataset.push(el.cantidad)
                }
            })
            return {
                labels: labels,
                datasets: [{
                    label: 'Usuarios',
                    backgroundColor: '#F00',
                    borderColor: '#F00',
                    data: dataset,
                    fill: false
                }]
            }
        }

        const loadData = async () => {
            users.value = await store.dispatch('admin/getUserStats')
            users.value = users.value.users
            usersData.value = processUsers(users.value, props.minDate, props.maxDate)
        }

        watch(() => props.minDate, () => {
            usersData.value = processUsers(users.value, props.minDate, props.maxDate)
        })

        watch(() => props.maxDate, () => {
            usersData.value = processUsers(users.value, props.minDate, props.maxDate)
        })

        onMounted(() => {
            loadData()
        })

        return {
            users,
            usersData,
            usersOptions,
            processUsers,
            loadData
        }
    }
}
</script>

<style scoped>
.card {
    background-color: #fff;
    border-radius: 2px;
    height: 45vh;
}
.chart {
    height: 45vh;
}
</style>
