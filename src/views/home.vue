<template>
  <keep-alive :include="keepAliveRoute">
    <router-view/>
  </keep-alive>
</template>

<script>
import { session } from '@/libs/location'
export default {
  computed: {
    keepAliveRoute () {
      // console.log(this.$store.state.user.keepAliveRoute, 'keepAliveRoute')
      return this.$store.state.user.keepAliveRoute
    }
  },
  created () {
    session.setItem('onload', false)
  }
}
</script>
