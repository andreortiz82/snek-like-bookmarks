<template>
  <div id="tab-component" class="container">
    <header class="navbar">
      <ul class="nav">
        <li v-if="user != null" class="nav-item">
          <a href="#" class="nav-link" @click="logout()">Logout</a>
        </li>
        <li v-else class="nav-item">
          <a href="#" class="nav-link" @click="login()">Login</a>
        </li>
      </ul>
    </header>

    <section v-if="user != null">
      <div class="form-group">
        <label for="exampleFormControlSelect1">Choose a Category</label>
        <select v-model="label" class="form-control">
          <option v-for="category in categories" :value="category.label">{{ category.label }}</option>
        </select>
      </div>
      <button type="button" class="btn btn-primary" @click="addCategory()">+ Add Category</button>
    </section>

    <hr/>

    <div class="row">
      <div class="col" v-for="category in categories" :key="category['.key']">
        <div class="card">
          <div class="card-body">
            <h5>{{ category.label }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { usersRef, categoriesRef, firebase, FB } from '../lib/firebase';
  import faker from 'faker'

  export default {
    name: 'tab-component',
    firebase: {
      categories: categoriesRef
    },
    data () {
      return {
        user: null,
        category: null,
        label: faker.commerce.department(),
        title: faker.company.companyName(),
        url: faker.internet.url(),
        favIconUrl: faker.image.avatar()
      }
    },
    methods: {
      loadSession: function () {

      },
      saveSession: function () {

      },
      login: function () {
        var self = this
        var provider = new FB.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;

          self.user = {
            token: token,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL }

          console.log(self.user)


        }).catch(function(error) {
          console.log('error => ',error)
        });
      },
      logout: function () {
        var self = this
        firebase.auth().signOut().then(function(signOut) {
          self.user = null
        }).catch(function(error) {
          console.log('error => ',error)
        });
      },
      addCategory: function () {
        var object = {
          label: faker.commerce.department(),
          owner: this.user.uid,
          bookmarks: {
            title: faker.company.companyName(),
            url: faker.internet.url(),
            favIconUrl: faker.image.avatar()
          }
        }

        categoriesRef.push(object)

        this.label = faker.commerce.department()
        this.title = faker.company.companyName()
        this.url = faker.internet.url()
        this.favIconUrl = faker.image.avatar()
      }
    },
    mounted: function () {
      var self = this
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          self.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL }
        }

        console.log(self.user)

      })
      // var self = this
      // var queryInfo = {
      // active: true,
      // currentWindow: true }

      // chrome.tabs.query(queryInfo, (tabs) => {
      //   this.url = tabs[0].url
      //   this.title = tabs[0].title
      //   this.favIconUrl = tabs[0].favIconUrl
      // })
    }
  }
</script>