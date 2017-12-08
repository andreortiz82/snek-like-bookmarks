<template>
  <div id="add-category-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add a new Category</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="category-name" class="col-form-label">Category</label>
              <input type="text" class="form-control" id="category-name" v-model="newCategoryName">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-link" data-dismiss="modal">cancel</button>
          <button type="button" class="btn btn-primary" @click="saveCategoryAction(newCategoryName)">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-category-modal',
    props: ['saveCategoryAction'],
    components: { },
    data () {
      return {
        newCategoryName: ''
      }
    },
    created: function () {},
    mounted: function () {},
    updated: function () {},
    destroyed: function () {}

  }
</script>

<style lang="scss">
  #add-category-modal {

  }
</style>
