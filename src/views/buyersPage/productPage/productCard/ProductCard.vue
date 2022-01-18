<template>
  <div class="card-container">
    <router-link
      :to="{
        name: 'productDetail',
        params: { id: '1425', createLink: false },
      }"
      style="text-decoration: none"
    >
      <div class="card-top">
        <div class="image-container">
          <img :src="product.image" alt="" />
        </div>
      </div>
      <div class="card-bottom">
        <h4 class="mb-0 mb-sm-1 product-name" style="color: black">
          {{ product.name }}
        </h4>
        <p class="secondary--text mb-0 mb-sm-1 total_price">
          &#8358;{{ product.total_price_label }}
        </p>

        <v-btn
          class="primary sell-now"
          width="162px"
          height="28px"
          @click.prevent.stop="showAddtoCartModal()"
          depressed
          >Add to cart</v-btn
        >
        <span
          class="primary sell-now-secondary"
          @click.prevent.stop="showAddtoCartModal()"
          >+</span
        >
      </div>
      <p class="points">{{ product.points }}pts</p>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ProductCard",
  props: ["product", "addToCartDialog"],
  data: function () {
    return {};
  },
  methods: {
    showAddtoCartModal() {
      this.$emit("addToCart", this.product);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ProductCard"
</style>
