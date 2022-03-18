<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { supabase } from "./supabase";

const authStore = useAuthStore();

authStore.user = supabase.auth.user();

supabase.auth.onAuthStateChange((_, session) => {
  authStore.user = session ? session.user : null;
});
</script>

<template>
  <RouterView />
</template>

<style>
@import "@/assets/base.css";
</style>
