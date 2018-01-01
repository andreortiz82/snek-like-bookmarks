<template>
  <div id="tab-component">

    <section v-if="user" id="startpage-wrapper">
      <aside id="startpage-sidebar">
        <div id="logo">
          <Logo/>
        </div>
        <nav class="user-categories">
          <label>My Categories</label>

          <div class="add-category">
            <div class="field">
              <input type="text" id="category-name" placeholder="+ Category" v-model="newCategoryName" @keyup="saveCategory()">
            </div>
          </div>
          <a @click="[viewCategory(category), setActive(index)]" class="category-item" :class="{'active': activeItemId == index}" v-for="(category, index) in categories">{{ category.label }}</a>
        </nav>
      </aside>

      <div id="startpage-content">
        <NavigationBar :user="user" :loginAction="authenticate" :logoutAction="authenticate"/>

        <header id="category-info-controls">
          <input type="text" id="edit-category-name" v-model="editCategoryName" @keyup="updateCategory(activeCategory)">
          <nav class="category-options">
            <a href="#" class="edit" @click="editMode = !editMode">
              <span v-if="editMode">Done</span>
              <span v-else>Edit Bookmarks</span>
            </a>
            <a href="#" class="delete" @click="doDeleteCategory(activeCategory.key)">Delete Category</a>
          </nav>
        </header>

        <div id="bookmark-tiles" v-if="activeCategory.bookmarks == null">
          <div class="empty" >
            Snek don't see bookmarks...
          </div>
        </div>

        <div id="bookmark-tiles" v-else>
          <div class="favorite-bookmarks">
            <h2>Favorites</h2>
            <div class="favorite-block-container">

              <div v-for="(bookmark, index) in activeCategory.bookmarks" v-if="bookmark.isFavorite" class="favorite-block">
                <a :href="bookmark.url" v-if="!editMode" class="icon-block">
                  <span class="icon"><img :src="getIcon(bookmark.favIconUrl)"></span>
                </a>
                <div v-else>
                  <a href="#" class="icon-block">
                    <span class="icon"><img :src="getIcon(bookmark.favIconUrl)"></span>
                  </a>
                  <div class="bookmark-options">
                    <a href="#" @click="initEdit(bookmark)">
                      Edit
                    </a>
                    <a href="#" class="delete" @click="doDeleteBookmark(activeCategory.key, bookmark.key)">
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bookmark-tile-container">
            <div class="bookmark-tile" v-for="(bookmark, index) in activeCategory.bookmarks">

              <a :href="bookmark.url" v-if="!editMode">
                <span class="icon"><img :src="getIcon(bookmark.favIconUrl)"></span>
                <span class="title">{{ bookmark.title.trunc(40) }}</span>
              </a>

              <div v-else>
                <a href="#">
                  <span class="icon"><img :src="getIcon(bookmark.favIconUrl)"></span>
                  <span class="title">{{ bookmark.title.trunc(40) }}</span>
                </a>

                <div class="bookmark-options">
                  <a href="#" @click="initEdit(bookmark)">
                    Edit
                  </a>
                  <a href="#" class="delete" @click="doDeleteBookmark(activeCategory.key, bookmark.key)">
                    Delete
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>

    <section v-else id="welcome-wrapper">
      <div class="jumbo">
        <Logo/>
        <h1>Snek welcomes you</h1>
        <p>Snek will help organize bookmarks.</p>

        <img class="google-login-button" @click="authenticate(true)" src="/static/btn_google_signin_light_normal_web@2x.png" width="240">
      </div>
    </section>

    <section id="editPanel" v-if="editWindowShowing">
      <h1>Edit this bookmark</h1>
      <div class="window-pane">
        <div class="field">
          <label for="bookmark-title">Title</label>
          <input type="text" id="bookmark-title" v-model="bookmark.title">
        </div>
        <div class="field">
          <label for="bookmark-url">URL</label>
          <input type="text" id="bookmark-url" v-model="bookmark.url">
        </div>
        <div class="field">
          <label for="bookmark-favIconUrl" >Icon URL</label>
          <input type="text" id="bookmark-favIconUrl" v-model="bookmark.favIconUrl">
        </div>

        <div class="field">
          <label class="favorite-check" for="bookmark-favorite">
            <input type="checkbox" id="bookmark-favorite" v-model="bookmark.isFavorite">
            <span>Yes. Favorite this bookmark!</span>
          </label>
        </div>

        <div class="actions">
          <button class="button" type="button" @click="doUpdateBookmark(activeCategory.key, bookmark)">Save</button>
          <a href="#" class="cancel" @click="editWindowShowing = !editWindowShowing">cancel</a>
        </div>
      </div>
    </section>

  </div>
