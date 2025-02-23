<template>
    <div class="trips container">
          <div class="col-xs-24">
              <Loading :data="pendingPaymentRequests" :hideOnEmpty="true">
                  <h2 slot="title"> <strong>Pago pendiente</strong> para confirmar </h2>
                  <div class="request-list">
                      <PendingPaymentRequest v-for="r in pendingPaymentRequests" v-bind:key="r.id" :request="r"></PendingPaymentRequest>
                  </div>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando...
                  </p>
              </Loading>
          </div>
          <div class="col-xs-24">
              <Loading :data="pendingRequest" :hideOnEmpty="true">
                  <h2 slot="title"> Pendientes <strong>de contestar</strong> </h2>
                  <div class="request-list">
                      <PendingRequest v-for="r in pendingRequest" v-bind:key="r.id" :user="r.user" :trip="findTrip(r.trip_id)"></PendingRequest>
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No hay pedientes de contestar</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando...
                  </p>
              </Loading>
          </div>
  
          <div class="col-xs-24">
              <modal :name="'modal'" v-if="showModalPendingRates" @close="toPendingRates" :title="'Carpoodatos'" :body="'Body'" :hide-footer="true">
                  <h3 slot="header">
                      <span>¡Carpoodatos!</span>
                      <i v-on:click="toPendingRates" class="fa fa-times float-right-close"></i>
                  </h3>
                  <div slot="body">
                      <div class="text-left carpoodatos">
                        <p>
                          <b>Es muy muy importante calificar</b>. Las calificaciones permiten conocernos mejor y poder decidir a la hora de compartir un viaje, son muy importantes para toda la comunidad carpoolera.
                        </p>
                        <p>
                          <b>Tomate el tiempo para calificar pero no tanto...</b>. Tenés 14 días para calificar contando a partir del momento en que se habilita la posibilidad, 24hs posteriores al comienzo del viaje.
                        </p>
                        <p>
                          <b>No se borra con el codo ni hay líquido corrector</b>. Tené en cuenta que no podés ni borrar ni editar la calificación que hagas.
                        </p>
                        <p>
                          <b>Decí lo que pensás :D</b>. Las calificación que vos hagas y la que recibas de la otra persona se mostrarán al mismo tiempo en los perfiles. Nunca se mostrará una antes que la otra. Solamente cuando la otra persona te califique o se venza el plazo de tiempo para calificar, aparecerá la calificación en el perfil.
                        </p>
                        <p>Cualquier duda escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o nuestras redes sociales.</p>
                      </div>
                      <div class="check" style="margin-bottom:10px;">
                          <label class="check-inline">
                              <input type="checkbox" name="pendingRatesValor" value="0" v-model="pendingRatesValue"><span> No volver a mostrar mensaje</span>
                          </label>
                      </div>
                      <div class="text-center">
                        <button class="btn btn-accept-request" @click="toPendingRates"> !Entiendo! </button>
                      </div>
                  </div>
              </modal>
              <modal :name="'modal'" v-if="showModalRequestDonation" @close="onModalClose" :title="'Test'" :body="'Body'">
                  <h3 slot="header">
                      <span>Doná a Carpoolear</span>
                      <br class="hidden-sm hidden-md hidden-lg">
                      <small>un proyecto de </small>
                      <img width="90" alt="STS Rosario" src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png">
                  </h3>
                  <div slot="body" class="donation">
                      <div class="text-center donation-text">
                          <p>Buenisimo que hayas encontrado con quien compartir tu viaje!</p>
                          Ayudanos a seguir siendo una plataforma abierta, colaborativa y sin fines de lucro
                      </div>
                      <div class="radio">
                          <label class="radio-inline">
                              <input type="radio" name="donationValor" id="donation50" value="200" v-model="donateValue"><span>$ 200</span>
                          </label>
                          <label class="radio-inline">
                              <input type="radio" name="donationValor" id="donation100" value="400" v-model="donateValue"><span>$ 400</span>
                          </label>
                          <label class="radio-inline">
                              <input type="radio" name="donationValor" id="donation200" value="1000" v-model="donateValue"><span>$ 1000</span>
                          </label>
                          <label class="radio-inline">
                              <input type="radio" name="donationValor" id="donation500" value="0" v-model="donateValue"><span>Elegí tu propia aventura (solo mensual)</span>
                          </label>
                      </div>
                      <div>
                          <button class="btn btn-success btn-unica-vez" @click="onDonateOnceTime">ÚNICA VEZ</button>
                          <button class="btn btn-info btn-mensualmente" @click="onDonateMonthly">MENSUAL <br />(cancelá cuando quieras)</button>
                      </div>
                      <div class="text-center">
                          <br />
                          <a href="/donar" target="_blank" v-on:click.prevent="onOpenLink('https://carpoolear.com.ar/donar')">
                              Conocé más acerca de por qué donar
                          </a>
                      </div>
                  </div>
              </modal>
              <Loading :data="pendingRates" :hideOnEmpty="true">
                  <h2 slot="title"> Calificaciones <strong>pendientes </strong></h2>
                  <div class="request-list">
                      <RatePending v-for="rate in pendingRates" v-bind:key="rate.id" :rate="rate" @rated="onUserRated" />
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones pendientes</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando calificaciones ...
                  </p>
              </Loading>
          </div>
  
          <div class="col-xs-24">
              <h2>Mis <strong>próximos</strong> viajes</h2>
              <Loading :data="trips">
                  <div class="trips-list">
                      <Trip v-for="trip in trips" v-bind:key="trip.id" :trip="trip" :user="user" :enableChangeSeats="true"></Trip>
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No tenés viajes creados</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando viajes ...
                  </p>
              </Loading>
          </div>
  
          <div class="col-xs-24">
              <Loading :data="passengerTrips" :hideOnEmpty="true">
                  <h2 slot="title" > Viajes a los que <strong>estoy subido</strong> </h2>
                  <div class="trips-list">
                      <Trip v-for="trip in passengerTrips" v-bind:key="trip.id" :trip="trip" :user="user"></Trip>
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No estas subido a ningún viaje.</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando viajes ...
                  </p>
              </Loading>
          </div>
          <div class="col-xs-24" v-if="subscriptions && subscriptions.length" id="suscriptions">
              <Loading :data="subscriptions" :hideOnEmpty="true">
                  <h2 slot="title" > Suscripciones a viajes</h2>
                  <div class="trips-list row">
                      <div class="col-xs-24 col-md-12" v-for="subs in subscriptions" v-bind:key="subs.id" :key="subs.id">
                          <subscriptionItem :subscription="subs" :user="user"></subscriptionItem>
                      </div>
  
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No tienes ninguna suscripción.</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando suscripciones ...
                  </p>
              </Loading>
          </div>
  
  
          <div class="col-xs-24" v-if="oldTrips">
              <h2>Mis viajes pasados</h2>
              <Loading :data="oldTrips">
                  <div class="trips-list">
                      <Trip v-for="trip in oldTrips" v-bind:key="trip.id" :trip="trip" :user="user"></Trip>
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No has realizado ningún viaje aún</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando viajes ...
                  </p>
              </Loading>
          </div>
  
          <div class="col-xs-24" v-if="oldPassengerTrips">
              <Loading :data="oldPassengerTrips" :hideOnEmpty="true">
                  <h2 slot="title" > Viajes a los que me <strong>subí</strong> </h2>
                  <div class="trips-list">
                      <Trip v-for="trip in oldPassengerTrips" v-bind:key="trip.id" :trip="trip" :user="user"></Trip>
                  </div>
                  <p slot="no-data" class="alert alert-warning"  role="alert">No te has subido a ningún viaje.</p>
                  <p slot="loading" class="alert alert-info" role="alert">
                      <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                      Cargando viajes ...
                  </p>
              </Loading>
          </div>
  
      </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useStore } from 'vuex'
  import subscriptionItem from '../sections/SubscriptionItem.vue'
  import Trip from '../sections/Trip.vue'
  import Loading from '../Loading.vue'
  import PendingRequest from '../PendingRequest'
  import PendingPaymentRequest from '../PendingPaymentRequest'
  import RatePending from '../RatePending'
  import Tab from '../elements/Tab'
  import modal from '../Modal'
  import dialogs from '../../services/dialogs.js'
  
  export default {
      name: 'my-trips',
      components: {
          subscriptionItem,
          Trip,
          Loading,
          PendingRequest,
          PendingPaymentRequest,
          RatePending,
          Tab,
          modal
      },
      setup() {
          const store = useStore()
  
          const showModalRequestDonation = ref(false)
          const donateValue = ref(0)
          const modalTripId = ref(0)
          const showModalPendingRates = ref(false)
          const pendingRatesValue = ref(0)
          const alreadyAlerted = ref(false)
  
          const trips = computed(() => store.getters['myTrips/myTrips'])
          const passengerTrips = computed(() => store.getters['myTrips/passengerTrips'])
          const pendingRates = computed(() => store.getters['rates/pendingRates'])
          const pendingRequest = computed(() => store.getters['passenger/pendingRequest'])
          const pendingPaymentRequests = computed(() => store.getters['passenger/pendingPaymentRequests'])
          const user = computed(() => store.getters['auth/user'])
          const oldTrips = computed(() => store.getters['myTrips/myOldTrips'])
          const oldPassengerTrips = computed(() => store.getters['myTrips/passengerOldTrips'])
          const subscriptions = computed(() => store.getters['subscriptions/subscriptions'])
          const config = computed(() => store.getters['auth/appConfig'])
  
          onMounted(async () => {
              await store.dispatch('myTrips/tripAsDriver')
              await store.dispatch('myTrips/tripAsPassenger')
              await store.dispatch('rates/pendingRate')
              await store.dispatch('passenger/getPendingRequest').then(() => {
                  store.dispatch('myTrips/oldTripsAsDriver')
                  store.dispatch('myTrips/oldTripsAsPassenger')
              })
              await store.dispatch('passenger/getPendingPaymentRequests')
              await store.dispatch('subscriptions/findSubscriptions')
          })
  
          const findTrip = (id) => {
              if (trips.value) {
                  return trips.value.find(item => item.id === id)
              }
          }
  
          const updateScroll = () => {
              if (window.route.query.loc) {
                  let domNode = document.getElementById(window.route.query.loc)
                  window.scrollTo(0, domNode.offsetTop - 150)
              }
          }
  
          const hasToShowModal = (tripId) => {
              let tripRateds = parseFloat(config.value.donation.trips_rated)
              if (user.value && !user.value.monthly_donate) {
                  if (!user.value.donations) {
                      showModalRequestDonation.value = true
                      modalTripId.value = tripId
                  } else {
                      let donation = user.value.donations.find(d => d.trip_id === tripId)
                      if (!donation) {
                          let donations = user.value.donations.filter(d => d.trip_id !== null)
                          if (donations && donations.length < tripRateds) {
                              showModalRequestDonation.value = true
                              modalTripId.value = tripId
                          }
                      }
                  }
              }
          }
  
          const onUserRated = (data) => {
              if (data.rating && config.value?.donation?.month_days > 0) {
                  hasToShowModal(data.trip_id)
              }
          }
  
          const onModalClose = () => {
              showModalRequestDonation.value = false
              store.dispatch('profile/registerDonation', {
                  has_donated: 0,
                  has_denied: 1,
                  ammount: 0,
                  trip_id: modalTripId.value
              })
          }
  
          watch(trips, () => updateScroll())
          watch(passengerTrips, () => updateScroll())
          watch(pendingRates, (newValue) => {
              updateScroll()
              if (!user.value.do_not_alert_pending_rates && !config.value.disable_user_hints) {
                  if (newValue && newValue.length > 0 && !alreadyAlerted.value) {
                      alreadyAlerted.value = true
                      showModalPendingRates.value = true
                  }
              }
          })
          watch(pendingRequest, () => updateScroll())
          watch(user, () => updateScroll())
          watch(oldTrips, () => updateScroll())
          watch(oldPassengerTrips, () => updateScroll())
  
          return {
              showModalRequestDonation,
              donateValue,
              modalTripId,
              showModalPendingRates,
              pendingRatesValue,
              alreadyAlerted,
              trips,
              passengerTrips,
              pendingRates,
              pendingRequest,
              pendingPaymentRequests,
              user,
              oldTrips,
              oldPassengerTrips,
              subscriptions,
              config,
              findTrip,
              updateScroll,
              hasToShowModal,
              onUserRated,
              onModalClose
          }
      }
  };
  </script>
  
  <style scoped>
      h2 {
          font-weight: 300;
      }
      .donation-text {
          margin-bottom: 1.5rem;
      }
      .donation-text p {
          margin-top: -1rem;
          font-size: 1.1rem;
          margin-bottom: .5rem;
      }
  </style>