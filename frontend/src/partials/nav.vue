<template>
  <nav
    class="navbar is-black is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <div class="navbar-item">
        <router-link :to="{ name: 'MainPage' }"
          ><img src="/avatar.jpg" width="26.25" height="26.25" alt="logo"
        /></router-link>
      </div>
      <a
        role="button"
        class="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Bot service </a>
          <div class="navbar-dropdown">
            <router-link
              v-if="logged"
              :to="{ name: 'Guilds' }"
              class="navbar-item"
            >
              Dashboard
            </router-link>
            <router-link
              v-if="logged"
              :to="{ name: 'FeedbackPage' }"
              class="navbar-item"
            >
              Feedback
            </router-link>
            <router-link :to="{ name: 'StatsPage' }" class="navbar-item">
              Dashboard stats
            </router-link>
            <router-link :to="{ name: 'PendingComments' }" class="navbar-item">
              Pending comments
            </router-link>
            <hr class="navbar-divider" />
            <router-link :to="{ name: 'ThanksPage' }" class="navbar-item">
              Acknowledgments
            </router-link>
            <a
              href="https://top.gg/bot/694306281736896573"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              top.gg page
            </a>
            <a
              href="https://portalmybot.com/mybotlist/bot/694306281736896573"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              MyBOT List page
            </a>
            <a
              href="https://discord.ly/gidget"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              DiscordBotList page
            </a>
            <a
              href="https://discord.boats/bot/694306281736896573"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              Discord Boats page
            </a>
          </div>
        </div>
        <a href="https://docs.gidget.xyz/" class="navbar-item" rel="noreferrer">
          Documentation
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Repositories </a>
          <div class="navbar-dropdown">
            <a
              href="https://github.com/AndreMor955/gidget"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              Discord bot
            </a>
            <a
              href="https://github.com/AndreMor955/dashboard"
              class="navbar-item"
              target="_blank" rel="noreferrer"
            >
              This dashboard
            </a>
          </div>
        </div>
        <a href="https://wubb.ga" class="navbar-item"> Wow Wow Discord </a>
      </div>
      <div class="navbar-end">
        <div v-if="logged" class="navbar-item">
          <h1>Welcome, {{ user.username }}</h1>
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <form v-if="logged" action="/api/auth/logout">
              <button
                class="button is-primary is-rounded"
                style="font-size: 0.95em"
                type="submit"
              >
                Logout
              </button>
            </form>
            <form v-else action="/api/auth/">
              <button
                class="button is-primary is-rounded"
                style="font-size: 0.95em"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.navbar {
  font-size: 0.95em;
}
</style>

<script>
/* <router-link :to="{ name: 'DisplayItem' }" class="btn btn-success">Return to Items</router-link> */
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});
export default {
  props: ['user', 'logged']
};
</script>