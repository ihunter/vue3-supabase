<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useTweetStore } from "../stores/tweets";
import { supabase } from "@/supabase";

const tweetStore = useTweetStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    default: "TestUser",
  },
  content: {
    type: String,
    default: "Placeholder content",
  },
  liked: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const authStore = useAuthStore();

async function handleLike() {
  try {
    if (props.liked) {
      await unlikeTweet();
      const index = tweetStore.userLikedTweets.indexOf(props.id);

      if (index !== -1) {
        tweetStore.userLikedTweets.splice(index, 1);
      }
    } else {
      await likeTweet();
      tweetStore.userLikedTweets.push(props.id);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function likeTweet() {
  try {
    const { error } = await supabase
      .from("liked_tweets")
      .insert([{ user_id: authStore.user.id, tweet_id: props.id }]);

    if (error) throw error;
  } catch (error) {
    console.error(error.message);
  }
}

async function unlikeTweet() {
  try {
    const { error } = await supabase
      .from("liked_tweets")
      .delete()
      .match({ user_id: authStore.user.id, tweet_id: props.id });

    if (error) throw error;
  } catch (error) {
    console.error(error.message);
  }
}

const likeIcon = computed(() => {
  return props.liked ? ["fas", "heart"] : ["far", "heart"];
});
</script>

<template>
  <div class="tweet">
    <RouterLink :to="{ name: 'profile', params: { username } }">
      <div class="username">
        {{ username }}
      </div>
    </RouterLink>
    <div class="tweet-content">
      {{ content }}
    </div>
    <div class="tweet-footer">
      <button class="like-button" :class="{ liked: liked }" @click="handleLike">
        <font-awesome-icon :icon="likeIcon" size="lg" />
        <span class="like-count">{{ likes }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet {
  padding: 1rem;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-color);

  .username {
    font-weight: bold;
  }

  .tweet-footer {
    display: flex;
    justify-content: flex-end;

    .like-button {
      cursor: pointer;
      color: var(--color-text);
      border: 0;
      padding: 8px;
      background-color: transparent;

      &:hover {
        color: var(--like-color-liked);
        background-color: grey;
        border-radius: 15px;
      }

      .like-count {
        margin-left: 8px;
      }
    }

    .liked {
      color: var(--like-color-liked);
    }
  }
}
</style>
