<script setup>
import { useAuthStore } from "../stores/auth";
import NavLinks from "@/components/NavLinks.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="container">
    <nav>
      <NavLinks />
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
  grid-template-columns: minmax(100px, 1fr) minmax(600px, 2fr) minmax(
      300px,
      1fr
    );
  max-width: 1200px;
  margin: auto;

  nav {
    height: 100vh;
    position: sticky;
    display: flex;
    flex-direction: column;
    top: 0;
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

@media (max-width: 1100px) {
  .container {
    aside {
      display: none;
    }
  }
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;

    nav {
      grid-row: 2 / 2;
      background: var(--color-background);
      position: sticky;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      z-index: 1;
      height: auto;
      width: 100%;
      top: auto;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
