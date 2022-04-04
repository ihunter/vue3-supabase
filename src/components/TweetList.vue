<script setup>
import TweetItem from "@/components/TweetItem.vue";

defineProps({
  tweets: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <font-awesome-icon
    v-if="loading"
    :icon="['fas', 'spinner']"
    pulse
    size="3x"
    style="margin: 1rem"
  />
  <TweetItem
    v-else
    v-for="tweet in tweets"
    :key="tweet.id"
    :id="tweet.id"
    :username="tweet.profiles.username"
    :content="tweet.content"
    :likes="tweet.likes"
    :liked="tweet.liked"
    :created="tweet.created_at"
  />
  <!-- <TweetItem v-for="i in 20" :key="i" :id="i" /> -->
</template>

<style lang="scss" scoped></style>
