import Vue from 'vue'
import VueFire from 'vuefire'
import PopUpComponent from './components/PopUpComponent.vue'

import './assets/images/128.png'
import './assets/stylesheets/site.css.scss'
import 'bootstrap/scss/bootstrap.scss'
import './lib/firebase'

Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(PopUpComponent)
})