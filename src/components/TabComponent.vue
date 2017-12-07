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
            <a href="#" class="nav-link" @click="logout()">Logout</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col" v-for="(category, index) in categories">
          <div class="card category-card" style="width: 20rem;">
            <div class="card-body">
              <h4 class="card-title">
                {{ category.label.trunc(20) }}
                <span class="badge badge-danger">{{ category.slug }}</span>
              </h4>
              <p class="card-text">
                <span class="badge badge-primary">{{ category.owner }}</span>
              </p>
            </div>
            <ul class="list-group list-group-flush">
              <li v-for="(bookmark, index) in category.bookmarks" class="list-group-item">
                <a :href="bookmark.url">
                  <img :src="bookmark.favIconUrl" width="20"/>
                  {{ bookmark.title.trunc(30) }}
                </a>
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
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user) => {
        self.user = user



        // Grab the Categories
        self.categories = [] // Reset the categories when the session changes

        var tempCategoryKey = null
        categoriesRef.orderByChild('owner').equalTo(self.user.uid).on('value', (snapshot) => {
          snapshot.forEach((child)=>{

            // Grab the Bookmarks
            var bookmarksInCategory = []
            bookmarksRef.orderByChild('category_key').equalTo(child.key).on('value', (snapshot) => {
              snapshot.forEach((child) => {
                bookmarksInCategory.push({
                  title: child.val().title,
                  url: child.val().url,
                  favIconUrl: child.val().favIconUrl,
                  category_key: child.key
                })
              })
            })

            self.categories.push({
              key: child.key,
              label: child.val().label,
              owner: child.val().owner,
              slug: child.val().slug,
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
    .category-card .list-group {
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>
