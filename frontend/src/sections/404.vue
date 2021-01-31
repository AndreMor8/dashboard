<template>
  <h1 class="title">Not Found</h1>
</template>

<script>
export default {
  data: function () {
    return {
      timeout: null,
    };
  },
  created: function () {
    const router = this.$router;
    this.timeout = setTimeout(() => router.replace({ name: "MainPage" }), 4000);
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeout);
    next();
  },
};
</script>