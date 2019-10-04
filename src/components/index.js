import Vue from 'vue';
import { Quasar } from 'quasar';

import '../styles/quasar.styl';
import iconSet from 'quasar/icon-set/fontawesome-v5';
import lang from 'quasar/lang/en-gb';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';

import PChatbox from './Chatbox.vue';

export default (withQuasar = true) => {
  if (withQuasar) {
    Vue.use(Quasar, {
      lang,
      iconSet,
    });
  }
  return PChatbox;
};
