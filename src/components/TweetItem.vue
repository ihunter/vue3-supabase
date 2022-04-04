<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useTweetStore } from "../stores/tweets";
import { supabase } from "@/supabase";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

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
  created: {
    type: String,
    default: "2022-04-04T02:50:37.202249+00:00",
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

const createdDate = computed(() => {
  return formatDistanceToNowStrict(parseISO(props.created), {
    addSuffix: true,
  });
});
</script>

<template>
  <div class="tweet">
    <div class="tweet-profile">
      <div class="tweet-profile-avatar"></div>
    </div>
    <div class="tweet-info">
      <RouterLink :to="{ name: 'profile', params: { username } }">
        <span class="username">
          {{ username }}
        </span>
      </RouterLink>
      <span class="created">
        {{ createdDate }}
      </span>
    </div>
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
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "profile info"
    "profile content"
    "profile footer";

  padding: 1rem;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-color);

  a:hover {
    text-decoration: underline;
  }

  .tweet-profile {
    grid-area: profile;
    padding-right: 1rem;

    .tweet-profile-avatar {
      width: 50px;
      height: 50px;
      background-color: aqua;
      border-radius: 50%;
    }
  }

  .tweet-info {
    grid-area: info;

    .username {
      font-weight: bold;
    }

    .created {
      color: var(--color-text-soft);
      margin-left: 0.5rem;
    }
  }

  .tweet-content {
    grid-area: content;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }

  .tweet-footer {
    grid-area: footer;
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
        background-color: rgba(249, 24, 128, 0.1);
        border-radius: 15px;
      }

      &:active {
        background-color: rgba(249, 24, 128, 0.2);
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
