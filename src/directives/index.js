import { createApp } from 'vue';
import autofocus from './autofocus';
import Jump from '@movilizame/vue-jumper';
import imgSrc from './imageSrc';
import numberFormatter from './numberFormatter';
import dateFormatter from './dateFormatter';
import debounceInput from './debounceInput';
import { VueMaskDirective } from 'v-mask';
import clickOutside from './clickOutside';
import fancyCheckbox from './fancyCheckbox';

const app = createApp({});

app.directive('focus', autofocus);
app.directive('jump', Jump);
app.directive('img-src', imgSrc);
app.directive('mask', VueMaskDirective);
app.directive('numberMask', numberFormatter);
app.directive('dateFormatter', dateFormatter);
app.directive('debounceInput', debounceInput);
app.directive('clickoutside', clickOutside);
app.directive('fancycheckbox', fancyCheckbox);
