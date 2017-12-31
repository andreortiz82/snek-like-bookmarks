<template>
  <div id="popup-component">

    <div v-if="user">
      <div v-if="!isSaving || !isSaved">
        <div class="popup-list-container" v-if="!isAddingCustom">

          <section v-if="user === null" >
            <a href="#" class="login-button" @click="authenticate(true)">Login</a>
          </section>

          <section class="categories-list" v-else>
            <div>
              <a :key="index" v-for="(category, index) in categories" class="list-group-item" @click="chooseFromUserCategories(category, index)">{{ category.label }}</a>
            </div>
             <button class="add-button" @click="toggleView()">+ Add Category</button>
          </section>
        </div>

        <div class="form" v-else>
          <div class="form-body">
            <label>New Category</label>
            <div class="field">
              <input type="text" class="category-field" name="category" v-model="newCategoryName">
            </div>
            <button type="button" class="save-button" @click="saveCustomCategory()">Save</button>
            <button type="button" class="cancel" @click="toggleView()">cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- else -->
    <section id="welcome-popup-wrapper" v-else>
      <div>
        <Logo/>
        <p><b>Snek</b> will help organize bookmarks.</p>
        <img class="google-login-button" @click="authenticate(true)" src="/static/btn_google_signin_light_normal_web@2x.png" width="200">
      </div>
    </section>

    <div class="done" v-else>
      <img src="static/favicon-100.png">
      <h3>Snek saved for you!</h3>
    </div>

  </div>
</template>

<script>
  import Logo from './Logo.vue'

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
    components: { Logo },
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
  @import "../assets/stylesheets/colors";
  @import "../assets/stylesheets/variables";
  @import "../assets/stylesheets/mixins";


  #popup-component { width: 260px; }
  #popup-component .popup-list-container {

  }

  #welcome-popup-wrapper {
    text-align: center;

    #logo svg {
      width: rem(100);
      height: rem(100);
    }

    > div {
      padding: rem(20);
      background: $light;
    }
  }

  .categories-list {
    > div {
      max-height: rem(280);
      overflow-y: auto;
    }

    a {
      display: block;
      padding: rem(10);
      background: $white;
      transition: all 0.3s;
      cursor: pointer;
      color: $dark;

      &:hover {
        background: $light;
        text-indent: rem(5);
      }
    }
  }
  .add-button {
    @include button($red, $white);
    width: 100%;
    border-radius:0;
    padding: rem(20);
  }
  .form {
    .form-body {
      padding: rem(30);

      label {
        color: $red;
        display: block;
        margin-bottom: rem(10);
        font-size: rem(14);
      }

      .field {
        input.category-field {
          background: $light;
          border:none;
          height: rem(45);
        }
      }

      .save-button {
        @include button($red, $white);
        padding: rem(10) rem(20);
      }
      .cancel {
        @include button($white, $black);
        padding: rem(10) rem(20);
      }
    }
  }
  .done {
    padding: rem(20);
    text-align: center;

    img {
      width: rem(60);
    }
    // h3 svg {
    //   color: $red !important;
    //   margin-right: rem(5);
    // }
  }
</style>