<template>
  <div v-if="logged">
    <router-link
      :to="{ name: 'PendingComments' }"
      style="right: 0; padding-right: 1em; position: absolute"
    >
      <button class="button is-success is-light">Pending comments</button>
    </router-link>
    <h1 class="title" style="text-align: center; margin-bottom: 15px">
      What do you want for the bot?
    </h1>
    <h2 class="subtitle" style="margin-top: 10px; font-size: 0.8em">
      Do you know JavaScript and Discord.js?
      <a href="https://github.com/AndreMor8/gidget" target="_blank"
        >Contribute directly ;)</a
      >
    </h2>
    <form
      id="fbk"
      style="text-align: -webkit-center"
      @submit.prevent="sendFeedback"
    >
      <div class="select is-small">
        <p style="float: left; padding-top: 0.35em; padding-right: 1.6em">
          Select a comment type
        </p>
        <select
          name="feedbacktype"
          style="float: right"
          v-model="myComment.type"
        >
          <option value="0" selected>Suggestion</option>
          <option value="1">Normal comment</option>
          <option value="2">Bug/Report</option>
        </select>
      </div>
      <br />
      <div
        id="feedbacktext"
        class="field"
        style="margin-top: 20px; max-width: 30em"
      >
        <div class="control">
          <textarea
            class="textarea"
            name="feedbacktext"
            type="text"
            placeholder="Say your thoughts or complaints"
            required
            v-model="myComment.text"
          ></textarea>
        </div>
      </div>
      <label class="checkbox" style="padding: 5px; padding-bottom: 1em">
        <input
          type="checkbox"
          id="anon"
          name="anon"
          value=""
          v-model="myComment.anon"
        /><span style="padding: 2px"
          >Don't show me publicly (I'll still know who you are privately)</span
        >
      </label>
      <br />
      <span v-if="feedback_sended" class="form-span">{{
        feedback_actualState
      }}</span>
      <br />
      <input
        v-if="!feedback_sended"
        class="button"
        type="submit"
        value="Submit"
      />
    </form>
  </div>
  <h1 v-else class="title">You must be logged in before using this route...</h1>
</template>

<style>
.form-span {
  padding: 3px;
  margin-top: 10px;
  font-size: 20px;
  color: #000;
  background-color: aqua;
  max-width: 50em;
}
</style>

<script>
export default {
  data: function () {
    return {
      logged: this.$root.logged,
      feedback_sended: false,
      feedback_actualState: "Please wait...",
      myComment: {
        type: "0",
        text: "",
        anon: false,
      },
    };
  },
  created: function () {
    this.logged = this.$root.logged;
  },
  methods: {
    sendFeedback() {
      this.feedback_sended = true;
      this.axios.post("/api/feedback", this.myComment).then((res) => {
        if (res.status == 200) {
          this.feedback_actualState =
            "Your comment has been sent =D." +
            (this.myComment.type == "1"
              ? " Thanks.\n"
              : "\nKeep the DMs active with the bot to see if the developer answered you.\n");
        } else {
          this.feedback_actualState = "Something happened! " + res.data;
        }
      });
    },
  },
};
</script>