<script setup>
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

const props = defineProps({
  id: Number,
  username: String,
  content: String,
  liked: Boolean,
  likes: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["liked", "unliked"]);

const authStore = useAuthStore();

async function handleLike() {
  try {
    if (props.liked) {
      await unlikeTweet();
      emit("unliked", props.id);
    } else {
      await likeTweet();
      emit("liked", props.id);
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
</script>

<template>
  <div class="tweet">
    <div class="username">{{ username }}</div>
    <div class="tweet-content">
      {{ content }}
    </div>
    <div class="tweet-footer">
      <button class="like-button" :class="{ liked: liked }" @click="handleLike">
        <font-awesome-icon icon="heart" size="lg" v-if="liked" />
        <font-awesome-icon :icon="['far', 'heart']" size="lg" v-else />
        <span class="like-count">{{ likes }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet {
  padding: 1rem;
  padding-bottom: 5px;
  border: 1px solid var(--border-color);

  &:first-of-type {
    border-top: 0;
  }

  &:last-of-type {
    border-bottom: 0;
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
