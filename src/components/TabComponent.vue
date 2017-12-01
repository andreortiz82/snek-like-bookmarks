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

  export default {
    name: 'tab-component',
    data () {
      return {
        collection: {}
      }
    },
    methods: {
      saveBookmark: function () {
        var self = this
        var bookmark = {
          url:'http://test.com/',
          label: 'Test',
          category_id: Math.floor((Math.random() * 10))
        }

        api.bookmark.post(bookmark, (resource) => {
          api.bookmark.get((resource) => {
            self.collection = resource.data
          })
        })

      }
    },
    mounted: function () {
      api.bookmark.get((resource) => {
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
