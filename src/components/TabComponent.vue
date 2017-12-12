<template>
  <div id="tab-component">
    <section id="startpage-wrapper">
      <aside id="startpage-sidebar">
        <nav class="user-categories">

          <div class="add-category">
            <div class="field">
              <input type="text" id="category-name" placeholder="+ Category" v-model="newCategoryName">
            </div>
          </div>
          <label>My Categories</label>
          <a @click="[viewCategoryBookmarks(category), setActive(index)]" class="category-item" :class="{'active': activeItemId == index}" v-for="(category, index) in categories">{{ category.label }}</a>
        </nav>
      </aside>

      <section id="startpage-content">
        <NavigationBar :user="user" :loginAction="authenticate" :logoutAction="authenticate"/>

        <div id="bookmark-tiles">
          <div class="bookmark-tile" v-for="(bookmark, index) in categoryBookmarks">
            <a :href="bookmark.url">
              <span class="icon"><img :src="bookmark.favIconUrl"></span>
              <span class="title">{{ bookmark.title }}</span>
            </a>
          </div>
        </div>
      </section>
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
        isSaving: false,
        isSaved: false,
        newCategoryName: '',
        user: null,
        category: null,
        label: '',
        bookmark: {
          title: '',
          url: '',
          favIconUrl: ''
        },
        categories: [],
        categoryBookmarks: []
      }
    },
    methods: {
      viewCategoryBookmarks: function (category) {
        this.categoryBookmarks = category.bookmarks
      },
      setActive: function (id) {
        this.activeItemId = id
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
        if(confirm('Are you sure?')){
          deleteBookmark(categoryKey, bookmarkKey, ()=>{})
        }
        event.preventDefault()
      },
      doDeleteCategory: function (categoryKey) {
        if(confirm('Are you sure?')){
          deleteCategory(categoryKey, ()=>{})
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
      saveCategory: function (value) {
        var newCategoryObject = {
          label: value,
          isFavorite: false,
          slug: value.replace(/\s/g, '_').toLowerCase(),
          owner: this.user.uid }

        saveCategory(newCategoryObject, (category) => {
          $('#add-category-modal').modal('hide')
          this.$refs.AddCategoryModalRef.newCategoryName = ''
        })
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
      }
    },
    mounted: function () {
      var self = this
      heyGoogleWhatsMyAuthState((user)=>{
        self.user = user
        getAllCategories(self.user, (mySavedDataCollection)=>{
          self.categories = mySavedDataCollection
          self.categoryBookmarks = self.categories[0].bookmarks
        })
      })

      $('#add-bookmark-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var categoryKey = button.data('category-key')
        self.$refs.AddBookmarkModalRef.categoryKey = categoryKey })
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
