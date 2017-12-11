<template>
  <div id="factory-component">
    <Pop/>
    <div class="card container">
      <div class="card-body">
        <h1>User</h1>
        <div >
          <a v-if="user === null" href="#" class="btn btn-primary" @click="authenticate(true)">Login</a>
          <a v-else href="#" class="btn btn-danger" @click="authenticate(false)">Logout</a>
        </div>
        <p>{{user}}</p>
        <hr>
        <h2>Categories</h2>
        <p>{{ categories }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    heyGoogleLogin,
    heyGoogleLogout,
    heyGoogleGetMyStartpage,
    heyGoogleWhatsMyAuthState } from '../lib/firebase';
  import faker from 'faker'
  import Pop from './PopUpComponent.vue'
  export default {
    name: 'factory-component',
    props: [],
    components: { Pop },
    data () {
      return {
        user: null,
        categoriesRef: null,
        categories: []
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user)=>{
        self.user = user
        heyGoogleGetMyStartpage(self.user, (mySavedDataCollection)=>{
          self.categories = mySavedDataCollection
        })
      })
    },
    methods: {
      authenticate: function (bool) {
        var self = this
        if (bool) {
          heyGoogleLogin((user)=>{
            self.user = user
            heyGoogleGetMyStartpage(self.user, (mySavedDataCollection)=>{
              self.categories = mySavedDataCollection
            })
          })
        } else {
          heyGoogleLogout((user)=>{
            self.categories = []
            self.user = user
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  #factory-component {

  }
</style>
