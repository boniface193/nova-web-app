<template>
  <div class="store-page">
    <div class="store-page__header mb-5">
      <h3 class="store-name">Store name</h3>
      <v-btn width="150px" class="secondary--text">Copy link</v-btn>
    </div>
    <h4>Products</h4>
    <div class="store-page__content"></div>
  </div>
</template>
<script>
export default {
  name: "Store",
  created() {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "./Store.scss";
</style>