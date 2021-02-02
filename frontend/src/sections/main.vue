<template>
  <div>
    <h1 class="title">Welcome to Gidget's website</h1>
    <a href="https://top.gg/bot/694306281736896573" target="_blank" rel="noreferrer">
      <img width="300" height="150" src="https://top.gg/api/widget/694306281736896573.svg" alt="topgg" />
    </a>
    <br /><br />
    <div v-if="logged" class="my-button">
      <router-link :to="{ name: 'Guilds' }">
        <button
          class="button is-primary is-rounded is-large"
          style="width: 350px"
        >
          Go to the dashboard
        </button>
      </router-link>
    </div>
    <br />
    <div v-if="logged" class="my-button">
      <form action="/api/auth/logout">
        <button
          class="button is-primary is-rounded is-large"
          style="width: 350px"
          type="submit"
        >
          Logout
        </button>
      </form>
    </div>
    <div v-else class="my-button">
      <form action="/api/auth">
        <button
          class="button is-primary is-rounded is-large"
          style="width: 350px"
          type="submit"
        >
          Login with Discord
        </button>
      </form>
    </div>
  </div>
</template>

<style>
.my-button {
  top: 50%;
  left: 50%;
}
</style>

<script>
export default {
  data: function () {
    return {
      logged: this.$root.logged,
    };
  },
  created: function() {
      this.logged = this.$root.logged;
  }
};
</script>