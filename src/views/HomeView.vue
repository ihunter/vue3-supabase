<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";
import TweetItem from "@/components/TweetItem.vue";
import CreateTweet from "@/components/CreateTweet.vue";

const router = useRouter();

const authStore = useAuthStore();

const tweets = ref([]);
const likedTweets = ref([]);

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
  console.log("liked", id);
  const tweet = tweets.value.find((tweet) => tweet.id === id);
  tweet.liked = true;
  tweet.likes++;
}

function unlikeTweet(id) {
  console.log("unliked", id);
  const tweet = tweets.value.find((tweet) => tweet.id === id);
  tweet.liked = false;
  tweet.likes--;
}

async function logout() {
  try {
    await supabase.auth.signOut();

    router.push({ name: "login" });
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <div class="container">
    <nav>
      <a>
        <div>Home</div>
      </a>
      <a>
        <div>Explore</div>
      </a>
      <a>
        <div>Notifications</div>
      </a>
      <a>
        <div>Profile</div>
      </a>
      <a @click="logout">
        <div>Logout</div>
      </a>
    </nav>

    <main class="feed">
      <CreateTweet />
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
      <TweetItem v-for="i in 20" :key="i" :id="i" />
    </main>

    <aside>
      <h1>{{ authStore.username }}</h1>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  max-width: 1200px;
  margin: auto;

  nav {
    height: 100vh;
    position: sticky;
    top: 0;

    a {
      display: block;
      cursor: pointer;

      &:hover {
        div {
          background: #333;
        }
      }

      div {
        display: inline-block;
        padding: 1rem;
        margin: 0.5rem;
        padding: 1rem 1.5rem;
        cursor: pointer;
        border-radius: 30px;
        transition: background-color 200ms linear;
      }
    }
  }

  main {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }

  aside {
    height: 100vh;
    position: sticky;
    top: 0;

    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
