import Vue from 'vue';
import PChatboxFactory from './components';

Vue.config.productionTip = false;

// TODO: write component doc
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(PChatboxFactory(true), {
    props: {
      // TODO: add avatars for testing
      useravatar: '../public/astronaut.png',
      botavatar: '../public/pedro.png',
      botname: 'Pedro',
      username: 'You, the pioneer',
      token: '',
    },
  }),
});
