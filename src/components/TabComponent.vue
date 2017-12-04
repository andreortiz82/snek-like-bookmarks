<template>
  <div id="tab-component">
    <header>
      <button @click="saveBookmark()" type="button">Add Bookmark</button>
    </header>
    <div class="flex">
      <div class="box" v-for="bookmark in collection" >
        <a :href="bookmark.url">
        <img :src="bookmark.favIconUrl"/>
        {{ bookmark.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../lib/api'
  import _ from 'underscore'

  export default {
    name: 'tab-component',
    data () {
      return {
        url: '',
        title: '',
        favIconUrl: '',
        isSaving: false,
        isSaved: false,
        category: '',
        collection: ''
      }
    },
    methods: {
      saveBookmark: function () {
        var self = this

        var bookmark = {
          url: this.url,
          title: this.title,
          favIconUrl: this.favIconUrl,
          category_id: this.category
        }

        api.bookmark.post(bookmark, (resource) => {
          api.bookmark.get((resource) => {
            self.collection = resource.data
          })
        })

        var self = this
        this.isSaving = !this.isSaving
        var bookmark = {
          url: this.url,
          title: this.title,
          favIconUrl: this.favIconUrl,
          category_id: this.category
        }

        api.bookmark.post(bookmark, (resource) => {
          this.isSaved = !this.isSaved
          this.isSaving = !this.isSaving
        })

      },
      filterCategories: function (data) {
        var categoryCollection = []

        data.forEach((bookmark) => {
          categoryCollection.push(bookmark.category_id)
        })

        return _.uniq(categoryCollection)
      }
    },
    created: function () {
      var queryInfo = {
      active: true,
      currentWindow: true }

      // chrome.tabs.query(queryInfo, (tabs) => {
      //   this.url = tabs[0].url
      //   this.title = tabs[0].title
      //   this.favIconUrl = tabs[0].favIconUrl
      // })
    },
    mounted: function () {
      api.category.get((resource) => {
        this.collection = resource.data
      })
    }
  }
</script>

<style lang="scss">
  #tab-component {
    .flex {
      flex-wrap: wrap;

      .box {
        width: 20%;
        padding: 10px;
        border:1px solid #ccc;
        margin: 10px;
      }
    }
  }
</style>
