/* jshint esversion: 6 */

import 'babel-polyfill';

import { createApp } from 'vue';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import App from './App';
import router from './router';
import store from './store';
import messages from './language/i18n';

import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import VueMoment from 'vue-moment';

/* eslint-disable no-unused-vars */
import cordova from './cordova';
import directives from './directives';

import bootstrapCss from './styles/bootstrap/css/bootstrap.min.css';

import cssHelpers from './styles/helpers';
import css from './styles/main';

import bus from './services/bus-event';
import { DebugApi } from './services/api';

import Vue2Leaflet from 'vue2-leaflet';

import * as VueGoogleMaps from 'vue-google-maps';

const ROUTE_BASE = process.env.ROUTE_BASE;

let debugApi = new DebugApi();
let cordovaTag = document.createElement('script');
let cordovaPath = 'cordova.js';
console.log('ROUTE_BASE', ROUTE_BASE, cordovaPath);
cordovaTag.setAttribute('src', ROUTE_BASE + cordovaPath);
document.head.appendChild(cordovaTag);

var moment = require('moment-timezone');
moment.tz.setDefault('America/Argentina');
require('moment/locale/es');
require('font-awesome-webpack-4');

// Create Vue 3 app instance
const app = createApp(App);

// Configure plugins
const i18n = createI18n({
  locale: 'es', // default locale
  messages
});

app.use(store);
app.use(router);
app.use(i18n);

Vue.use(VueResource);

Vue.use(VueAnalytics, {
    id: 'UA-40995702-4'
});

Vue.use(VueMoment);
require('./filters.js');
require('./prototypes.js');

/* import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.MAPS_API,
        libraries: 'places',
        installComponents: true
    }
}); */

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  let data = {};
  data.log = err.stack;
  debugApi.log(data);
};

// Initialize store
if (process.env.SERVE) {
  console.log('Not running in cordova.');
  store.dispatch('init');
} else {
  if (process.env.NODE_ENV === 'development') {
    setTimeout(function () {
      if (!window.cordova) {
        console.log('Not running in cordova.');
        store.dispatch('init');
      }
    }, 2000);
  } else {
    console.log('no process at all', process.env.NODE_ENV);
    setTimeout(function () {
      if (!window.cordova) {
        console.log('Not running in cordova.');
        store.dispatch('init');
      }
    }, 2000);
  }
}
console.log('APP NAME: ' + process.env.TARGET_APP);

// Mount app
app.mount('#app');
