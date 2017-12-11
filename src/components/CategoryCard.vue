<template>
  <div class="category-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="card-title">{{ category.label.trunc(20) }}</h4>
        <div class="dropdown">
          <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-cog"></i>
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Edit</a>
            <a class="dropdown-item" href="#" @click="deleteCategoryAction(category.key)">Delete</a>
          </div>
        </div>

      </div>
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="(bookmark, bindex) in category.bookmarks" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <a :href="bookmark.url">
            <img :src="bookmark.favIconUrl" width="20"/>
            {{ bookmark.title.trunc(30) }}
          </a>

          <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fa fa-cog"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Edit</a>
              <a class="dropdown-item" href="#" @click="deleteBookmarkAction(category.key, bookmark.key)">Delete</a>
            </div>
          </div>
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
