import Vue from 'vue'
import PopUpComponent from './components/PopUpComponent.vue'

import './assets/images/128.png'
import './assets/stylesheets/site.css.scss'

new Vue({
  el: '#app',
  render: h => h(PopUpComponent)
})