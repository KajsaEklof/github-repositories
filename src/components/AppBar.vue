<template>
  <v-app-bar
    app
    flat
    hide-on-scroll
    color="primary"
    class="secondary--text font-weight-black"
  >
    <v-icon color="accent" x-large class="pr-3">mdi-github</v-icon>
    <v-toolbar-title>Github Repositories App</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AppBar extends Vue {}
</script>