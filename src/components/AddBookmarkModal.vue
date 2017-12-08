<template>
  <div id="add-bookmark-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add a new Bookmark</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="bookmark-title" class="col-form-label">Title</label>
              <input type="text" class="form-control" id="bookmark-title" v-model="title">
            </div>
            <div class="form-group">
              <label for="bookmark-url" class="col-form-label">URL</label>
              <input type="text" class="form-control" id="bookmark-url" v-model="url">
            </div>
            <div class="form-group">
              <label for="bookmark-favIconUrl" class="col-form-label">Icon</label>
              <input type="text" class="form-control" id="bookmark-favIconUrl" v-model="favIconUrl">
              <input type="hidden" id="category-key-field" v-model="categoryKey">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-link" data-dismiss="modal">cancel</button>
          <button type="button" class="btn btn-primary" @click="saveBookmarkAction(categoryKey, title, url, favIconUrl)">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-bookmark-modal',
    props: ['saveBookmarkAction'],
    components: { },
    data () {
      return {
        title:'',
        url:'',
        favIconUrl:'',
        categoryKey: ''
      }
    },
    created: function () {},
    mounted: function () {},
    updated: function () {},
    destroyed: function () {}

  }
</script>

<style lang="scss">
  #add-bookmark-modal {

  }
</style>
