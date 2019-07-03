<template>
  <div id="app">
    <!-- <transition name="fade" mode="out-in"> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
  margin-top: 0;
  letter-spacing: 1px;
}
html {
  font-size: 625%;
}
body {
  margin: 0;
  padding: 0;
  font-size: 0.16rem;
}
.noting {
  text-align: center;
  font-size: 28px;
  color: #ccc;
  padding: 15px;
}
.padding30 {
  padding: 0 30px
}
</style>
