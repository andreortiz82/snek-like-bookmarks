<template>
  <div id="popup-component">
    <div v-if="!isSaving || !isSaved">
      <div class="list-container" v-if="!isAddingCustom">
        <header>
          <ul class="nav">
            <li class="nav-item" v-if="user === null">
              <a href="#" class="nav-link" @click="login()">Login</a>
            </li>
          </ul>
        </header>

        <section v-if="user != null">
          <div class="list-group">
            <a :key="index" v-for="(category, index) in categories" class="list-group-item" @click="chooseFromUserCategories(category, index)">{{ category.label }}</a>
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

    <div class="card" v-else>
      <div class="card-body"><h3 class="text-center">Righteous!</h3></div>
    </div>

  </div>
</template>

<script>
  import { usersRef,
          categoriesRef,
          bookmarksRef,
          heyGoogleLogin,
          heyGoogleLogout,
          heyGoogleWhatsMyAuthState } from '../lib/firebase';

  import faker from 'faker'

  export default {
    name: 'popup-component',
    data () {
      return {
        isAddingCustom: false,
        isSaving: false,
        isSaved: false,
        newCategoryName: '',
        user: null,
        category: null,
        label: '',
        bookmark: {
          title: faker.company.companyName(),
          url: faker.internet.url(),
          favIconUrl: faker.image.avatar()
        },
        categories: []
      }
    },
    methods: {
      login: function () {
        heyGoogleLogin((user)=>{
          this.user = user
        })
      },
      logout: function () {
        heyGoogleLogout((user)=>{
          this.user = user
        })
      },
      toggleView: function () {
        this.isAddingCustom = !this.isAddingCustom
      },
      chooseFromUserCategories: function (category, index) {
        var self = this
        self.isSaving = !self.isSaving
        var newCategoryObject = {
          label: category.label,
          slug: category.slug,
          owner: this.user.uid,
        }
        categoriesRef.child(category.key).once('value', function(snapshot) {
          bookmarksRef.push(self.bookMarkObject(category.key))
          self.isSaved = !self.isSaved
          window.close()
        })
      },
      saveCustomCategory: function () {
        var self = this
        self.isSaving = !self.isSaving
        var newCategoryObject = {
          label: this.newCategoryName,
          slug: this.newCategoryName.replace(/\s/g, '_').toLowerCase(),
          owner: this.user.uid
        }

        categoriesRef.push(newCategoryObject).then((category)=>{
          bookmarksRef.push(self.bookMarkObject(category.key))
          self.isSaved = !self.isSaved
          window.close()
        })

        this.newCategoryName = ''
        this.isAddingCustom = !this.isAddingCustom
      },
      bookMarkObject: function(key){
        return {
          category_key: key,
          title: this.bookmark.title,
          url: this.bookmark.url,
          favIconUrl: this.bookmark.favIconUrl
        }
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user) => {
        self.user = user
        self.categories = [] // Reset the categories when the session changes
        categoriesRef.orderByChild('owner').equalTo(self.user.uid).on('value', (snapshot) => {
          snapshot.forEach((child)=>{
            self.categories.push({
              key: child.key,
              label: child.val().label,
              owner: child.val().owner,
              slug: child.val().slug
            })
          })
        })
      })

      // For Tabs
      if (chrome.tabs !== undefined) {
        var queryInfo = {
        active: true,
        currentWindow: true }
        chrome.tabs.query(queryInfo, (tabs) => {
          this.bookmark.url = tabs[0].url
          this.bookmark.title = tabs[0].title
          this.bookmark.favIconUrl = tabs[0].favIconUrl
        })
      }
    }
  }
</script>

<style lang="scss">
  #popup-component {
    width: 280px;
  }
</style>