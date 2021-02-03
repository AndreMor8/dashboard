<template>
  <div>
    <div style="display: none" :content="csrfToken" id="_csrf" />
    <router-link
      v-if="logged"
      :to="{ name: 'FeedbackPage' }"
      style="right: 0; padding-right: 1em; position: absolute"
    >
      <button class="button is-info is-light">Add new comment</button>
    </router-link>
    <h1
      v-if="comments_loading"
      class="title"
      style="text-align: center; margin-bottom: 15px"
    >
      Loading...
    </h1>
    <h1 v-else class="title" style="text-align: center; margin-bottom: 15px">
      Pending comments for Gidget
    </h1>
    <br />
    <div style="margin-left: 10px; margin-right: 10px">
      <div v-for="c in comments" :key="c._id">
        <comment :comment="c" :admin="admin"></comment>
      </div>
      <h2 class="subtitle" v-if="comments.length < 1 && !comments_loading">
        No pending comments. Create one :)
      </h2>
    </div>
  </div>
</template>

<script>
import comment from "../partials/comment.vue";
export default {
  components: { comment },
  data: function () {
    return {
      logged: this.$root.logged,
      comments_loading: true,
      admin: false,
      comments: [],
    };
  },
  created: function () {
    this.logged = this.$root.logged;
    this.getComments();
  },
  methods: {
    getComments() {
      this.axios.get("/api/pending-comments").then((res) => {
        this.comments = res.data.comments;
        this.admin = res.data.admin;
        this.comments_loading = false;
      });
    },
  },
};
</script>