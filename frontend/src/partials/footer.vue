<template>
  <div>
    <footer v-if="showFooter" id="myfooter">
      <div style="float: left; padding: 0.8em; padding-left: 5em">
        <p>
          Gidget, a bot for Discord<br /><a
            href="https://wubbzy.fandom.com/wiki/Gidget"
            target="_blank" rel="noreferrer"
            >Based on a cartoon character</a
          ><br /><a
            href="https://discord.com/api/oauth2/authorize?client_id=694306281736896573&permissions=0&scope=bot%20applications.commands"
            target="_blank" rel="noreferrer"
            >Invite this bot!</a
          >
        </p>
      </div>
      <div style="float: right; padding: 0.8em; padding-right: 5em">
        <address>
          By: {{ andremor }}<br />Mail:
          <a href="mailto:andre@gidget.xyz">andre@gidget.xyz</a><br /><a
            href="https://discord.gg/KDy4gJ7"
            target="_blank" rel="noreferrer"
            >Support server (end user)</a
          >
        </address>
      </div>
    </footer>
    <a v-if="showFooter"><button 
        class="button is-small"
        style="float: right; position: fixed; right: 0; bottom: 0"
        @click="changeStatus">
        Close
      </button></a>
      <a v-else><button 
        class="button is-small"
        style="float: right; position: fixed; right: 0; bottom: 0"
        @click="changeStatus">
        Open
      </button></a>
  </div>
</template>

<style>
#myfooter {
  border-top-left-radius: 20%;
  border-top-right-radius: 20%
}
footer {
  position: fixed;
  float: inline-end;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #1f1f1f;
  color: white;
  text-align: center;
  font-size: 0.88em;
}
</style>

<script>
export default {
  data: function () {
    return {
      andremor: "...",
      showFooter: !localStorage.getItem("footer"),
    };
  },
  created: function () {
      this.getAndreMor();
  },
  methods: {
    getAndreMor() {
      this.axios.get("/api/andremor").then((e) => {
        if (e.status == 200) {
          this.andremor = e.data;
        }
      });
    },
    changeStatus() {
      const actual = localStorage.getItem("footer");
      if (actual) {
        localStorage.removeItem("footer");
        this.showFooter = true;
      } else {
        localStorage.setItem("footer", "ok");
        this.showFooter = false;
      }
    },
  },
};
</script>