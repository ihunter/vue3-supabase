<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

const router = useRouter();

const authStore = useAuthStore();

async function logout() {
  try {
    await supabase.auth.signOut();

    router.push({ name: "login" });
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <div class="container">
    <nav>
      <RouterLink :to="{ name: 'home' }">
        <div>
          <font-awesome-icon :icon="['fas', 'house']" size="lg" />
          <span class="nav-link-text">Home</span>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'home' }">
        <div>
          <font-awesome-icon :icon="['fas', 'hashtag']" size="lg" />
          <span class="nav-link-text">Explore</span>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'home' }">
        <div>
          <font-awesome-icon :icon="['fas', 'bell']" size="lg" />
          <span class="nav-link-text">Notifications</span>
        </div>
      </RouterLink>

      <RouterLink
        :to="{ name: 'profile', params: { userId: authStore.user.id } }"
      >
        <div>
          <font-awesome-icon :icon="['fas', 'user']" size="lg" />
          <span class="nav-link-text">Profile</span>
        </div>
      </RouterLink>

      <a @click="logout">
        <div>
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" size="lg" />
          <span class="nav-link-text">Logout</span>
        </div>
      </a>
    </nav>

    <main>
      <slot />
    </main>

    <aside>
      <h1>{{ authStore.username }}</h1>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  max-width: 1200px;
  margin: auto;

  nav {
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 1rem;

    a {
      display: block;
      cursor: pointer;

      &:hover {
        div {
          background: #333;
        }
      }

      div {
        font-size: 1.3rem;
        display: inline-block;
        padding: 1rem;
        margin: 0.5rem;
        padding: 1rem 1.5rem;
        cursor: pointer;
        border-radius: 9999px;
        transition: background-color 200ms linear;

        span {
          margin-left: 1rem;
        }
      }
    }
  }

  main {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }

  aside {
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
