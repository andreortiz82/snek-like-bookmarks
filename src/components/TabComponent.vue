<template>
  <div id="tab-component">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Magpie Bookmarks</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="user === null">
            <a href="#" class="nav-link" @click="login()">Login</a>
          </li>
          <li class="nav-item" v-else>
            <a href="#" class="nav-link" @click="logout()"><img class="mr-3" :src="user.photoURL" width="40"/>Hi {{user.displayName}}!</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row mt-5">
        <div class="col" v-for="(category, index) in categories">
          <div class="category-card" style="width: 20rem;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="card-title">{{ category.label.trunc(20) }}</h4>
                <a class="text-danger" href="#" @click="deleteCategory(category.key, index)">&times;</a>
              </div>
            </div>
            <ul class="list-group list-group-flush">
              <li v-for="(bookmark, bindex) in category.bookmarks" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <a :href="bookmark.url">
                    <img :src="bookmark.favIconUrl" width="20"/>
                    <!-- {{ bookmark.title.trunc(30) }} -->
                    {{ bookmark.key }}
                  </a>

                  <a class="text-danger" href="#" @click="deleteBookmark(category, bookmark.key, bindex)">&times;</a>
                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
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
  import '../lib/String'

  export default {
    name: 'tab-component',
    props: [],
    components: { },
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
      deleteBookmark: function (category, key, index) {
        category.bookmarks.splice(index, 1)
        bookmarksRef.child(key).remove()

      },
      deleteCategory: function (key, index) {
        this.categories.splice(index, 1)
        bookmarksRef.orderByChild('category_key').equalTo(key).on('value', (snapshot) => {
          snapshot.forEach((child) => {
            bookmarksRef.child(child.key).remove()
          })
        })
        categoriesRef.child(key).remove()
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user) => {

        self.user = user
        self.categories = [] // Reset the categories when the session changes
        var bookmarksInCategory = [] // Reset the bookmarks when the session changes

        // Grab the Categories
        categoriesRef.orderByChild('owner').equalTo(self.user.uid).once('value', (snapshot) => {
          console.log('mounted:categoriesRef:loop')
          bookmarksInCategory = []
          snapshot.forEach((cChild)=>{
            // Grab the Bookmarks
            bookmarksRef.orderByChild('category_key').equalTo(cChild.key).on('value', (snapshot) => {
              console.log('mounted:bookmarksRef:loop')
              snapshot.forEach((bChild) => {
                bookmarksInCategory.push({
                  key: bChild.key,
                  title: bChild.val().title,
                  url: bChild.val().url,
                  favIconUrl: bChild.val().favIconUrl,
                  category_key: cChild.key
                })
              })
            })

            self.categories.push({
              key: cChild.key,
              label: cChild.val().label,
              owner: cChild.val().owner,
              slug: cChild.val().slug,
              bookmarks: bookmarksInCategory
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
    },
    updated: function () {},
    destroyed: function () {}

  }
</script>

<style lang="scss">
  #tab-component {
    .category-card { margin-bottom: 20px; }
    .category-card .list-group {
      max-height: 300px;
      overflow-y: auto;

    }
  }
</style>
