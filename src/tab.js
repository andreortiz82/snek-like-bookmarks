import Vue from 'vue'
import VueFire from 'vuefire'
import VueLocalStorage from 'vue-ls';
import TabComponent from './components/TabComponent.vue'

import './assets/stylesheets/site.css.scss'
import './lib/firebase'

Vue.use(VueLocalStorage, {namespace: 'magpie_'});
Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(TabComponent)
})
