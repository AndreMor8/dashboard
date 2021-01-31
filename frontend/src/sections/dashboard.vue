<template>
  <div v-if="logged && !dashboard_loading" style="display: flex">
    <aside id="dsh_left" class="dash_thing menu container">
      <ul class="menu-list">
        <li><router-link :to="{ name: 'Guilds' }">Back</router-link></li>
      </ul>
      <p class="menu-label">Administration</p>
      <ul class="menu-list">
        <li>
          <router-link
            :class="actualSection == 'Prefix' ? 'is-active' : ''"
            :to="{ name: 'Prefix', params: { guildID } }"
            >Prefix</router-link
          >
        </li>
        <li>
          <router-link
            :class="actualSection == 'LevelConfig' ? 'is-active' : ''"
            :to="{ name: 'LevelConfig', params: { guildID } }"
            >Level config</router-link
          >
        </li>
        <li>
          <router-link
            :class="actualSection == 'CustomResponses' ? 'is-active' : ''"
            :to="{ name: 'CustomResponses', params: { guildID } }"
            >Custom responses</router-link
          >
        </li>
        <li><router-link
            :class="actualSection == 'Welcome' ? 'is-active' : ''"
            :to="{ name: 'Welcome', params: { guildID } }"
            >Welcome system</router-link
          ></li>
      </ul>
    </aside>
    <aside id="dsh_right" class="dash_thing container">
      <router-view />
    </aside>
  </div>
  <h1 class="title" v-else-if="!logged">
    You must be logged in before using this route...
  </h1>
  <h1 class="title" v-else-if="failed">That ID is not in your guild list</h1>
  <h1 class="title" v-else-if="dashboard_loading">Loading...</h1>
</template>

<style>
.dash_thing {
  display: inline-block;
  text-align: left;
}
#dsh_left {
  max-width: 10rem;
}
#dsh_right {
  margin-left: 2rem;
}
.form-span {
  padding: 3px;
  margin-top: 10px;
  font-size: 20px;
  color: #000;
}
</style>

<script>
export default {
  data: function () {
    return {
      dashboard_loading: true,
      logged: this.$root.logged,
      guildID: this.$route.params.guildID,
      csrfToken: this.$root.csrfToken,
      failed: false,
      actualSection: "",
    };
  },
  created: function () {
    this.logged = this.$root.logged;
    this.csrfToken = this.$root.csrfToken;
    this.actualSection = this.$route.name;
    this.checkGuild();
  },
  methods: {
    checkGuild() {
      this.axios.get("/api/guilds").then((res) => {
        const guild = res.data.guilds.find(
          (e) => e.id == this.$route.params.guildID
        );
        if (guild) this.dashboard_loading = false;
        else this.failed = true;
      });
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.actualSection = to.name;
    next();
  },
};
</script>