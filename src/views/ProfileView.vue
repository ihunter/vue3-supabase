<script setup>
import { ref, onMounted } from "vue";
import { useTweetStore } from "../stores/tweets";
import ProfileHeader from "@/components/ProfileHeader.vue";
import TweetList from "@/components/TweetList.vue";

const props = defineProps(["username"]);

const tweetStore = useTweetStore();

const loadingTweets = ref(false);

onMounted(async () => {
  await tweetStore.getProfileTweets(props.username);
});
</script>

<template>
  <div>
    <ProfileHeader :username="props.username" />
    <TweetList :tweets="tweetStore.profileTweets" :loading="loadingTweets" />
  </div>
</template>

<style lang="scss" scoped></style>
