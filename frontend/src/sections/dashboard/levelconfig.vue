<template>
  <div v-if="!level_loading">
    <h1 class="title">Level config</h1>
    <form @submit.prevent="setLevel" id="levelconfig">
      <h2 class="subtitle" style="text-align: left">Level system</h2>
      <div class="control">
        <label for="LS-E" class="radio">
          <input
            id="LS-E"
            type="radio"
            name="system"
            value="true"
            v-model="levelsystem"
          />
          Enabled
        </label>
        <label for="LS-D" class="radio">
          <input
            id="LS-D"
            type="radio"
            name="system"
            value="false"
            v-model="levelsystem"
          />
          Disabled
        </label>
      </div>
      <br />
      <h2 class="subtitle" style="text-align: left">Level notifications</h2>
      <div class="control">
        <label for="LN-E" class="radio">
          <input
            id="LN-E"
            type="radio"
            name="notif"
            value="true"
            v-model="levelnotif"
          />
          Enabled
        </label>
        <label for="LN-D" class="radio">
          <input
            id="LN-D"
            type="radio"
            name="notif"
            value="false"
            v-model="levelnotif"
          />
          Disabled
        </label>
      </div>
      <br />
      <div>
        <h2 class="subtitle" style="text-align: left">Roles for leveling-up</h2>
        <p style="text-align: left">
          Use <code>g%setlevelroles add [level] [roles]</code> or
          <code>g%setlevelroles remove [level]</code> for that config
        </p>
      </div>
      <br />
      <span v-if="sended" class="form-span">{{ actualState }}</span>
      <br />
      <button
        v-if="!sended"
        type="submit"
        id="LS-Submit"
        class="button"
        style="float: left"
      >
        Save
      </button>
    </form>
  </div>
  <h1 class="title" v-else-if="failed">Something happened!</h1>
  <h1 class="title" v-else-if="level_loading">Loading...</h1>
</template>

<script>
export default {
  data: function () {
    return {
      guildID: this.$route.params.guildID,
      level_loading: true,
      failed: false,
      sended: false,
      actualState: "Please wait...",
      levelnotif: "false",
      levelsystem: "false",
    };
  },
  created: function () {
    this.checkLevel();
  },
  methods: {
    checkLevel() {
      this.axios
        .get(`/api/guilds/${this.guildID}/levels`)
        .then((res) => {
          this.levelnotif = res.data.data.levelnotif.toString();
          this.levelsystem = res.data.data.levelsystem.toString();
          this.level_loading = false;
        })
        .catch(() => {
          this.failed = true;
        });
    },
    setLevel() {
      this.sended = true;
      this.actualState = "Please wait...";
      const notif = this.levelnotif == "true" ? true : false;
      const system = this.levelsystem == "true" ? true : false;
      this.axios
        .put(`/api/guilds/${this.guildID}/levels`, { notif, system })
        .then(() => {
          this.actualState = "Changes successfully saved!";
        })
        .catch(() => {
          this.actualState = "Something happened!";
        });
    },
  },
};
</script>