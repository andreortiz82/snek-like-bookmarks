<template>
  <div id="tab-component">
    <NavigationBar :user="user" :loginAction="login" :logoutAction="logout"/>
    <div id="favorites-bar" class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="card icon">
            <div class="card-body"><a href="#" data-toggle="modal" data-target="#add-bookmark-modal">+</a></div>
          </div>
        </div>
      </div>
    </div>
    <div id="category-list" class="container-fluid">
      <div class="row">
        <div class="col-3" v-for="(category, index) in categories">
          <CategoryCard :category="category" :index="index" :deleteBookmarkAction="deleteBookmark" :deleteCategoryAction="deleteCategory"/>
        </div>
      </div>
    </div>

    <AddCategoryModal :saveCategoryAction="saveCategory" ref="AddCategoryModalRef"/>
    <AddBookmarkModal :saveBookmarkAction="saveBookmark" ref="AddBookmarkModalRef"/>
  </div>
</template>
<script>
  import { usersRef,
          categoriesRef,
          db,
          heyGoogleLogin,
          heyGoogleLogout,
          heyGoogleWhatsMyAuthState } from '../lib/firebase';

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
        var bookmark = categoriesRef.child(category.key)
        bookmark.child('bookmarks').child(key).remove()
        event.preventDefault()
      },
      deleteCategory: function (key, index) {
        var deleteConfirm = confirm('Are you Sure?')
        if (deleteConfirm) {
          this.categories.splice(index, 1)
          categoriesRef.child(key).remove()
        }
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
        categoriesRef.push().then((category)=>{
          category.set(newCategoryObject)
          $('#add-category-modal').modal('hide')
          this.$refs.AddCategoryModalRef.newCategoryName = ''
        })
      },
      saveBookmark: function (categoryKey, title, url, favIconUrl) {
        categoriesRef.child(categoryKey).child('bookmarks').push().then((bookmark)=>{
          var bookMarkObject = {
            title: title,
            url: url,
            favIconUrl: favIconUrl,
            isFavorite: false,
            key: bookmark.key }

          bookmark.set(bookMarkObject)
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
      self.getTabInfo()
      self.categories = [] // Reset the categories when the session changes
      heyGoogleWhatsMyAuthState((user) => {
        self.user = user
        // Grab the Categories
        categoriesRef.orderByChild('owner').equalTo(self.user.uid).on('value', (cSnapshot)=>{
          self.categories = []
          cSnapshot.forEach((data)=> {
            // Runs for each found
            self.categories.push({
              key: data.key,
              label: data.val().label,
              owner: data.val().owner,
              slug: data.val().slug,
              bookmarks: data.val().bookmarks
            })
          })
        })
      // -------------------
      // End - heyGoogleWhatsMyAuthState
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
