<template>
  <div class="category-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="card-title">{{ category.label.trunc(20) }}</h4>
        <a class="text-danger" href="#" @click="deleteCategoryAction(category.key, index)">&times;</a>
      </div>
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="(bookmark, bindex) in category.bookmarks" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <a :href="bookmark.url">
            <img :src="bookmark.favIconUrl" width="20"/>
            {{ bookmark.title.trunc(30) }}
          </a>
          <a class="text-danger" href="#" @click="deleteBookmarkAction(category, bookmark.key, bindex)">&times;</a>
        </div>
      </li>
      <li>
        <div>
          <a href="#" id="add-bookmark-trigger" class="nav-link" :data-category-key="category.key" data-toggle="modal" data-target="#add-bookmark-modal">+ Add Bookmark</a>
        </div>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
  import '../lib/String'

  export default {
    name: 'category-card',
    props: ['category', 'index', 'deleteBookmarkAction', 'deleteCategoryAction'],
    components: { },
    data () {
      return {}
    },
    methods: {}

  }
</script>

<style lang="scss">
  #category-card {

  }
</style>
