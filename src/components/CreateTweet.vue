<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

const authStore = useAuthStore();
const tweet = ref("");

async function submitTweet() {
  try {
    const { data, error } = await supabase.from("tweets").insert([
      {
        user_id: authStore.user.id,
        content: tweet.value,
      },
    ]);

    tweet.value = "";

    console.log(data);

    if (error) throw error;
  } catch (error) {
    console.error(error.message);
  }
  console.log("Submit tweet");
}

function resizeTextboxHeight(e) {
  e.target.style.height = "";
  e.target.style.height = e.target.scrollHeight + "px";
}
</script>

<template>
  <div>
    <form @submit.prevent="submitTweet" class="tweet-form-container">
      <div class="tweet-textarea-container">
        <textarea
          v-model="tweet"
          maxlength="280"
          placeholder="What's on your mind?"
          class="tweet-textarea"
          @input="resizeTextboxHeight"
        />
      </div>

      <div class="tweet-submit-button-container">
        <button
          :disabled="tweet.length === 0"
          type="submit"
          class="tweet-submit-button"
        >
          Tweet
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.tweet-form-container {
  border: 1px solid var(--border-color);

  .tweet-textarea-container {
    .tweet-textarea {
      color: var(--color-text);
      background-color: transparent;
      font-size: 1.5rem;
      padding: 1rem;
      overflow: hidden;
      width: 100%;
      resize: none;
      border: 0;
      outline: none;

      &::placeholder {
        color: var(--color-text-soft);
      }
    }
  }

  .tweet-submit-button-container {
    display: flex;
    justify-content: flex-end;
    .tweet-submit-button {
      cursor: pointer;
      padding: 0 1.1rem;
      margin: 1rem;
      margin-top: 0;
      min-height: 36px;
      color: var(--color-text);
      font-size: 1rem;
      font-weight: bold;
      border: 0;
      border-radius: 20px;
      background-color: var(--primary);
      transition: background-color 200ms;

      &:hover {
        background-color: var(--primary-hover);
      }
    }
  }
}
</style>
