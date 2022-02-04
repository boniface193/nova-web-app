<template>
  <div class="store-page">
    <!-- header section-->
    <div class="store-page__header mb-5">
      <a
        class="primary--text"
        @click="
          () => {
            this.editMode = !this.editMode;
          }
        "
        >{{ editMode ? "Done" : "Edit mode" }}</a
      >
      <!-- store name -->
      <h3 class="store-name">
        <span v-show="!editMode">{{ storeName }}</span
        ><input
          v-show="editMode"
          @change="updateStoreName()"
          class="edit-store-name"
          v-model="storeName"
          :disabled="!editMode"
        />
      </h3>
      <v-btn width="150px" class="secondary--text">Copy link</v-btn>
    </div>

    <div class="d-flex justify-space-between" :class="{ 'mb-8': editMode }">
      <h4>
        Products
        <span
          class="ml-5 secondary--text"
          v-show="editMode"
          style="font-weight: normal"
          >{{ selectedProducts.length }}
          {{
            selectedProducts.length > 1 ? "items selected" : "item selected"
          }}</span
        >
      </h4>
      <!-- delete btn -->
      <a v-if="editMode" class="error--text d-flex align-center">
        <span
          v-show="!deletingProducts"
          class="mt-1"
          @click="deleteBulkProductInStore()"
        >
          Remove selected items</span
        ><img class="ml-1" src="@/assets/icons/trash.svg" alt="remove" />
        <!-- loading state -->
        <span v-show="deletingProducts" class="mt-1">
          Removing product...
          <v-progress-circular
            indeterminate
            color="red"
            class="ml-1"
            size="20"
          ></v-progress-circular>
        </span>
      </a>
    </div>

    <!-- page content list of products -->
    <div v-if="products.length > 0 && !loading">
      <div class="store-page__content pt-8 mb-6">
        <StoreProductCard
          class="mb-5 mr-4 mr-sm-6"
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :editMode="editMode"
          :index="index"
          @addToSelectedProducts="addToSelectedProducts"
          @updateProductProfit="updateProductProfit($event, index)"
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
      products: [{ product: {} }],
      loading: false,
      editMode: false,
      selectedProducts: [],
      storeName: this.$store.getters["inventory/sellerStoreDetails"].name,
      deletingProducts: false,
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
    updateStoreName() {
      this.$store
        .dispatch("inventory/updateStoreName", {
          name: this.storeName,
        })
        .catch(() => {});
    },
    deleteBulkProductInStore() {
      this.deletingProducts = true;
      this.$store
        .dispatch("inventory/deleteBulkProductInStore", {
          ids: this.selectedProducts,
        })
        .then(() => {
          //this.deletingProducts = false;
          //this.selectedProducts.forEach((item)=>{
          //  let productIndex = this.selectedProducts.indexOf(item);
          //  this.selectedProducts.splice(productIndex);
          //});
          this.selectedProducts = [];
        })
        .catch(() => {
          this.deletingProducts = false;
        });
    },
    updateProductProfit(params, index) {
      this.$store
        .dispatch("inventory/updateProductProfit", params)
        .then((response) => {
          this.products[index] = response.data.data;
        })
        .catch(() => {});
    },
    addToSelectedProducts(product_id) {
      if (!this.selectedProducts.includes(product_id)) {
        this.selectedProducts.push(product_id);
      } else {
        let productIndex = this.selectedProducts.indexOf(product_id);
        this.selectedProducts.splice(productIndex);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Store.scss";
</style>