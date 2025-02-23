<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <router-link :to="{ name: 'trips', params: { clearSearch: true } }"  v-on:click.native="tripsClick">
                        <img :src="app_logo" />
                    </router-link>
                </span>
                <template v-else v-for="item in leftHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div class="actionbar_section actionbar_title" :class="subTitle !== '' ? 'header--with-subtitle' : ''">
                <div class="header--image circle-box" v-imgSrc="imgTitle" v-show="imgTitle" ></div>
                <span v-if="!titleLink.name" class='header--title'>{{title}}</span>
                <router-link v-if="titleLink.name" :to="{name: titleLink.name, params: titleLink.params}" class='header--title'><span>{{title}}</span></router-link>
                <span class='header--subtitle'>{{subTitle}}</span>
            </div>   
            <div class="actionbar_section actionbar_icon pull-right">
                <template v-for="item in rightHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div class="dropdown-right" v-if="showMenu">
                    <dropdown type="icon">
                        <template slot="button">
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </template>
                        <li><router-link tag="a" :to="{name: 'acerca_de'}"  >{{ $t('acercaDe') }}</router-link></li>
                        <li><router-link :to="{name: 'terms'}" tag="a">{{ $t('tyc') }}</router-link></li>
                        <li><a @click="logout" v-if="!isFacebokApp">{{ $t('cerrarSesion') }}</a></li>
                    </dropdown>
                </div>
            </div>

            <div class="actionbar_section actionbar_icon pull-right">
                <a href="/donar" class="btn btn-primary btn-donar-header btn-header-small btn-lg">Donar</a>
            </div>
        </div>
        <div class="header_content hidden-xs">
            <router-link :to="{ name: 'trips', params: { clearSearch: true } }"  v-on:click.native="tripsClick">
                <div class="header_panel-left" v-if="logoHeaderVisibility" >
                    <img :src="background_desktop_mini" v-if="isNotLargeDesktop || (config && config.trip_card_design === 'light')" />
                    <img :src="background_desktop" v-if="!isNotLargeDesktop && config && config.trip_card_design !== 'light'" />
                    <img :src="app_logo"/>
                </div>
            </router-link>
            <div class="header_panel-right">
                <modal :name="'modal'" v-if="showModal" @close="showModal = false" :title="'Test'" :body="'Body'">
                    <h3 slot="header">{{ $t('invitarAmigos') }}</h3>
                    <div slot="body" class="social-share">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcarpoolear.com%2F" target="_blank" aria-label="Compartir en Facebook" class="lnk lnk-social-network lnk-facebook">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                        <a href="https://plus.google.com/share?url=https%3A%2F%2carpoolear.com%2F" target="_blank" aria-label="Compartir en Google+"  class="lnk lnk-social-network lnk-google-plus">
                            <i class="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet/?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos&url=https%3A%2F%2Fcarpoolear.com&via=carpoolear&hashtags=carpooling" target="_blank" aria-label="Compartir en Twitter"   class="lnk lnk-social-network lnk-twitter">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a href="whatsapp://send?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos%20https%3A%2F%2carpoolear.com%2F" target="_blank" aria-label="Compartir en Whats App"   class="lnk lnk-social-network lnk-whatsapp"  v-if="isMobile">
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>
                </modal>
                <button v-if="config.trip_card_design !== 'light'" @click="share" type="button" class="btn btn-link">{{ $t('invitarAmigos') }}</button>
                <router-link v-if="config.trip_card_design !== 'light'" class="btn btn-link trips-link" :to="{name: 'trips', params: { clearSearch: true }}">{{ $t('viajes') }}</router-link>
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Información</router-link>-->
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'register'}">Registrarme</router-link>-->
                <router-link class="btn btn-primary" btn-lg v-if="!logged" :to="{name: 'login'}">{{ $t('inicio') }}</router-link>


                <span class="header_notifications" @click="toNotifications" v-if="logged">
                    <span class="fa-container">
                        <i class="fa fa-bell background" aria-hidden="true"></i>
                        <i :style="notificationsCount > 0 ? 'color: white' : ''" class="fa fa-bell" aria-hidden="true"></i>
                    </span>
                    <span class="badge" v-if="notificationsCount > 0">{{notificationsCount}}</span>
                </span>

                <div class="header_profile" v-if="user">
                    <span > {{user.name}} </span>
                    <dropdown type="info" v-if="logged" >
                        <template slot="button">
                            <div class="circle-box header_profile_image" v-imgSrc:profile="user.image"></div>
                        </template>
                        <li>
                            <router-link :to="{name: 'my-trips'}">{{ $t('misViajes') }}</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'conversations-list'}">{{ $t('mensajes') }}</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'profile', params: {id: 'me'}}">{{ $t('perfil') }}</router-link>
                        </li>
                        <li v-if="user.is_admin">
                            <router-link :to="{name: 'admin-page'}">{{ $t('administracion') }}</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <!--<li>
                            <router-link :to="{name: 'acerca_de'}">Acerca</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'profile_update'}">Configuración</router-link>
                        </li>-->
                        <li><a @click="logout" v-if="!isFacebokApp">{{ $t('cerrarSesion') }}</a></li>
                    </dropdown>
                </div>

                <a href="/donar" class="btn btn-primary btn-donar-header btn-lg">Donar</a>
                <router-link v-if="logged" :to="{name: 'new-trip'}" id="btn-create-trip" class="btn btn-primary btn-lg">{{ $t('crearViaje') }}</router-link>

            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { bus } from '../../services/bus'
