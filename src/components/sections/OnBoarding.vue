<template>
    <div ref="overlay" class="on-boarding--overlay" :style="styleContainerObject" :class="onBoardingVisibilityClass">
        <template v-if="cardsLength > 0">
            <div :style="styleCardObject" v-for="number in cardsLength" :key="number" class="on-boarding--container">
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(number)" />
                    <h1>{{$t(`onBoardingcardMessage${number}`)}}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button class="btn btn-secondary" v-if="number > 1" @click="(number > 1) && cardNumber--">Anterior</button>
                    <button class="btn btn-success" @click="complete" v-if="number === cardsLength">
                        ¡Comenzar!
                    </button>
                    <button v-else class="btn btn-primary" @click="(number < cardsLength) && cardNumber++">
                        Siguiente
                    </button>
                </div>
            </div>
        </template>
        <template v-else>
            <div :style="styleCardObject" class="on-boarding--container">
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(cardNumber)" />
                    <h1>{{$t(`onBoardingcardMessage${cardNumber}`)}}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button class="btn btn-secondary" v-if="cardNumber > 1">Anterior</button>
                    <button class="btn btn-success" v-if="cardNumber > 1">
                        ¡Comenzar!
                    </button>
                    <button class="btn btn-primary" v-else>
                        Siguiente
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'onBoarding',
    setup() {
        const store = useStore()
        const overlay = ref(null)
        const cardNumber = ref(1)
        const cardsLength = ref(0)
        const onBoardingVisibilityClass = ref('')
        const styleContainerObject = ref({})
        const styleCardObject = ref({})

        const appConfig = computed(() => store.getters['auth/appConfig'])

        const srcCard = (number) => {
            let src = process.env.ROUTE_BASE + `static/img/onBoarding/${process.env.TARGET_APP}_placa${number}.jpg`
            console.log('src', src)
            return src
        }

        const firstTransitionEnd = () => {
            cardsLength.value = appConfig.value.module_on_boarding_new_user && appConfig.value.module_on_boarding_new_user.cards
            styleContainerObject.value = {
                width: `${cardsLength.value * 100}%`,
                transform: 'translate(0)',
                transition: 'transform 0.5s'
            }
            styleCardObject.value = {
                width: '100vw'
            }
            overlay.value.removeEventListener('transitionend', firstTransitionEnd, false)
        }

        const complete = () => {
            cardsLength.value = 0
            styleContainerObject.value = {
                transition: 'none'
            }
            styleCardObject.value = {}
            setTimeout(() => {
                styleContainerObject.value = {}
                setTimeout(() => {
                    onBoardingVisibilityClass.value = ''
                    overlay.value.addEventListener('transitionend', finalTransitionEnd, false)
                })
            })
        }

        const finalTransitionEnd = () => {
            overlay.value.removeEventListener('transitionend', finalTransitionEnd, false)
            endActions()
        }

        const endActions = () => {
            document.documentElement.style.overflow = 'auto'
            document.body.scroll = 'yes'
            store.dispatch('device/setFirstTimeAppOpenInDevice')
        }

        onMounted(() => {
            setTimeout(() => {
                onBoardingVisibilityClass.value = 'show'
                overlay.value.addEventListener('transitionend', firstTransitionEnd, false)
            }, 600)
            document.documentElement.style.overflow = 'hidden'
            document.body.scroll = 'no'
        })

        watch(() => cardNumber.value, (value) => {
            styleContainerObject.value.transform = `translate(${(value - 1) * -100}vw)`
        })

        return {
            overlay,
            cardNumber,
            cardsLength,
            onBoardingVisibilityClass,
            styleContainerObject,
            styleCardObject,
            srcCard,
            complete
        }
    }
}
</script>

<style scoped>
.btn-secondary {
    margin-right: 1em;
    background-color: transparent;
}
.btn-success {
    position: relative;
    min-width: 5rem;
}
</style>
