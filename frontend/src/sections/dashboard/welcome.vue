<template>
  <div v-if="!welcome_loading">
    <h1 class="title">Welcome system</h1>
    <form @submit.prevent="setWelcome" id="welcomeform">
      <h2 class="subtitle">Welcome message</h2>
      <div class="control">
        <label for="WM-E" class="radio">
          <input
            id="WM-E"
            type="radio"
            name="system"
            value="true"
            v-model="enabled"
          />
          Enabled
        </label>
        <label for="WM-D" class="radio">
          <input
            id="WM-D"
            type="radio"
            name="system"
            value="false"
            v-model="enabled"
          />
          Disabled
        </label>
      </div>
      <br />
      <h2 class="subtitle">Welcome text</h2>
      <textarea
        class="textarea"
        type="text"
        name="welcometext"
        required
        v-model="text"
      ></textarea>
      <br />
      <br />
      <div class="flex_thing">
        <label class="subtitle inline_thing wel_sub" for="welcomechannel"
          >Welcome channel</label
        >
        <div class="select inline_thing">
          <select
            id="welcomechannel"
            name="welcomechannel"
            v-model="channelID"
            required
          >
            <option
              v-for="channel in textChannels"
              :key="channel.id"
              :value="channel.id"
            >
              {{ channel.name }}
            </option>
          </select>
        </div>
      </div>
      <br />
      <br />
      <h2 class="subtitle">DM welcome message</h2>

      <div class="control">
        <label for="DM-E" class="radio">
          <input
            id="DM-E"
            type="radio"
            name="dmsystem"
            value="true"
            v-model="dmenabled"
          />
          Enabled
        </label>
        <label for="DM-D" class="radio">
          <input
            id="DM-D"
            type="radio"
            name="dmsystem"
            value="false"
            v-model="dmenabled"
          />
          Disabled
        </label>
      </div>
      <br />
      <h2 class="subtitle">DM welcome text</h2>
      <textarea
        class="textarea"
        type="text"
        name="dmtext"
        required
        v-model="dmtext"
      ></textarea>
      <br />
      <br />
      <h2 class="subtitle">Goodbye message</h2>

      <div class="control">
        <label for="LM-E" class="radio">
          <input
            id="LM-E"
            type="radio"
            name="leavesystem"
            value="true"
            v-model="leaveenabled"
          />
          Enabled
        </label>
        <label for="LM-D" class="radio">
          <input
            id="LM-D"
            type="radio"
            name="leavesystem"
            value="false"
            v-model="leaveenabled"
          />
          Disabled
        </label>
      </div>
      <br />
      <h2 class="subtitle">Goodbye text</h2>
      <textarea
        class="textarea"
        type="text"
        name="leavetext"
        required
        v-model="leavetext"
      ></textarea>
      <br /><br />
      <div class="flex_thing">
        <label class="subtitle inline_thing wel_sub" for="leavechannel"
          >Goodbye channel</label
        >
        <div class="select inline_thing">
          <select
            id="leavechannel"
            name="leavechannel"
            v-model="leavechannelID"
            required
          >
            <option
              v-for="channel in textChannels"
              :key="channel.id"
              :value="channel.id"
            >
              {{ channel.name }}
            </option>
          </select>
        </div>
      </div>
      <br />
      <br />
      <span v-if="sended" class="form-span">{{ actualState }}</span>
      <br />
      <button v-if="!sended" type="submit" class="button">Save</button>
    </form>
  </div>
  <h1 class="title" v-else-if="failed">Something happened!</h1>
  <h1 class="title" v-else-if="welcome_loading">Loading...</h1>
</template>

<style>
.flex_thing {
  display: flex;
  justify-content: space-between;
}
.inline_thing {
  display: inline-block;
}
.wel_sub {
  margin-top: 0.5rem;
}
</style>

<script>
export default {
  data: function () {
    return {
      guildID: this.$route.params.guildID,
      welcome_loading: true,
      failed: false,
      sended: false,
      actualState: "Please wait...",
      enabled: "false",
      text: "",
      channelID: "",
      dmenabled: "false",
      dmtext: "",
      leaveenabled: "false",
      leavetext: "",
      leavechannelID: "",
      textChannels: [],
    };
  },
  created: function () {
    this.getWelcome();
  },
  methods: {
    getWelcome() {
      this.axios
        .get(`/api/guilds/${this.guildID}/welcome`)
        .then((res) => {
          this.enabled = res.data.data.document.enabled.toString();
          this.text = res.data.data.document.text;
          this.channelID = res.data.data.document.channelID || "";
          this.dmenabled = res.data.data.document.dmenabled.toString();
          this.dmtext = res.data.data.document.dmtext;
          this.leaveenabled = res.data.data.document.leaveenabled.toString();
          this.leavetext = res.data.data.document.leavetext;
          this.leavechannelID = res.data.data.document.leavechannelID || "";
          this.textChannels = res.data.data.textChannels;
          this.welcome_loading = false;
        })
        .catch(() => {
          this.failed = true;
        });
    },
    setWelcome() {
      this.actualState = "Please wait...";
      const tosend = {
        enabled: this.enabled === "true" ? true : false,
        text: this.text,
        channelID: this.channelID,
        dmenabled: this.dmenabled === "true" ? true : false,
        dmtext: this.dmtext,
        leaveenabled: this.leaveenabled === "true" ? true : false,
        leavetext: this.leavetext,
        leavechannelID: this.leavechannelID,
      };
      this.sended = true;
      this.axios
        .put(`/api/guilds/${this.guildID}/welcome`, tosend)
        .then(() => {
          this.actualState = "Changes successfully saved!";
        })
        .catch(() => {
          this.actualState = "Something happened!";
        });
    },
  },
};
</script>