<template>
  <div class="d-flex">
    <Layout />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Layout from "@/components/layout/Layout.vue";
export default {
  components: {
    Layout,
  },
};
</script>

<style>
</style>