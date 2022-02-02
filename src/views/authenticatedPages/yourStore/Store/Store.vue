<template>
  <div class="store-page">
    <div class="store-page__header mb-5">
      <h3 class="store-name">Store name</h3>
      <v-btn width="150px" class="secondary--text">Copy link</v-btn>
    </div>
    <h4>Products</h4>

    <!-- page content list of products -->
    <div >
      <div class="store-page__content py-5">
        <StoreProductCard
          class="mb-5 mr-4 mr-sm-6"
          v-for="(product, index) in 15"
          :key="product.id"
          :product="product"
          :index="index"
        />
      </div>
    </div>

    <!-- no data -->
    <div
      class="text-center pt-10 pb-5"
      v-show="products.length == 0 && !loading"
    >
      <p class="mb-0 secondary--text mx-auto" style="max-width: 500px">
        Your store is empty. please click on the button below to start adding
        products to your store
      </p>
      <router-link to="/inventory">
        <v-btn class="primary mx-auto mt-3">Add products</v-btn>
      </router-link>
    </div>
    <!-- loader -->
    <div class="text-center pt-10 pb-5" v-show="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import StoreProductCard from "@/components/secondary/StoreProductCard.vue";
export default {
  name: "Store",
  components: { StoreProductCard },
  data: function () {
    return {
      products: [],
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.getSellerStoreProducts();
  },
  methods: {
    getSellerStoreProducts() {
      this.$store
        .dispatch("inventory/getSellerStoreProducts")
        .then((response) => {
          this.products = response.data.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Store.scss";
</style>