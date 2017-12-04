<template>
  <div id="popup-component">
    <div class="popup-container">
      <div class="action-wrapper" v-if="!isSaved && !isSaving">
        <div class="field">
          <input type="text" v-model="category" name="category"/>
        </div>
        <nav class="category-list">
          <span @click="assignCategory(category)" v-for="category in categories">
            {{ category.name }}
          </span>
        </nav>

        <div class="save">
          <button @click="saveBookmark()" type="button">
            Add Bookmark
          </button>
        </div>

      </div>

      <div v-else class="confirmation-wrapper">
        <span>Saved!</span>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../lib/api'
  import _ from 'underscore'

  export default {
    name: 'popup-component',
    data () {
      return {
        url: '',
        title: '',
        favIconUrl: '',
        isSaving: false,
        isSaved: false,
        category: '',
        categories: ''
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
    mounted: function () {
      api.category.get((resource) => {
        this.categories = resource.data
      })
    },
    methods: {
      filterCategories: function (data) {
        var categoryCollection = []

        data.forEach((bookmark) => {
          categoryCollection.push(bookmark.category_id)
        })

        return _.uniq(categoryCollection)
      },
      assignCategory: function(category) {
        this.category = category.name
      },
      saveBookmark: function () {
        var self = this
        this.isSaving = !this.isSaving
        var bookmark = {
          url: this.url,
          title: this.title,
          favIconUrl: this.favIconUrl,
          category: this.category
        }

        api.category.post(bookmark, (resource) => {
          this.isSaved = !this.isSaved
          this.isSaving = !this.isSaving
        })

      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/stylesheets/variables';
  @import '../assets/stylesheets/mixins';
  @import '../assets/stylesheets/colors';

  #popup-component {
    min-width: rem(280);

    .popup-container {
      .action-wrapper {
        .field {
          input[type='text'] {
            height: rem(40);
            width: 100%;
          }
        }

        .category-list {
          > span {
            display: block;
            color: $black;
            padding: rem(5);
            font-weight: bold;
            cursor: pointer;
            border-bottom: 1px solid $ccc;
            transition: all 0.3s;

            &:hover { background: $light; }
          }
        }

        .save {
          button {
            @include button($orange, $white);
            display: block;
            width: 100%;
            border-radius: 0;
          }
        }
      }
    }
  }
</style>