import dropdown from '../Dropdown.vue'
import modal from '../Modal.vue'
import dialogs from '../../services/dialogs'

export default {
    name: 'headerApp',
    components: {
        dropdown,
        modal
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const showModal = ref(false)
        
        const background_desktop_mini = ref(process.env.ROUTE_BASE + 'static/img/' + process.env.TARGET_APP + '_background_desktop_mini.png')
        const background_desktop = ref(process.env.ROUTE_BASE + 'static/img/' + process.env.TARGET_APP + '_background_desktop.png')
        const app_logo = ref(process.env.ROUTE_BASE + 'static/img/' + process.env.TARGET_APP + '_logo.png')

        const logged = computed(() => store.getters['auth/checkLogin'])
        const user = computed(() => store.getters['auth/user'])
        const notificationsCount = computed(() => store.getters['notifications/count'])
        const title = computed(() => store.getters['actionbars/title'])
        const titleLink = computed(() => store.getters['actionbars/titleLink'])
        const subTitle = computed(() => store.getters['actionbars/subTitle'])
        const imgTitle = computed(() => store.getters['actionbars/imgTitle'])
        const showMenu = computed(() => store.getters['actionbars/showMenu'])
        const leftHeaderButton = computed(() => store.getters['actionbars/leftHeaderButton'])
        const rightHeaderButton = computed(() => store.getters['actionbars/rightHeaderButton'])
        const logoHeaderVisibility = computed(() => store.getters['actionbars/headerLogoVisibility'])
        const isNotLargeDesktop = computed(() => store.getters['device/isNotLargeDesktop'])
        const isFacebokApp = computed(() => store.getters['device/isFacebokApp'])
        const isMobile = computed(() => store.getters['device/isMobile'])
        const config = computed(() => store.getters['auth/appConfig'])

        const showLogo = computed(() => {
            return !leftHeaderButton.value.some(btn => btn.show)
        })

        onMounted(() => {
            bus.on('header-title-change', onHeaderChange)
        })

        const share = () => {
            showModal.value = true
        }

        const logout = () => {
            store.dispatch('auth/logout')
        }

        const toNotifications = () => {
            router.push({ name: 'notifications' })
        }

        const onClick = (item) => {
            bus.emit(item.id + '-click')
        }

        const tripsClick = () => {
            store.dispatch('trips/refreshList', true)
            store.dispatch('trips/tripsSearch', { is_passenger: false })
        }

        const onHeaderChange = () => {
            // Header change handler
        }

        return {
            showModal,
            background_desktop_mini,
            background_desktop,
            app_logo,
            logged,
            user,
            notificationsCount,
            title,
            titleLink,
            subTitle,
            imgTitle,
            showMenu,
            leftHeaderButton,
            rightHeaderButton,
            logoHeaderVisibility,
            isNotLargeDesktop,
            isFacebokApp,
            isMobile,
            config,
            showLogo,
            share,
            logout,
            toNotifications,
            onClick,
            tripsClick,
            onHeaderChange
        }
    }
}
</script>

<style scoped>
    .trips-link {
        font-weight: bold;
    }
    .actionbar_icon img {
        margin-bottom: 2px;
        width: 26px;
        margin-left: .3em;
    }
    .header_panel-right {
        min-width: 50%;
        text-align: right;
    }
    @media (max-width: 1050px) {
        .header_panel-right {
            min-width: 70%;
        }
    }
</style>
