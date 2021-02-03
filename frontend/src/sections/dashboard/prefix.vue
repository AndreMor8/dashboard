<template>
  <form @submit.prevent="setPrefix" v-if="!prefix_loading">
    <h2 class="subtitle" style="text-align: left">Bot prefix</h2>
    <input
      id="prefix"
      class="input"
      type="text"
      name="prefix"
      required
      v-model="prefix"
    />
    <br /><br />
    <span v-if="sended" class="form-span">{{ actualState }}</span>
    <br />
    <input
      id="prefixsubmit"
      class="button"
      style="float: left"
      type="submit"
      value="Save"
      v-if="!sended"
    />
  </form>
  <h1 class="title" v-else-if="failed">Something happened!</h1>
  <h1 class="title" v-else-if="prefix_loading">Loading...</h1>
</template>

<script>
export default {
  data: function () {
    return {
      guildID: this.$route.params.guildID,
      prefix: "g%",
      prefix_loading: true,
      failed: false,
      sended: false,
      actualState: "Please wait...",
    };
  },
  created: function () {
    this.checkPrefix();
  },
  methods: {
    checkPrefix() {
      this.axios
        .get(`/api/guilds/${this.guildID}/prefix`)
        .then((res) => {
          this.prefix = res.data.data.prefix;
          this.prefix_loading = false;
        })
        .catch(() => {
          this.failed = true;
        });
    },
    setPrefix() {
      this.actualState = "Please wait...";
      this.sended = true;
      this.axios
        .put(`/api/guilds/${this.guildID}/prefix`, { prefix: this.prefix })
        .then(() => {
          this.actualState = "Prefix setted correctly";
        })
        .catch(() => {
          this.actualState = "Something happened!";
        });
    },
  },
};
</script>