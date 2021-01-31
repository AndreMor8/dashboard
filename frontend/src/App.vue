<template>
  <div>
    <myNavbar :logged="logged" :user="user" />
    <router-view id="postbody" />
    <myFooter />
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.8.1/css/bulma.min.css';
@import 'https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css';
#postbody {
  margin: 1rem;
  text-align: center;
}

</style>

<script>
import myNavbar from "./partials/nav.vue";
import myFooter from "./partials/footer.vue";

export default {
  data() {
    return {
      logged: false,
      user: {
        id: "",
        username: "",
        avatar: "",
      },
      csrfToken: "",
    };
  },
  created: function () {
    this.getLogin();
  },
  methods: {
    getLogin: function () {
      return this.axios.get("/api/user").then((res) => {
        if (res.data.loggedAs) {
          this.user.id = res.data.loggedAs.userID;
          this.user.username = res.data.loggedAs.username;
          this.user.avatar = res.data.loggedAs.avatar;
          this.logged = true;
          this.csrfToken = res.data.csrfToken;
          this.$children[1].logged = true;
        }
      });
    },
  },
  components: { myNavbar, myFooter },
};
</script>