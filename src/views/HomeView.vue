<script setup>
import { ref, onMounted } from "vue";
import { useTweetStore } from "../stores/tweets";
import CreateTweet from "@/components/CreateTweet.vue";
import TweetList from "@/components/TweetList.vue";

const tweetStore = useTweetStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await Promise.allSettled([
    tweetStore.getTweets(),
    tweetStore.getUserLikedTweets(),
  ]);
  loading.value = false;
});
</script>

<template>
  <CreateTweet @tweet-created="tweetStore.getTweetById" />
  <TweetList :tweets="tweetStore.allTweets" :loading="loading" />
</template>

<style lang="scss" scoped></style>
