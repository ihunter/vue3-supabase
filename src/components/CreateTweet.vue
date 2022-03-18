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
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
  console.log("Submit tweet");
}
</script>

<template>
  <div>
    <form @submit.prevent="submitTweet">
      <textarea
        v-model="tweet"
        placeholder="What's on your mind?"
        class="tweet-field"
      />

      <button type="submit" class="tweet-button">send tweet</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.tweet-field {
  font-size: 1.5rem;
  padding: 1rem;
  height: 200px;
  width: 100%;
  resize: none;
}

.tweet-button {
  width: 100%;
  height: 50px;
}
</style>
