<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useAuthStore } from "../stores/auth";
import { useTweetStore } from "../stores/tweets";

import ProfileSnippit from "@/components/ProfileSnippit.vue";

const authStore = useAuthStore();
const tweetStore = useTweetStore();

const loadingProfiles = ref(false);
const profiles = ref([]);

async function getProfiles() {
  try {
    loadingProfiles.value = true;

    await tweetStore.getFollowing();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .not("user_id", "in", `(${tweetStore.followingIds})`);

    if (error) throw error;

    profiles.value = data;
  } catch (error) {
    console.error(error.message);
  } finally {
    loadingProfiles.value = false;
  }
}

onMounted(() => {
  getProfiles();
});
</script>

<template>
  <div v-for="profile in profiles" :key="profile.user_id">
    <ProfileSnippit :profile="profile" />
  </div>
</template>

<style lang="scss" scoped></style>
