<template>
  <div>
    <v-app-bar app color="white" elevation="0" class="catalog__main-container">
      <img
        src="@/assets/images/primary-logo.png"
        alt=""
        width="100px"
        height="32.1px"
      />
      <v-spacer></v-spacer>
      <div class="catalog__cart">
        <img
          width="29.84px"
          height="20.11px"
          src="@/assets/icons/cart-icon.svg"
          class="mr-2"
        />
        <span class="no-of-item-in-cart pa-1">0</span>
      </div>
    </v-app-bar>
    <div class="catalog__container">
      <div class="justify-center d-flex">
        <div class="catalog__justify-header">
          <h5 class="catalog__storeName">Store Name</h5>
          <p class="catalog__discript">
            This is where the store description would be. This is where the
            store description would be. This is where the store description
            would be.
          </p>
        </div>
      </div>
      <div class="my-8">
        <h5 class="catalog__product">Products</h5>
        <v-row class="mt-9">
          <v-col
            cols="6"
            sm=""
            v-for="(product, index) in products"
            :key="product.id"
          >
            <ProductCard class="mb-9" :product="product" :index="index" />
          </v-col>
        </v-row>
      </div>

      <div class="d-flex justify-space-between align-center flex-wrap mt-6">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <p class="mb-2 mr-5">Page 1 of 4</p>
        </div>
        <div class="pagination mb-2">
          <v-pagination v-model="pages" length="4" circle> </v-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "../productPage/ProductCard.vue";
export default {
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
        {
          image: require("@/assets/images/primary-logo.png"),
          name: "kudle",
          total_price_label: "200",
          min_profit_short: "1",
          max_profit_short: "20",
          points: "1",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./Catalog";
</style>