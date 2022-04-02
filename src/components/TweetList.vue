<script setup>
import TweetItem from "@/components/TweetItem.vue";

defineProps({
  tweets: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <TweetItem
    v-for="tweet in tweets"
    :key="tweet.id"
    :id="tweet.id"
    :username="tweet.profiles.username"
    :content="tweet.content"
    :likes="tweet.likes"
    :liked="tweet.liked"
  />
  <!-- <TweetItem v-for="i in 20" :key="i" :id="i" /> -->
</template>

<style lang="scss" scoped></style>
