import Vue from 'vue'
import App from './App.vue'
import store from './env/vuex'
import router from './env/router'
import './env/apis'
import './env/config'
import './env/coms'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
