<template>
  <div id="navigation-bar">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Magpie Bookmarks</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="user === null">
            <a href="#" class="nav-link" @click="loginAction">Login</a>
          </li>
          <li class="nav-item" v-else>
            <a href="#" class="nav-link" @click="logoutAction"><img class="mr-3" :src="user.photoURL" width="40"/>Hi {{user.displayName}}!</a>
          </li>
        </ul>
        <ul class="navbar-nav ">
          <li class="nav-item">
            <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#add-category-modal">+ Add Category</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'navigation-bar',
    props: ['user', 'loginAction', 'logoutAction'],
    components: { },
    data () {
      return {}
    },
    created: function () {},
    mounted: function () {},
    updated: function () {},
    destroyed: function () {}

  }
</script>

<style lang="scss">
  #navigation-bar {

  }
</style>
