<template>
  <div id="navigation-bar">

    <!-- Login -->
    <nav class="navbar" v-if="user === null">
      <div class="login option" v-if="user === null">
        <a href="#" class="nav-link" @click="loginAction(true)">Login</a>
      </div>
    </nav>

    <nav class="navbar user" v-else>
      <div class="user-info">
        <div class="bio">
          <div class="avatar">
            <img class="mr-3" :src="user.photoURL" width="40"/>
          </div>
        </div>
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
