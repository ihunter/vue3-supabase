<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

const authStore = useAuthStore();

const router = useRouter();

async function logout() {
  try {
    await router.push({ name: "login" });
    await supabase.auth.signOut();
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <RouterLink :to="{ name: 'home' }">
    <div>
      <font-awesome-icon
        class="nav-link-icon"
        :icon="['fas', 'house']"
        size="lg"
      />
      <span class="nav-link-text">Home</span>
    </div>
  </RouterLink>
  <RouterLink :to="{ name: 'home' }">
    <div>
      <font-awesome-icon
        class="nav-link-icon"
        :icon="['fas', 'hashtag']"
        size="lg"
      />
      <span class="nav-link-text">Explore</span>
    </div>
  </RouterLink>
  <RouterLink :to="{ name: 'home' }">
    <div>
      <font-awesome-icon
        class="nav-link-icon"
        :icon="['fas', 'bell']"
        size="lg"
      />
      <span class="nav-link-text">Notifications</span>
    </div>
  </RouterLink>
  <RouterLink
    :to="{ name: 'profile', params: { username: authStore.username } }"
  >
    <div>
      <font-awesome-icon :icon="['fas', 'user']" size="lg" />
      <span class="nav-link-text">Profile</span>
    </div>
  </RouterLink>
  <a @click="logout">
    <div>
      <font-awesome-icon
        class="nav-link-icon"
        :icon="['fas', 'right-from-bracket']"
        size="lg"
      />
      <span class="nav-link-text">Logout</span>
    </div>
  </a>
</template>

<style lang="scss" scoped>
a {
  cursor: pointer;
  margin: 0.5rem;

  &:hover {
    div {
      background: #333;
    }
  }

  div {
    max-width: 100%;
    font-size: 1.3rem;
    display: inline-block;
    padding: 1rem 1.5rem;
    border-radius: 9999px;
    transition: background-color 200ms linear;

    .nav-link-icon {
      max-width: 25px;
    }
    .nav-link-text {
      margin-left: 1rem;
    }
  }
}

@media (max-width: 1200px) {
  a {
    text-align: right;
    div {
      .nav-link-text {
        display: none;
      }
    }
  }
}
</style>
