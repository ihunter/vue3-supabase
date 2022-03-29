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
    <div class="footer">
      <button class="likes" :class="{ liked: liked }" @click="handleLike">
        {{ likes }} Likes
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .tweet {
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;

    &:first-of-type {
      border-top: 0;
    }

    &:last-of-type {
      border-bottom: 0;
    }

    .likes {
      padding: 3px;
    }

    .liked {
      color: white;
      background: blue;
    }
  }
}
</style>
