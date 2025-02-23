<template>
    <div class="update-profile-component" v-if="user" >
      <div class="alert alert-info" v-if="!user.image || user.image.length === 0 || !user.description || user.description.length === 0">
          <div class='alert-icon'><i class="fa fa-exclamation" aria-hidden="true"></i></div>
          <div class='alert-message'>
              {{ $t('hola') }} <strong>{{user.name}}</strong> {{ $t('bienvenidoACarpoolear') }}
              <span v-if="(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                  {{ $t('completaTu') }} <strong>{{ $t('imagenPerfil') }}</strong> {{ $t('yTu') }} <strong>{{ $t('descripcion') }}</strong> {{ $t('comenzarViajar') }}
              </span>
              <span v-if="(!user.image || user.image.length === 0) && !(!user.description || user.description.length === 0)">
                  {{ $t('completaTu') }} <strong>{{ $t('imagenPerfil') }}</strong> {{ $t('comenzarViajar') }}
              </span>
              <span v-if="!(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                  {{ $t('completaTu') }} <strong>{{ $t('descripcion') }}</strong> {{ $t('comenzarViajar') }}
              </span>
          </div>
      </div>
      <div class="row">
          <div class="col-xs-24 col-sm-8 col-sm-push-16 profile_image">
              <div class='profile_image-container'>
                  <div class="circle-box" v-imgSrc:profile="user.image" :class="{'loading': loadingImg}">
                      <div @click="changePhoto" class="profile_image-edit">
                          <svgItem icon='addPhoto' size='28'></svgItem>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-xs-24 col-sm-16 col-sm-pull-8">
              <div class='form'>
                  <div class="alert alert-info">
                      {{ $t('incentivoFoto') }}
                  </div>
                  <div class="form-group">
                      <label for="input-name">{{ $t('nombreYapellido') }} <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                      <input maxlength="25" v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre" :class="{'has-error': nombreError.state }" :disabled="!firstTime" />
                      <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
                  </div>
                  <div class="form-group">
                      <label for="input-email">E-mail <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                      <input maxlength="40" v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail" disabled>
                  </div>
                  <!--<div class="form-group">
                      <label for="">Fecha de nacimiento <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                      <DatePicker :value="birthday | moment('YYYY-MM-DD') " ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>
                      <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
                  </div>-->
                  <div class="form-group">
                      <label for="input-description">{{ $t('acercaDeMi') }} <span class="required-field-flag" title="Campo requerido">(*)</span><span class="description"> {{ $t('incentivoDescripcion') }}</span></label>
                      <textarea maxlength="2000" v-model="user.description" placeholder="Descripción" :class="{'has-error': descError.state }" ></textarea>
                      <span class="error textarea" v-if="descError.state"> {{descError.message}} </span>
                  </div>
                  <hr />
                  <p class="form-group">
                      {{ $t('siSosConductorDatosVisibles') }}
                  </p>
                  <div class="form-group">
                      <label for="input-dni">{{ $t('documento') }} <span class="required-field-flag" title="Campo requerido">(*)</span> <span class="description">({{ $t('soloNumeros') }}). {{ $t('incentivoDoc') }} {{ $t('doc') }} {{ $t('momentoViajar') }}</span></label>
                      <input v-numberMask="'dniRawValue'" type="text" data-max-length="8" v-model="user.nro_doc" class="form-control" id="input-dni" :placeholder="$t('doc')" :class="{'has-error': dniError.state }">
                      <span class="error" v-if="dniError.state"> {{dniError.message}} </span>
                  </div>
                  <div class="form-group">
                      <label for="input-telefono">{{ $t('nroTel') }}<span class="required-field-flag" title="Campo requerido">(*)</span> <span class="description">({{ $t('ejemploTelefono') }}). {{ $t('incentivoTelefono') }}</span></label>
                      <input maxlength="20" @keydown="isNumber" v-on:paste='isNumber' v-model="user.mobile_phone" type="tel" class="form-control" id="input-telefono" placeholder="Número de teléfono (al menos 7 números)" :class="{'has-error': phoneError.state }">
                      <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
                  </div>
  
                  <div class="form-group">
                      <label for="input-telefono">{{ $t('patente') }} <span class="description"> ({{ $t('soloConductores') }}). {{ $t('incentivoPatente') }}</span></label>
                      <input maxlength="20" v-model="patente" type="text" class="form-control" id="input-phone" :class="{'has-error': patentError.state }">
                      <span class="error" v-if="patentError.state"> {{patentError.message}} </span>
                  </div>
                  <div class="checkbox">
                      <label>
                      <input type="checkbox" v-model="user.data_visibility" true-value="1"
    false-value="0"> {{ $t('datosVisiblesCheck') }}
                      </label>
                      <div>
                          {{ $t('tildaOpcionDatosVisibles') }}
                      </div>
                  </div>
                  <hr />
                  <div class="checkbox">
                      <label>
                      <input type="checkbox" v-model="user.emails_notifications"> {{ $t('notificacionesPorCorreo') }}
                      </label>
                  </div>
                  <hr />
                  <div class="checkbox">
                      <label >
                          <input type="checkbox"  @change="changeShowPassword"> {{ $t('cambiarPassword') }}
                      </label>
                  </div>
                  <div class="form-group" v-if="showChangePassword">
                      <label for="input-pass">{{ $t('ingreseNuevaPassword') }}</label>
                      <input maxlength="40" v-model="pass.password" type="password" class="form-control" id="input-pass" placeholder="Contraseña">
                      <input maxlength="40" v-model="pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repetir contraseña">
                  </div>
  
                  <hr v-if="settings.module_unaswered_message_limit" />
                  <div class="form-group" v-if="settings.module_unaswered_message_limit">
                      <label for="input-unaswered_messages_limit">{{ $t('unaswered_messages_limit') }} <span class="description">({{ $t('unaswered_messages_limitDescription') }})</span></label>
                      <input type="numer" data-max-length="8" v-model="user.unaswered_messages_limit" class="form-control" id="input-unaswered_messages_limit" :class="{'has-error': unaswered_messages_limitError.state }">
                      <span class="error" v-if="unaswered_messages_limitError.state"> {{unaswered_messages_limitError.message}} </span>
                  </div>
                  <hr />
                  <div class="checkbox" v-if="settings.module_validated_drivers && !user.driver_is_verified">
                      <label >
                          <input type="checkbox" @change="changeBeDriver" v-model="this.showBeDriver"> {{ $t('solicitarSerChofer') }}
                      </label>
                  </div>
                  <div class="form-group" v-if="settings.module_validated_drivers && showBeDriver && !user.driver_is_verified">
                      <label for="driver_documentation">{{ $t('ingreseDocumentacion') }}</label>
                      <input type="file" id="driver_documentation" multiple @change="onDriverDocumentChange" />
                      <p class="help-block">{{ $t('seRequiereDocumentacion') }}</p>
                  </div>
                  <div v-if="user.driver_is_verified">
                      <i class="fa fa-check-circle check-driver-verified" aria-hidden="true"></i>
                      <strong>{{ $t('choferVerificado') }}</strong>
                  </div>
                  <div v-if="user.driver_is_verified || (settings.module_validated_drivers && showBeDriver)">
                      <div class="form-group">
                          <label for="tipoDeCuenta">
                              {{ $t('tipoDeCuenta') }}
                              <span class="required-field-flag" title="Campo requerido">(*)</span>
                          </label>
                          <select v-model="user.account_type" id="tipoDeCuenta" class="form-control">
                              <option v-for="option in accountTypes" v-bind:value="option.id">
                                  {{ option.name }}
                              </option>
                          </select>
                          <span class="error" v-if="accountTypeError.state"> {{accountTypeError.message}} </span>
                      </div>
                      <div class="form-group">
                          <label for="bancoDeCuenta">
                              {{ $t('bancoDeCuenta') }}
                              <span class="required-field-flag" title="Campo requerido">(*)</span>
                          </label>
                          <select v-model="user.account_bank" id="" class="form-control">
                              <option v-for="option in banks" v-bind:value="option.id">
                                  {{ option.name }}
                              </option>
                          </select>
                          <span class="error" v-if="accountBankError.state"> {{accountBankError.message}} </span>
                      </div>
                      <div class="form-group">
                          <label for="accountNumber">
                              {{ $t('numeroDeCuenta') }}
                              <span class="required-field-flag" title="Campo requerido">(*)</span>
                          </label>
                          <input v-model="user.account_number" type="text" class="form-control" id="accountNumber" :placeholder="$t('numeroDeCuenta')">
                          <span class="error" v-if="accountNumberError.state"> {{accountNumberError.message}} </span>
                      </div>
                  </div>
                  <div class="row" v-if="Array.isArray(user.driver_data_docs) && user.driver_data_docs.length">
                      <div v-imgSrc:docs="img"  v-for="img in user.driver_data_docs" class="img-doc col-md-8 col-sm-12"></div>
                  </div>
  
                  <div class="btn-container">
                      <button class="btn btn-primary" @click="grabar" :disabled="loading">
                          <span v-if="!loading">{{ $t('guardarCambios') }}</span>
                          <spinner class="blue" v-if="loading"></spinner>
                      </button>
                      <span class="required-field-flag" v-bind:class="{ 'required-field-info': isMobile }">{{ $t('camposObligatorios') }}</span>
                  </div>
                  <span v-if="error">{{error}}</span>
                  <Uploadfile :name="'profile'" @change="onPhotoChange" ref="file"></Uploadfile>
              </div>
          </div>
      </div>
  
    </div>
  </template>
  <script>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useStore } from 'vuex'
  import DatePicker from '../DatePicker.vue'
  import Uploadfile from '../Uploadfile.vue'
  import SvgItem from '../SvgItem.vue'
  import Spinner from '../Spinner.vue'
  import moment from 'moment'
  import dialogs from '../../services/dialogs'
  import { inputIsNumber } from '../../services/utility'
  
  class Error {
      constructor(state = false, message = '') {
          this.state = false
          this.message = ''
      }
  }
  
  const patentRegex = /([A-Za-z]{3}[0-9]{3})|([A-Za-z]{2}[0-9]{3}[A-Za-z]{2})/
  
  export default {
      name: 'update-profile',
      components: {
          DatePicker,
          Uploadfile,
          SvgItem,
          Spinner
      },
      setup() {
          const store = useStore()
          
          const user = ref(null)
          const car = ref(null)
          const patente = ref('')
          const pass = ref({
              password: '',
              password_confirmation: ''
          })
          const error = ref(null)
          const loading = ref(false)
          const loadingImg = ref(false)
          const dniRawValue = ref('')
          const globalError = ref(false)
          const nombreError = ref(new Error())
          const descError = ref(new Error())
          const birthdayError = ref(new Error())
          const patentError = ref(new Error())
          const dniError = ref(new Error())
          const unaswered_messages_limitError = ref(new Error())
          const phoneError = ref(new Error())
          const emailError = ref(new Error())
          const accountNumberError = ref(new Error())
          const accountTypeError = ref(new Error())
          const accountBankError = ref(new Error())
          const maxDate = ref(moment().toDate())
          const minDate = ref(moment('1900-01-01').toDate())
          const birthday = ref('')
          const birthdayAnswer = ref('')
          const showChangePassword = ref(false)
          const showBeDriver = ref(false)
          const driverFiles = ref(null)
          const banks = ref([])
          const accountTypes = ref([])

          const userData = computed(() => store.getters['auth/user'])
          const firstTime = computed(() => store.getters['auth/firstTime'])
          const cars = computed(() => store.getters['cars/cars'])
          const isMobile = computed(() => store.getters['device/isMobile'])
          const settings = computed(() => store.getters['auth/appConfig'])

          const iptUser = computed(() => user.value?.name)
          const iptEmail = computed(() => user.value?.email)
          const iptBirthday = computed(() => user.value?.birthdayAnswer)
          const iptDescription = computed(() => user.value?.description)
          const iptDni = computed(() => user.value?.nro_doc)
          const iptPhone = computed(() => user.value?.mobile_phone)

          const changeShowPassword = () => {
              showChangePassword.value = !showChangePassword.value
          }

          const changeBeDriver = () => {
              showBeDriver.value = !showBeDriver.value
          }

          const isNumber = (value) => {
              inputIsNumber(value)
          }

          const onPhotoChange = async (data) => {
              loadingImg.value = true
              try {
                  await store.dispatch('auth/updatePhoto', data)
              } finally {
                  loadingImg.value = false
              }
          }

          // Add other methods here...

          onMounted(() => {
              user.value = store.getters['auth/user']
              if (Array.isArray(user.value?.driver_data_docs) && user.value.driver_data_docs.length) {
                  showBeDriver.value = true
              }
              
              if (cars.value?.length > 0) {
                  car.value = cars.value[0]
                  patente.value = car.value.patente
              }

              try {
                  if (moment(user.value?.birthday, 'YYYY-MM-DD').isValid()) {
                      birthday.value = moment(user.value.birthday, 'YYYY-MM-DD')
                  } else {
                      birthday.value = ''
                  }
              } catch (ex) {
                  console.log('exception', ex)
              }
          })

          return {
              user,
              car,
              patente,
              pass,
              error,
              loading,
              loadingImg,
              dniRawValue,
              globalError,
              nombreError,
              descError,
              birthdayError,
              patentError,
              dniError,
              unaswered_messages_limitError,
              phoneError,
              emailError,
              accountNumberError,
              accountTypeError,
              accountBankError,
              maxDate,
              minDate,
              birthday,
              birthdayAnswer,
              showChangePassword,
              showBeDriver,
              driverFiles,
              banks,
              accountTypes,
              userData,
              firstTime,
              cars,
              isMobile,
              settings,
              iptUser,
              iptEmail,
              iptBirthday,
              iptDescription,
              iptDni,
              iptPhone,
              changeShowPassword,
              changeBeDriver,
              isNumber,
              onPhotoChange
          }
      }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
      .required-field-flag {
          color: red;
      }
      .required-field-info {
          display: block;
          padding: 1em 0;
      }
      .profile_image-container.error .circle-box {
          border: solid 2px red;
      }
      .profile_image-container.error .span {
          color: red;
      }
      span.error {
          display: block;
          font-size: 12px;
          margin-top: -5px;
          font-weight: bold;
          color: red;
      }
      span.error.textarea {
          margin-top: .8em;
      }
      @media only screen and (min-width: 768px) {
          span.error {
              font-weight: 300;
          }
      }
      .img-doc {
          height: 320px;
          background-size: cover;
      }
      .check-driver-verified {
          font-size: 24px;
          vertical-align: -2px;
          margin-right: 5px;
          color: var(--trip-mostly-free-color);
      }
  
      hr {
          border-top: 1px solid #CCCCCC;
      }
  </style>