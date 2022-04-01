<script setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { supabase } from "@/supabase";

const props = defineProps(["username"]);

const loading = ref(false);
const profile = ref({});

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

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.profile !== from.params.profile) {
    getProfile();
  }
});

onMounted(async () => {
  getProfile();
});
</script>

<template>
  <div>
    <div>USERNAME: {{ profile.username }}</div>
    <div>BIRTHDAY: {{ profile.birthday }}</div>
    <div>BIO: {{ profile.bio }}</div>
    <div>CREATED_AT: {{ profile.created_at }}</div>
    <div>UPDATED_AT: {{ profile.updated_at }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
