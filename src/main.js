import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import VueClipboard from 'vue-clipboard2'
import Flutterwave from  "flutterwave-vue-v3";
import VueMeta from 'vue-meta';
import VueAnalytics from 'vue-analytics';

Vue.use(VueMeta);
Vue.use(VueClipboard);
Vue.use(require('vue-moment'));
Vue.use(Flutterwave, { publicKey: '' } )
// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'UA-198232565-2',
  router
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,

  render: function (h) {
    return h(App);
  }
}).$mount("#app");
