<template>
  <div v-if="!cp_loading">
    <a
      @click="open = !open"
      id="tomodify"
      style="right: 0; padding-right: 2em; position: absolute"
    >
      <button v-if="!open" class="button is-link is-light">
        Add custom response
      </button>
      <button v-else class="button is-link is-light">Close</button>
    </a>
    <h1 class="title">Custom responses</h1>
    <div v-if="open" class="box">
      <form @submit.prevent="addResponse" id="cpform">
        <div class="field cp-field">
          <div class="control">
            <input
              id="match"
              name="match"
              class="input is-medium"
              type="text"
              placeholder="Match"
              required
              v-model="form.match"
            />
          </div>
        </div>
        <div class="field cp-field">
          <div class="control">
            <textarea
              class="textarea is-large"
              id="response"
              name="response"
              type="text"
              placeholder="Response"
              required
              v-model="form.response"
            ></textarea>
          </div>
        </div>
        <div class="field cp-field">
          <div class="control">
            <input
              id="link"
              name="link"
              class="input is-medium"
              type="url"
              placeholder="File link"
              v-model="form.link"
            />
          </div>
        </div>
        <span v-if="sended" class="form-span">{{ actualState }}</span>
        <input
          v-if="!sended"
          class="button"
          style="display: inline"
          type="submit"
          value="Add"
        />
      </form>
    </div>
    <br />
    <div id="boxes">
      <div v-for="(resp, id) in responses" :key="id" class="box">
        <article class="media">
          <div class="media-content">
            <div class="content">
              <strong>{{ resp.match }} </strong>
              <a v-if="resp.link" :href="resp.link"
                ><b><small>File link</small></b>
              </a>
              <br />
              <p>{{ resp.response }}</p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item" aria-label="delete">
                  <a
                    @click="deleteResponse(id)"
                    v-if="!sended"
                    class="button is-danger is-light"
                    >Delete</a
                  >
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </div>
  </div>
  <h1 class="title" v-else-if="failed">Something happened!</h1>
  <h1 class="title" v-else-if="cp_loading">Loading...</h1>
</template>

<style>
.myClass {
  padding: 2em;
  border-radius: 2em;
  background-color: #dfe093;
}
</style>

<script>
export default {
  data: function () {
    return {
      guildID: this.$route.params.guildID,
      cp_loading: true,
      failed: false,
      sended: false,
      actualState: "Please wait...",
      open: false,
      form: {
        match: "",
        response: "",
        link: "",
      },
      responses: [],
    };
  },
  created: function () {
    this.getResponses();
  },
  methods: {
    getResponses() {
      this.axios
        .get(`/api/guilds/${this.guildID}/cp`)
        .then((e) => {
          for (const resp of Object.entries(e.data.data.responses)) {
            this.responses.push({
              match: resp[0],
              response: resp[1].content,
              link: resp[1].files[0],
            });
          }
          this.cp_loading = false;
        })
        .catch(() => {
          this.failed = true;
        });
    },
    addResponse() {
      this.actualState = "Please wait...";
      this.sended = true;
      this.axios
        .post(`/api/guilds/${this.guildID}/cp`, this.form)
        .then(() => {
          this.responses.push({
            match: this.form.match,
            response: this.form.response,
            link: this.form.link,
          });
          this.open = false;
          this.sended = false;
          this.form.match = "";
          this.form.response = "";
          this.form.link = "";
        })
        .catch(() => {
          this.actualState = "Something happened!";
        });
    },
    deleteResponse(id) {
      this.sended = true;
      this.axios
        .delete(`/api/guilds/${this.guildID}/cp`, {
          data: { id },
        })
        .then(() => {
          this.responses.splice(id, 1);
          this.sended = false;
        });
    },
  },
};
</script>