<script setup>
import DefaultLayout from "./DefaultLayout.vue";
import HomeLayout from "./HomeLayout.vue";

import { shallowRef, watch } from "vue";
import { useRoute } from "vue-router";

const layouts = {
  DefaultLayout,
  HomeLayout,
};

const layout = shallowRef("HomeLayout");
const route = useRoute();

watch(
  () => route.meta,
  async (meta) => {
    try {
      layout.value = layouts[meta.layout];
    } catch (e) {
      layout.value = DefaultLayout;
    }
  }
);
</script>

<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<style lang="scss" scoped></style>
