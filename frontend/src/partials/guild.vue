<template>
  <router-link
    v-if="bot"
    :to="{ name: 'DashboardPage', params: { guildID: id } }"
  >
    <div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img
              v-if="icon"
              :src="
                'https://cdn.discordapp.com/icons/' + id + '/' + icon + '.png'
              "
              alt="Image"
            />

            <img
              v-else
              src="https://glitch.com/edit/images/logos/glitch/logo-day.svg"
              alt="Image"
            />
          </figure>
        </div>
        <div class="media-content">
          <div class="columns is-gapless">
            <div class="content column">
              <p>
                <strong>{{ name }}</strong
                ><br /><small>{{ id }}</small>
                <br />
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </router-link>
  <a
    v-else
    :href="`https://discord.com/oauth2/authorize?client_id=694306281736896573&permissions=0&redirect_uri=https%3A%2F%2Fgidget.andremor.dev%2Fapi%2Fauth&scope=applications.commands%20bot&guild_id=${id}&disable_guild_select=true`"
  >
    <div class="box bot-no-guild">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img
              v-if="icon"
              :src="
                'https://cdn.discordapp.com/icons/' + id + '/' + icon + '.png'
              "
              alt="Image"
            />

            <img
              v-else
              src="https://glitch.com/edit/images/logos/glitch/logo-day.svg"
              alt="Image"
            />
          </figure>
        </div>
        <div class="media-content">
          <div class="columns is-gapless">
            <div class="content column">
              <p>
                <strong>{{ name }}</strong
                ><br /><small>{{ id }}</small> <br /><span
                  >Click to invite Gidget to this server</span
                >
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </a>
</template>

<style>
.bot-no-guild {
  border-color: red;
  border-radius: inherit;
  border-style: dotted;
}
</style>

<script>
export default {
  props: ["icon", "name", "id", "bot"],
};
</script>