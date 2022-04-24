<script setup>
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useTweetStore } from "../stores/tweets";
import { supabase } from "@/supabase";

const props = defineProps(["username"]);

const authStore = useAuthStore();
const tweetStore = useTweetStore();

const loading = ref(false);
const profile = ref({});

// Profile
async function getProfile() {
  try {
    loading.value = true;

    const { data, error, status } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", props.username)
      .single();

    if (error && status !== 406) throw error;

    profile.value = data;
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
}

const isUsersProfile = computed(() => {
  return authStore.user.id === profile.value.user_id;
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.profile !== from.params.profile) {
    getProfile();
  }
});

onMounted(async () => {
  getProfile();
});

// Follow
async function followUser() {
  console.log("follow user");
  try {
    const { data, error } = await supabase.from("follows").insert([
      {
        follower_id: authStore.user.id,
        following_id: profile.value.user_id,
      },
    ]);

    if (error) throw error;

    tweetStore.followingIds.push(profile.value.user_id);

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function unfollowUser() {
  console.log("follow user");
  try {
    const { data, error } = await supabase.from("follows").delete().match({
      follower_id: authStore.user.id,
      following_id: profile.value.user_id,
    });

    if (error) throw error;

    tweetStore.followingIds = tweetStore.followingIds.filter(
      (id) => id !== profile.value.user_id
    );

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

const isUserFollowing = computed(() => {
  return tweetStore.followingIds.includes(profile.value.user_id);
});

onMounted(async () => {
  tweetStore.getFollowing();
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
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea impedit
      suscipit eligendi aut fugit. Asperiores nesciunt dolores et omnis
      perspiciatis ea dolor perferendis laborum, magni error odio, ullam,
      voluptatum nostrum?
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile {
  padding: 1rem;
  display: grid;
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
