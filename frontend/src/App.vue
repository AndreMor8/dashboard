<template>
  <div>
    <myNavbar :logged="logged" :user="user" />
    <router-view id="postbody" />
    <myFooter />
  </div>
</template>

<style>
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
          this.$children[1].logged = true;
        }
      });
    },
  },
  components: { myNavbar, myFooter },
};
</script>