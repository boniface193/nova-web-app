<template>
  <div>
    <!-- title -->
    <h2 class="title mb-5">Settings</h2>
    <!-- pages -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: "Settings",
};
</script>
<style lang="scss" scoped>
@media (max-width: 1000px) {
  .title {
    display: none;
  }
}
</style>