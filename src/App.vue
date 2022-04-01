<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { supabase } from "./supabase";

import AppLayout from "./layouts/AppLayout.vue";

const authStore = useAuthStore();

authStore.user = supabase.auth.user();

supabase.auth.onAuthStateChange((_, session) => {
  authStore.user = session ? session.user : null;
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style>
@import "@/assets/base.css";
</style>
