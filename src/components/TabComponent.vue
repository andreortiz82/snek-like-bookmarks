<template>
  <div id="tab-component">
    <NavigationBar :user="user" :loginAction="authenticate" :logoutAction="authenticate"/>

    <div id="category-list" class="container-fluid">
      <div class="row">
        <div class="col-3" v-for="(category, index) in categories">
          <CategoryCard :category="category" :index="index" :deleteBookmarkAction="doDeleteBookmark" :deleteCategoryAction="doDeleteCategory"/>
        </div>
      </div>
    </div>
    <AddCategoryModal :saveCategoryAction="saveCategory" ref="AddCategoryModalRef"/>
    <AddBookmarkModal :saveBookmarkAction="saveBookmark" ref="AddBookmarkModalRef"/>
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
  import faker from 'faker'
  import '../lib/String'

  import CategoryCard from './CategoryCard.vue'
  import NavigationBar from './NavigationBar.vue'
  import AddCategoryModal from './AddCategoryModal.vue'
  import AddBookmarkModal from './AddBookmarkModal.vue'

  export default {
    name: 'tab-component',
    components: { CategoryCard, NavigationBar, AddCategoryModal, AddBookmarkModal },
    props: [],
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
        categories: [],
        favorites: []
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
  #tab-component {
    #favorites-bar {
      margin: 20px 0;
    }
    #favorites-bar .card.icon {
      width: 70px;
      height: 70px;
      text-align: center;
    }
    .category-card { margin-bottom: 20px; }
    .category-card .list-group {
      max-height: 300px;
      overflow-y: auto;

    }
  }
</style>
