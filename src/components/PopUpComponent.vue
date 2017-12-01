<template>
  <div id="popup-component">
    <header>
      <button v-if="!isSaved && !isSaving" @click="saveBookmark()" type="button">Add Bookmark</button>
      <span v-else>Saved!</span>
    </header>
    <hr/>
    <label>{{this.url}}</label>
  </div>
</template>

<script>
import api from '../lib/api'

export default {
  name: 'popup-component',
  data () {
    return {
      url: '',
      title: '',
      favIconUrl: '',
      isSaving: false,
      isSaved: false,
    }
  },
  created: function () {
    var queryInfo = {
    active: true,
    currentWindow: true }

    chrome.tabs.query(queryInfo, (tabs) => {
      this.url = tabs[0].url
      this.title = tabs[0].title
      this.favIconUrl = tabs[0].favIconUrl
    })
  },
  methods: {
    saveBookmark: function () {
      var self = this
      this.isSaving = !this.isSaving
      var bookmark = {
        url: this.url,
        title: this.title,
        favIconUrl: this.favIconUrl,
        category_id: Math.floor((Math.random() * 10))
      }

      api.bookmark.post(bookmark, (resource) => {
        this.isSaved = !this.isSaved
        this.isSaving = !this.isSaving
      })

    }
  }
}
</script>
