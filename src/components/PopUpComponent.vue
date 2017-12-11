<template>
  <div id="popup-component">
    <div v-if="!isSaving || !isSaved">
      <div class="list-container" v-if="!isAddingCustom">
        <header>
          <ul class="nav">
            <li class="nav-item" v-if="user === null">
              <a href="#" class="nav-link" @click="authenticate(true)">Login</a>
            </li>
          </ul>
        </header>
        <section v-if="user != null">
          <div class="list-group-categories">
            <a :key="index" v-for="(category, index) in categories" class="list-group-item" @click="chooseFromUserCategories(category, index)">{{ category.label }}</a>
          </div>
        </section>
        <section v-if="user != null">
          <button class="btn btn-primary" @click="toggleView()">+ Add Category</button>
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
  import {
    heyGoogleLogin,
    heyGoogleLogout,
    heyGoogleWhatsMyAuthState,
    getAllCategories,
    saveCategory,
    deleteCategory,
    saveBookmark,
    deleteBookmark } from '../lib/firebase';

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
        isFavorite: false,
        bookmark: {
          isFavorite: false,
          title: '',
          url: '',
          favIconUrl: ''
        },
        categories: []
      }
    },
    methods: {
      authenticate: function (bool) {
        var self = this
        if (bool) {
          heyGoogleLogin((user)=>{
            self.user = user
            getAllCategories(self.user, (mySavedDataCollection)=>{
              self.categories = mySavedDataCollection
            })
          })
        } else {
          heyGoogleLogout((user)=>{
            self.categories = []
            self.user = user
          })
        }
      },
      toggleView: function () { this.isAddingCustom = !this.isAddingCustom },
      chooseFromUserCategories: function (category, index) {
        var self = this
        self.isSaving = !self.isSaving
        saveBookmark(category.key, self.bookMarkObject(), ()=>{
          self.isSaved = !self.isSaved
          if (chrome.tabs !== undefined) { window.close() }
        })
      },
      saveCustomCategory: function () {
        var self = this
        self.isSaving = !self.isSaving
        var newCategoryObject = {
          label: this.newCategoryName,
          isFavorite: false,
          slug: this.newCategoryName.replace(/\s/g, '_').toLowerCase(),
          owner: this.user.uid,
          key: null }

        saveCategory(newCategoryObject, (category)=>{
          saveBookmark(category.key, self.bookMarkObject(), ()=>{
            self.isSaved = !self.isSaved
            if (chrome.tabs !== undefined) { window.close() }
          })
        })
        this.newCategoryName = ''
        this.isAddingCustom = !this.isAddingCustom
      },
      bookMarkObject: function(){
        return {
          isFavorite: false,
          title: this.bookmark.title,
          url: this.bookmark.url,
          favIconUrl: this.bookmark.favIconUrl
        }
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user)=>{
        self.user = user
        getAllCategories(self.user, (mySavedDataCollection)=>{
          self.categories = mySavedDataCollection
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
  #popup-component { width: 280px; }
  #popup-component .list-group-categories {
    max-height: 393px;
    overflow-y: auto;

    .list-group-item { border-radius: 0; }

  }
  #popup-component .btn {
    width: 100%;
    height: 60px;
    border-radius: 0;
  }
</style>