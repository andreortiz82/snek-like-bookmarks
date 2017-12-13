<template>
  <div id="tab-component">
    <section id="startpage-wrapper">
      <aside id="startpage-sidebar">
        <nav class="user-categories">

          <div class="add-category">
            <div class="field">
              <input type="text" id="category-name" placeholder="+ Category" v-model="newCategoryName" @keyup="saveCategory()">
            </div>
          </div>
          <label>My Categories</label>
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

        <div id="bookmark-tiles">
          <div class="bookmark-tile-container">
            <div class="bookmark-tile" v-for="(bookmark, index) in activeCategory.bookmarks">

              <a :href="bookmark.url" v-if="!editMode">
                <span class="icon"><img :src="bookmark.favIconUrl"></span>
                <span class="title">{{ bookmark.title.trunc(40) }}</span>
              </a>

              <div v-else>
                <a href="#">
                  <span class="icon"><img :src="bookmark.favIconUrl"></span>
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

    <section id="editPanel" v-if="editWindowShowing">
      <div class="window-pane">
        <a href="#" class="close" @click="editWindowShowing = !editWindowShowing">&times;</a>

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
          <button class="button" type="button" @click="updateBookmark(activeCategory.key, bookmark)">Save</button>
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

  export default {
    name: 'tab-component',
    components: { CategoryCard, NavigationBar },
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
      updateBookmark: function (categoryKey, bookmark) {
        updateBookmark(categoryKey, bookmark, () => {
          this.editWindowShowing = !this.editWindowShowing
        })
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
  // @import "../../node_modules/bootstrap/scss/bootstrap.scss";

</style>
