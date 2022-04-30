<script setup>
import { computed } from "vue";
import { supabase } from "@/supabase";
import { useAuthStore } from "../stores/auth";
import { useTweetStore } from "../stores/tweets";

const props = defineProps({
  profile: Object,
});

const authStore = useAuthStore();
const tweetStore = useTweetStore();

const isUsersProfile = computed(() => {
  if (!authStore.isAuthenticated) return false;

  return authStore.user.id === props.profile.user_id;
});

async function followUser() {
  if (!authStore.isAuthenticated) return;

  try {
    const { error } = await supabase.from("follows").insert(
      [
        {
          follower_id: authStore.user.id,
          following_id: props.profile.user_id,
        },
      ],
      { returning: "minimal" }
    );

    if (error) throw error;

    tweetStore.followingIds.push(props.profile.user_id);
  } catch (error) {
    console.error(error.message);
  }
}

async function unfollowUser() {
  if (!authStore.isAuthenticated) return;

  try {
    const { error } = await supabase
      .from("follows")
      .delete({ returning: "minimal" })
      .match({
        follower_id: authStore.user.id,
        following_id: props.profile.user_id,
      });

    if (error) throw error;

    tweetStore.followingIds = tweetStore.followingIds.filter(
      (id) => id !== props.profile.user_id
    );
  } catch (error) {
    console.error(error.message);
  }
}

const isUserFollowing = computed(() => {
  return tweetStore.followingIds.includes(props.profile.user_id);
});
</script>

<template>
  <div class="profile">
    <div class="profile-avatar"></div>
    <div class="profile-actions" v-if="!isUsersProfile">
      <button v-if="isUserFollowing" @click="unfollowUser">Unfollow</button>
      <button v-else @click="followUser">Follow</button>
    </div>
    <div class="profile-name">
      {{ profile.username }}
    </div>
    <div class="profile-bio">
      <p v-if="profile.bio">{{ profile.bio }}</p>
      <p v-else>Bio... if there was one. :(</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile {
  padding: 1rem;
  display: grid;
  border-bottom: 1px solid var(--border-color);
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "avatar actions"
    "name name"
    "bio bio";
  .profile-avatar {
    grid-area: avatar;
    width: 125px;
    height: 125px;
    background-color: aqua;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

  .profile-actions {
    grid-area: actions;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
      padding: 0.5rem 1rem;
      font-weight: bold;
      background-color: transparent;
      border: 1px solid var(--primary);
      color: var(--color-text);
      border-radius: 9999px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary);
      }
    }
  }

  .profile-name {
    grid-area: name;
    font-weight: bold;
  }

  .profile-bio {
    grid-area: bio;
  }
}
</style>