</template>
<script>
  import {
    heyGoogleLogin,
    heyGoogleLogout,
    heyGoogleWhatsMyAuthState,
    getAllCategories,
    saveCategory,
    updateCategory,
    updateBookmark,
    deleteCategory,
    saveBookmark,
    deleteBookmark } from '../lib/firebase';
  import '../lib/String'
  import CategoryCard from './CategoryCard.vue'
  import NavigationBar from './NavigationBar.vue'
  import Logo from './Logo.vue'
  import noImage from '../../static/no-image.png'

  export default {
    name: 'tab-component',
    components: { CategoryCard, NavigationBar, noImage, Logo },
    props: [],
    data () {
      return {
        activeItemId: '',
        isAddingCustom: false,
        editMode: false,
        editWindowShowing: false,
        isSaving: false,
        isSaved: false,
        newCategoryName: '',
        editCategoryName: '',
        user: null,
        activeCategory: '',
        label: '',
        bookmark: {
          title: '',
          url: '',
          favIconUrl: '',
          color: '',
          isFavorite: ''
        },
        categories: [],
        categoryBookmarks: []
      }
    },
    methods: {
      getIcon: function(icon) {
        if (icon == '' || icon == null) {
          return noImage
        } else {
          return icon
        }
      },
      viewCategory: function (category) {
        this.activeCategory = category
        this.editCategoryName = this.activeCategory.label
      },
      setActive: function (id) {
        this.activeItemId = id
      },
      initEdit: function (bookmark) {
        this.bookmark = bookmark
        this.editWindowShowing = !this.editWindowShowing
      },
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
      doDeleteBookmark: function (categoryKey, bookmarkKey) {
        if(confirm('Are you sure?')) {
          deleteBookmark(categoryKey, bookmarkKey, ()=>{})
        }
        event.preventDefault()
      },
      doDeleteCategory: function (categoryKey) {
        if(confirm('Are you sure?')){
          deleteCategory(categoryKey, ()=>{
            this.activeItemId = 0
          })
        }
        event.preventDefault()
      },
      getTabInfo: function () {
        if (chrome.tabs !== undefined) {
          var queryInfo = {
          active: true,
          currentWindow: true }
          chrome.tabs.query(queryInfo, (tabs) => {
            this.bookmark.url = tabs[0].url
            this.bookmark.title = tabs[0].title
            this.bookmark.favIconUrl = tabs[0].favIconUrl })
        }
      },
      updateCategory: function(category) {
        if(event.keyCode === 13) {
          var updatedCategoryObject = {
            label: this.editCategoryName,
            slug: this.editCategoryName.replace(/\s/g, '_').toLowerCase(),
            owner: this.user.uid }

          updateCategory(category.key, updatedCategoryObject, ()=>{})

          this.activeCategory = category
          this.editCategoryName = updatedCategoryObject.label
        }
      },
      saveCategory: function () {
        var self = this
        if(event.keyCode === 13) {
          var newCategoryObject = {
            label: self.newCategoryName,
            isFavorite: false,
            slug: self.newCategoryName.replace(/\s/g, '_').toLowerCase(),
            owner: self.user.uid }

          saveCategory(newCategoryObject, (category) => {
            self.activeItemId = self.categories.length-1
            self.newCategoryName = ''
            self.editCategoryName = self.activeCategory.label
          })
        }
      },
      saveBookmark: function (categoryKey, title, url, favIconUrl) {
        var bookMarkObject = {
            title: title,
            url: url,
            favIconUrl: favIconUrl,
            isFavorite: false }

        saveBookmark(categoryKey, bookMarkObject, () => {
          $('#add-bookmark-modal').modal('hide')
          this.$refs.AddBookmarkModalRef.title = ''
          this.$refs.AddBookmarkModalRef.url = ''
          this.$refs.AddBookmarkModalRef.favIconUrl = ''
          this.$refs.AddBookmarkModalRef.categoryKey = ''
        })
      },
      doUpdateBookmark: function (categoryKey, bookmark) {
        updateBookmark(categoryKey, bookmark, () => {})
        this.editWindowShowing = !this.editWindowShowing
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user)=>{
        self.user = user
        getAllCategories(self.user, (mySavedDataCollection)=>{
          self.categories = mySavedDataCollection
          self.activeCategory = self.categories[0]
          self.editCategoryName = self.activeCategory.label
        })
      })
    },
    updated: function () {},
    destroyed: function () {}

  }
</script>

<style lang="scss">
  @import "../assets/stylesheets/colors";
  @import "../assets/stylesheets/variables";
  @import "../assets/stylesheets/mixins";

</style>
