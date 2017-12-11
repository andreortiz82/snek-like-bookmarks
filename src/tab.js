import Vue from 'vue'
import VueFire from 'vuefire'
import VueLocalStorage from 'vue-ls';
import TabComponent from './components/TabComponent.vue'
// import FactoryComponent from './components/FactoryComponent.vue'
import './assets/stylesheets/site.css.scss'
import 'bootstrap/scss/bootstrap.scss'

import 'jquery/dist/jquery.slim.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './lib/firebase'

Vue.use(VueLocalStorage, {namespace: 'magpie_'});
Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(TabComponent)
})
