<template>
  <div class="content">
    <h1 v-if="stats_loading" style="font-size: xxx-large" class="title">
      Loading...
    </h1>
    <div v-else>
      <h1 style="font-size: xxx-large" class="title">Stats</h1>
      <p style="font-size: 3vh">
        <b>Dashboard memory usage:</b> {{ stats.memoryrssusage }}<br />
        <b>Uptime:</b> {{ stats.uptime }} <br />
        <b>Machine memory:</b> {{ stats.memory }} <br />
        <b>Node.js:</b> {{ stats.nodeversion }} <br />
        <b>Hosting service:</b> {{ stats.hoster }} <br /><br />
        <b>Operating system:</b> {{ stats.system }} <br /><br />
        <b>CPU:</b> {{ stats.cpu }} <br /><br />
        <b>Arch:</b> {{ stats.arch }} <br />
        <b>Platform:</b> {{ stats.platform }}
      </p>
      <button class="button" @click="getStats">Refresh</button>
    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  data() {
    return {
      stats_loading: true,
      stats: {
        memoryrssusage: "",
        uptime: "",
        memory: "",
        nodeversion: "",
        hoster: "",
        system: "",
        cpu: "",
        arch: "",
        platform: "",
      },
    };
  },
  created: function () {
    this.getStats();
  },
  methods: {
    getStats: function () {
      this.axios.get("/api/stats").then((res) => {
        this.stats.memoryrssusage = this.memory(res.data.memoryrssusage);
        this.stats.uptime = res.data.uptime;
        this.stats.memory =
          this.memory(res.data.totalmem - res.data.freemem, false) +
          " / " +
          this.memory(res.data.totalmem);
        this.stats.nodeversion = res.data.nodeversion;
        this.stats.hoster = res.data.hoster;
        this.stats.system = res.data.system;
        this.stats.platform = res.data.platform;
        this.stats.cpu = res.data.cpu;
        this.stats.arch = res.data.arch;
        this.stats_loading = false;
      });
    },
    memory(bytes, r = true) {
      const gigaBytes = bytes / 1024 ** 3;
      if (gigaBytes > 1) {
        return `${gigaBytes.toFixed(1)} ${r ? "GB" : ""}`;
      }

      const megaBytes = bytes / 1024 ** 2;
      if (megaBytes > 1) {
        return `${megaBytes.toFixed(2)} ${r ? "MB" : ""}`;
      }

      const kiloBytes = bytes / 1024;
      if (kiloBytes > 1) {
        return `${kiloBytes.toFixed(2)} ${r ? "KB" : ""}`;
      }

      return `${bytes.toFixed(2)} ${r ? "B" : ""}`;
    },
  },
};
</script>