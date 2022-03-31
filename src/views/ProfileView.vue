<script setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { supabase } from "@/supabase";

const props = defineProps(["profile"]);

const loading = ref(false);
const user = ref({});
const username = ref("");
const birthday = ref("");

async function getProfile() {
  try {
    loading.value = true;
    user.value = supabase.auth.user();

    const { data, error, status } = await supabase
      .from("profiles")
      .select("username, birthday")
      .eq("username", props.profile)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      birthday.value = data.birthday;
    }
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
    <div>USERNAME {{ username }}</div>
    <div>BIRTHDAY {{ birthday }}</div>
    <div>BIO</div>
    <div>CREATED_AT</div>
    <div>UPDATED_AT</div>
    <button @click="getProfile">PRINT</button>
  </div>
</template>

<style lang="scss" scoped></style>
