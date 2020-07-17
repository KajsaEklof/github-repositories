<template>
  <v-app light>
    <AppBar />
    <HelloWorld />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import AppBar from "./components/AppBar.vue";

export default Vue.extend({
  name: "App",
  components: {
    HelloWorld,
    AppBar
  },

  data: () => ({
    //
  })
});
</script>
