<template>
  <div v-if="logged && !guilds_loading">
    <h1 class="title">Select a server</h1>
    <div v-for="guild in toshow" :key="guild.id" class="box-guild">
        <guild :id="guild.id" :icon="guild.icon || null" :name="guild.name" :bot="true"></guild>
    </div>
    <div v-for="guild in adminguilds" :key="guild.id" class="box-guild">
        <guild :id="guild.id" :icon="guild.icon || null" :name="guild.name" :bot="false"></guild>
    </div>
  </div>
  <h1 class="title" v-else-if="!logged">You must be logged in before using this route...</h1>
  <h1 class="title" v-else-if="guilds_loading">Loading...</h1>
</template>

<style>
.box-guild {
  display: inline-block;
  width: 18em;
  padding: 0.5em;
}
</style>

<script>
import guild from '../partials/guild.vue';
export default {
  components: { guild },
  data: function () {
    return {
      guilds_loading: true,
      logged: this.$root.logged,
      toshow: [],
      adminguilds: [],
    };
  },
  created: function () {
      this.logged = this.$root.logged;
      this.getGuilds();
  },
  methods: {
    getGuilds() {
      this.axios.get("/api/guilds").then((res) => {
        this.toshow = res.data.guilds;
        const ids =  this.toshow.map(e => e.id);
        this.adminguilds = res.data.adminguilds.filter(e => !ids.includes(e.id));
        this.guilds_loading = false;
      });
    },
  },
};
</script>