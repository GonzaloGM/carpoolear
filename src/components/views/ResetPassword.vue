<template>
    <div class="user-form container " >
        <router-link v-if="!isMobile"  :to="{name: 'trips'}">
            <img :src="carpoolear_logo" />
        </router-link>
        <h1 v-if="tripCardTheme !== 'light'"> {{ $t('recuperarContraseña') }} </h1>
        <div class="form row" v-if="send">
            <h3> Se ha enviado un email a su casilla de correo con las indicaciones para restablecer su contraseña. </h3>
        </div>
        <div class="form row message" v-else-if="!token">
            <h1 v-if="tripCardTheme === 'light'"> {{ $t('recuperarContraseña') }} </h1>
            <label for="txt_email">E-mail</label>
            <input v-jump type="text" id="txt_email" v-model='email'/>
            <span class="error" v-if="error"> {{ error }} </span>
            <button v-jump class="btn btn-primary btn-shadowed-black btn-outline" @click="reset" :disabled="loading"> 
                <span v-if="!loading">Recuperar contraseña</span><spinner class="blue" v-if="loading"></spinner>
            </button>
        </div>
        <div class='form row' v-else-if="token">
            <label for="txt_password">Password</label>
            <input v-jump type="password" id="txt_password" v-model='password' />
            <label for="txt_password">Repetir Password </label>
            <input v-jump type="password" id="txt_password" v-model='password_confirmation' />
            <span class="error" v-if="error"> {{ error }} </span>
            <button v-jump class="btn btn-primary" @click="change" :disabled="loading">
                <span v-if="!loading">Cambiar contraseña</span><spinner class="blue" v-if="loading"></spinner>
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { emailRegex } from '../../utils/validators'
import dialogs from '../../services/dialogs'
import Spinner from '../Spinner.vue';
import bus from '../../services/bus-event';
import router from '../../router';

export default {
    name: 'reset-password',
    props: {
        token: {
            type: String,
            required: false
        }
    },
    setup(props) {
        const store = useStore()
        const email = ref('')
        const loading = ref(false)
        const error = ref(null)
        const send = ref(false)
        const password_confirmation = ref('')
        const password = ref('')
        const carpoolear_logo = ref(process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png')

        const settings = computed(() => store.getters['auth/appConfig'])
        const tripCardTheme = computed(() => settings.value ? settings.value.trip_card_design : '')

        const reset = async () => {
            error.value = null
            if (emailRegex.test(email.value)) {
                loading.value = true
                try {
                    await store.dispatch('auth/resetPassword', email.value)
                    loading.value = false
                    send.value = true
                } catch {
                    loading.value = false
                    error.value = 'El e-mail ingresado no pertenece a ningún usuario.'
                }
            } else {
                error.value = 'Ingrese un e-mail valido.'
            }
        }

        const change = () => {
            error.value = null
            if (password.value === password_confirmation.value) {
                loading.value = true
                let data = {}
                data.password = password.value
                data.password_confirmation = password_confirmation.value
                let token = props.token
                store.dispatch('auth/changePassword', { token, data }).then(() => {
                    router.replace({ name: 'login' })
                }).catch(() => {
                    loading.value = false
                    error.value = 'Token invalido'
                })
            } else {
                error.value = 'No coicide los campos'
            }
        }

        const onBackClick = () => {
            router.back()
        }

        return {
            email,
            loading,
            error,
            send,
            password_confirmation,
            password,
            carpoolear_logo,
            settings,
            tripCardTheme,
            reset,
            change,
            onBackClick
        }
    },
    mounted() {
        bus.on('back-click', this.onBackClick)
    },
    beforeDestroy() {
        bus.off('back-click', this.onBackClick)
    },
    components: {
        Spinner
    }
}
</script>

<style>
  .app-container {
    min-height: 100vh;
  }
</style>

<style scoped>
    h3 {
        margin-bottom: 2em;
        font-size: 18px;
    }
    label {
        display: block;
        margin-top: .3em;
        margin-bottom: .6em;
    }
    input {
        margin-bottom: 0.8em;
    }
    loading {
        margin-left: 1em;
    }
    .message > span {
        vertical-align: -.6em;
        color: red;
        margin-left: 2em;
    }
    h3 {
        color: #fff;
    }
    @media only screen and (min-width: 768px) {
        h3 {
            color: #036686;
        }
    }
</style>
