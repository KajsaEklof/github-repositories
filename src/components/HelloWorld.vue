<template>
  <v-main>
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

    <v-fade-transition>
      <v-container id="searchbox" v-if="showSearch" class="pt-16">
        <v-row justify="space-around">
          <h1>Find a GitHub Repository</h1>
        </v-row>
        <v-row justify="space-around">
          <p>
            Search for a GitHub user to view their repositories.
          </p>
        </v-row>
        <v-row justify="space-around">
          <v-col cols="6">
            <v-row>
              <v-input>
                <v-text-field
                  validate-on-blur
                  :rules="loginRules"
                  outlined
                  label="GitHub Username"
                  placeholder="Start typing a username..."
                  v-model="username"
                  @keyup.enter="fetchRepos(username)"
                  @input="clearResultErrorMessage(), (viewBranches = false)"
                  clearable
                  :loading="loading"
                >
                </v-text-field>
              </v-input>
              <v-btn
                class="ma-2 primary--text font-weight-black"
                tile
                :disabled="username.length === 0"
                @click="fetchRepos(username)"
                :loading="loading"
                color="secondary"
                light
                >Search</v-btn
              >
            </v-row>
            <v-row>
              <p v-if="resultErrorMessage" class="red--text">
                {{ resultErrorMessage }}
              </p></v-row
            >
          </v-col>
        </v-row>
      </v-container>
    </v-fade-transition>

    <!-- Repositories -->
    <v-fade-transition>
      <v-container id="repositories" v-if="viewRepos" class="pb-16">
        <v-row>
          <v-col cols="12 text-center">
            <h2 v-if="repos.length > 1">
              Here are {{ username }}'s {{ repos.length }} repositories, enjoy!
            </h2>
            <h2 v-if="repos.length < 2">
              Here is {{ username }}'s {{ repos.length }} repository, enjoy!
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            sm="4"
            v-for="repo in repos.slice(page * pageSize - 25, page * pageSize)"
            :key="repo.name"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-card
                  v-bind="attrs"
                  v-on="on"
                  class="pt-2 pb-2 ma-5"
                  @click="showBranches(repo.name, username)"
                  @keyup.enter="showBranches(repo.name, username)"
                >
                  <v-list-item three-line>
                    <v-list-item-avatar size="62"
                      ><v-img :src="repo.owner.avatar_url" alt="User Avatar"
                    /></v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        <a :href="repo.html_url" target="_blank"
                          >{{ repo.name }}
                        </a>
                      </v-list-item-title>

                      <v-list-item-subtitle
                        class="font-weight-bold primary--text"
                        >Created:
                        {{ formatDate(repo.created_at) }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="black--text">
                        {{ repo.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </template>
              <span>Clikc to view branches</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-pagination
              v-model="page"
              :length="numberOfPages"
              circle
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-fade-transition>

    <!-- Branches -->
    <v-fade-transition v-if="viewBranches">
      <v-container class="pb-16">
        <v-row>
          <v-col cols="12 text-center">
            <v-btn
              class="ma-2 primary--text font-weight-black"
              tile
              color="secondary"
              @click="hideBranches()"
              >Back to repositories</v-btn
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12 text-center">
            <h2 v-if="branches.length > 1 || branches.length === 0">
              The repository {{ repoName }} has {{ branches.length }} branches
            </h2>
            <h2 v-if="branches.length < 2 && branches.length !== 0">
              The repository {{ repoName }} has {{ branches.length }} branch
            </h2>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col sm="4">
            <v-list-item v-for="branch in branches" :key="branch.name" cols="3">
              <v-list-item-content>
                <v-list-item-title>{{ branch.name }}</v-list-item-title>
                <v-divider class="px-4"></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import moment from "moment";

@Component({})
export default class HelloWorld extends Vue {
  // Component data
  page = 1;
  pageSize = 25;
  loading = false;
  username = "";
  repos = [];
  numberOfPages = 0;
  resultErrorMessage = "";
  viewRepos = false;
  showSearch = true;
  error = "";
  viewBranches = false;
  branches = [];
  active = false;
  repoName = "";

  // Validation rules for v-input
  data() {
    return {
      loginRules: [
        (value: string) =>
          !!value || "An input is required, try searching for a username",
      ],
    };
  }

  // Methods will be component methods
  fetchRepos(username: string) {
    this.loading = true;
    axios({
      method: "GET",
      url: `https://api.github.com/users/${username}/repos?per_page=100`,
    })
      .then((response) => {
        this.repos = response.data;
        this.numberOfPages = Math.ceil(this.repos.length / 25);
        this.loading = false;
        if (this.repos.length === 0) {
          this.resultErrorMessage =
            "Sorry, that username does not exist. Try searching for someone else.";
        } else {
          this.viewRepos = true;
          // this.showSearch = false;
          console.log(this.repos);
        }
      })
      .catch((error) => {
        this.resultErrorMessage =
          "Sorry, that username does not exist. Try searching for someone else.";
        this.loading = false;
        console.log(error);
      });
  }

  hideRepos() {
    this.viewRepos = false;
    this.showSearch = true;
  }

  clearResultErrorMessage() {
    this.resultErrorMessage = "";
    this.viewRepos = false;
  }

  showBranches(repo: string, username: string) {
    console.log(repo);
    axios({
      method: "GET",
      url: ` https://api.github.com/repos/${username}/${repo}/branches`,
    })
      .then((response) => {
        this.repoName = repo;
        this.branches = response.data;
        this.viewBranches = true;
        this.viewRepos = false;
        if (this.branches.length === 0) {
          this.resultErrorMessage =
            "Sorry, that repo does not have any branches.";
        } else {
          console.log(this.branches);
        }
      })
      .catch((error) => {
        this.resultErrorMessage =
          "Sorry, that repo does not have any branches.";
        this.loading = false;
        console.log(error);
      });
  }

  hideBranches() {
    this.resultErrorMessage = "";
    this.viewBranches = false;
    this.viewRepos = true;
  }

  formatDate(date: string) {
    const newDate = moment(date);
    const formattedDate = newDate.format("D MMMM YYYY");
    return formattedDate;
  }
}
</script>
