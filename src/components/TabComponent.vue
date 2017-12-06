<template>
  <div id="tab-component">
    <div class="list-container" v-if="!isAddingCustom">
      <header>
        <ul class="nav">
          <li v-if="user == null" class="nav-item">
            <a href="#" class="nav-link" @click="login()">Login</a>
          </li>
        </ul>
      </header>

      <section v-if="user != null">
        <div class="list-group">
          <a :key="category['.key']" v-for="(category, index) in categories" class="list-group-item" @click="chooseFromUserCategories(category, index)">{{ category.label }}</a>
          <a href="#" class="list-group-item" @click="toggleView()">+ Add Category</a>
        </div>
      </section>
    </div>

    <div class="form-container card" v-else>
      <div class="form-group card-body">
        <label>New Category</label>
        <input type="text" class="form-control" name="category" v-model="newCategoryName">
        <hr>
        <button type="button" class="btn btn-primary" @click="saveCustomCategory()">Save</button>
        <button type="button" class="btn btn-link" @click="toggleView()">cancel</button>
      </div>

    </div>

  </div>
</template>

<script>
  import { usersRef, categoriesRef, bookmarksRef, firebase, FB } from '../lib/firebase';
  import faker from 'faker'

  export default {
    name: 'tab-component',
    firebase: {
      categories: categoriesRef
    },
    data () {
      return {
        isAddingCustom: false,
        newCategoryName: '',
        user: null,
        category: null,
        label: faker.commerce.department(),
        title: faker.company.companyName(),
        url: faker.internet.url(),
        favIconUrl: faker.image.avatar()
      }
    },
    methods: {
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
      chooseFromUserCategories: function (category, index) {
        var self = this
        var newCategoryObject = {
          label: category.label,
          slug: category.slug,
          owner: this.user.uid,
        }

        // Find that CAT =>  Push the BM
        categoriesRef.child(category['.key']).once('value', function(snapshot) {
          var exists = (snapshot.val() !== null);
          if(!exists){
            bookmarksRef.push(self.bookMarkObject())
          }
        })
      },
      toggleView: function () {
        this.isAddingCustom = !this.isAddingCustom
      },
      saveCustomCategory: function () {
        var newCategoryObject = {
          label: this.newCategoryName,
          slug: this.newCategoryName.replace(/\s/g, '_').toLowerCase() ,
          owner: this.user.uid,
        }
        categoriesRef.push(newCategoryObject).child('bookmarks').push(this.bookMarkObject())
        this.newCategoryName = ''
        this.isAddingCustom = !this.isAddingCustom
      },
      bookMarkObject: function(){
        return {
          title: this.title,
          url: this.url,
          favIconUrl: this.favIconUrl
        }
      }
    },
    mounted: function () {
      var self = this
      var queryInfo = {
      active: true,
      currentWindow: true }

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          self.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL }

          usersRef.child(self.user.uid).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if(!exists){
              usersRef.child(self.user.uid).push(self.user)
            }
          })

          if (chrome.tabs != undefined) {
            chrome.tabs.query(queryInfo, (tabs) => {
              this.url = tabs[0].url
              this.title = tabs[0].title
              this.favIconUrl = tabs[0].favIconUrl
            })
          }

        }

      })
    }
  }
</script>

<style lang="scss">
  #tab-component {
    width: 280px;
  }
</style>