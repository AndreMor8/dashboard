<template>
  <router-link :to="{ name: 'DashboardPage', params: { guildID: id } }">
    <div :class="'box ' + (bot ? '' : 'bot-no-guild')">
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
                <br><span v-if="!bot">Click to invite Gidget to this server</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </router-link>
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