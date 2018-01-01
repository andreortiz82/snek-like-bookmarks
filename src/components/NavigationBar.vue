<template>
  <div id="navigation-bar">

    <!-- Login -->
    <nav class="navbar user">
      <span>
        {{ currentTime }}
      </span>
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
  import moment from 'moment'

  export default {
    name: 'navigation-bar',
    props: ['user', 'loginAction', 'logoutAction'],
    components: { },
    data () {
      return {
        currentTime: moment(new Date()).format('LLLL')
      }
    },
    created: function () {},
    mounted: function () {
    },
    updated: function () {},
    destroyed: function () {}

  }
</script>
