<template>
  <div class="app-container" :class="[backgroundStyle, viewName, deviceClass]">
    <onBoarding key="1" v-if="onBoardingVisibility"></onBoarding>
    <headerApp></headerApp>
    <main id="main">
      <div class="view-container clearfix">
        <router-view></router-view>
      </div>
    </main>
    <footerApp></footerApp>
    <!--
    <pre>
            {{this.$store.state}}
    </pre>
    -->
  </div>
</template>


<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import footerApp from './components/sections/FooterApp.vue';
import headerApp from './components/sections/HeaderApp.vue';
import onBoarding from './components/sections/OnBoarding.vue';

export default {
    name: 'App',
    components: {
        headerApp,
        footerApp,
        onBoarding
    },
    setup() {
        const store = useStore()
        const route = useRoute()
        const { locale } = useI18n()
        
        // Computed properties
        const deviceReady = computed(() => store.getters['cordova/deviceReady'])
        const backgroundStyle = computed(() => store.getters['background/backgroundStyle'])
        const logged = computed(() => store.getters['auth/checkLogin'])
        const isFacebokApp = computed(() => store.getters['device/isFacebokApp'])
        const appConfig = computed(() => store.getters['auth/appConfig'])
        const isRemoteConfig = computed(() => store.getters['auth/isRemoteConfig'])
        const firsTimeMobileAppOpen = computed(() => store.getters['device/firsTimeMobileAppOpen'])
        const user = computed(() => store.getters['auth/user'])
        const isBrowser = computed(() => store.getters['device/isBrowser'])
        const viewName = computed(() => route.name)
        const deviceClass = computed(() => window.device && window.device.platform ? window.device.platform.toLowerCase() : '')
        
        const onBoardingVisibility = computed(() => {
            let moduleEnabled = appConfig.value && isRemoteConfig.value && 
                appConfig.value.module_on_boarding_new_user && 
                appConfig.value.module_on_boarding_new_user.enabled
            let mustShowMobile = !isBrowser.value && !firsTimeMobileAppOpen.value
            let mustShowGeneral = user.value && user.value.on_boarding_view !== 1
            return moduleEnabled && (mustShowMobile || mustShowGeneral)
        })

        onMounted(() => {
            store.dispatch('auth/getConfig')
            if (isFacebokApp.value && !logged.value) {
                store.dispatch('cordova/facebookLogin')
            }
        })

        return {
            deviceReady,
            backgroundStyle,
            logged,
            isFacebokApp,
            appConfig,
            isRemoteConfig,
            firsTimeMobileAppOpen,
            user,
            isBrowser,
            onBoardingVisibility,
            viewName,
            deviceClass
        }
    }
};
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
