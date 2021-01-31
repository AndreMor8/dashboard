<template>
    <div :class="'box ' + (comment.type == 2 ? 'report' : 'suggestion')">
        <article class="media" style="text-align: left">
          <div v-if="comment.user" class="media-left">
            <figure class="image is-64x64">
              <img id="avatar" :src="comment.user.avatar" alt="Image" />
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <strong v-if="!comment.user">Anonymous</strong>
              <strong v-else>{{ comment.user.username }}</strong>
              <br />
              <p>{{ comment.text }}</p>
              <strong>ID: </strong>{{ comment._id }}
            </div>

            <nav v-if="admin" class="level is-mobile">
              <div class="level-left">
                <router-link :to="{ name: 'CommentDelete', params: { id: comment._id } }" class="level-item button"
                  aria-label="approve">Delete</router-link>
              </div>
            </nav>
          </div>
        </article>
    </div>
</template>

<style>
.suggestion {
  background-color: rgba(11, 102, 52, 0.685);
  border-style: groove;
  border-color: mediumblue;
}
.report {
  background-color: rgba(88, 15, 15, 0.562);
  border-style: groove;
  border-color: lightsalmon;
}
.box {
    margin-bottom: 6px;
}
</style>

<script>
export default {
    props: ['comment', 'admin']
}
</script>