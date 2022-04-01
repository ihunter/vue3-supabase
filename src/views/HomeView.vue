<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";
import TweetItem from "@/components/TweetItem.vue";
import CreateTweet from "@/components/CreateTweet.vue";

const authStore = useAuthStore();

const tweets = ref([]);
const likedTweets = ref([]);

async function getTweetById(id) {
  try {
    const { data, error } = await supabase
      .from("tweets")
      .select("*, profiles( * )")
      .eq("id", id)
      .single();

    if (error) throw error;

    tweets.value.unshift(data);
  } catch (error) {
    console.error(error);
  }
}

async function getTweets() {
  try {
    const { data, error } = await supabase
      .from("tweets")
      .select("*, profiles( * )")
      .order("created_at", { ascending: false });

    if (error) throw error;

    tweets.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function getLikedTweets() {
  try {
    const { data, error } = await supabase
      .from("liked_tweets")
      .select("tweet_id")
      .eq("user_id", authStore.user.id);

    if (error) throw error;

    likedTweets.value = data.map((t) => t.tweet_id);
  } catch (error) {
    console.error(error.message);
  }
}

const modifiedTweets = computed(() => {
  return tweets.value.map((tweet) => {
    tweet.liked = likedTweets.value.includes(tweet.id);
    return tweet;
  });
});

onMounted(async () => {
  Promise.allSettled([getTweets(), getLikedTweets()]);
});

function likeTweet(id) {
  const tweet = tweets.value.find((tweet) => tweet.id === id);
  tweet.liked = true;
  tweet.likes++;
}

function unlikeTweet(id) {
  const tweet = tweets.value.find((tweet) => tweet.id === id);
  tweet.liked = false;
  tweet.likes--;
}
</script>

<template>
  <CreateTweet @tweet-created="getTweetById" />
  <TweetItem
    v-for="tweet in modifiedTweets"
    :key="tweet.id"
    :id="tweet.id"
    :username="tweet.profiles.username"
    :content="tweet.content"
    :likes="tweet.likes"
    :liked="tweet.liked"
    @liked="likeTweet"
    @unliked="unlikeTweet"
  />
  <!-- <TweetItem v-for="i in 20" :key="i" :id="i" /> -->
</template>

<style lang="scss" scoped></style>
