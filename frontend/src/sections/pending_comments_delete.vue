<template>
  <h1 class="title" v-if="!admin && !deleteComments_loading">
    You need to be a Gidget developer to access this route
  </h1>
  <div v-else-if="!deleteComments_loading">
    <form @submit.prevent="toSend">
      <div class="control">
        <label class="radio">
          <input type="radio" name="approve" value="true" v-model="approve" />
          Approve
        </label>
        <label class="radio">
          <input type="radio" name="approve" value="false" v-model="approve" />
          Reject
        </label>
      </div>
      <br />
      <textarea
        v-if="approve == 'true'"
        class="textarea"
        placeholder="Reason"
        required
        v-model="reason"
      />
      <textarea v-else class="textarea" placeholder="Reason" v-model="reason" />
      <br />
      <input type="submit" value="Send" class="button" />
    </form>
  </div>
  <h1 class="title" v-else-if="deleteComments_failed">Document ID not found</h1>
  <h1 class="title" v-else-if="deleteComments_loading">Loading...</h1>
</template>

<style>
</style>

<script>
export default {
  data: function () {
    return {
      admin: false,
      approve: "false",
      reason: "",
      deleteComments_loading: true,
      deleteComments_failed: false,
    };
  },
  created: function () {
    this.checkComment();
  },
  methods: {
    checkComment() {
      this.axios.get("/api/pending-comments").then((res) => {
        this.admin = res.data.admin;
        if (res.data.comments.find((e) => e._id === this.$route.params.id)) {
          this.deleteComments_loading = false;
        } else {
          this.deleteComments_failed = true;
          this.deleteComments_loading = false;
        }
      });
    },
    toSend() {
      const real = {
        message: this.reason,
        d: this.approve == "true" ? true : false,
        id: this.$route.params.id,
      };
      this.axios
        .delete("/api/pending-comments", {
          data: real,
        })
        .then((res) => {
          if (res.status != 200) {
            alert("Error: " + res.data);
          }
          this.$router.push({ name: "PendingComments" });
        })
        .catch((err) => {
          alert("Error: " + err.toString());
          this.$router.push({ name: "PendingComments" });
        });
    },
  },
};
</script>