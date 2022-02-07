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
      <v-btn
        width="150px"
        class="secondary--text"
        :class="{ 'primary white--text': copyStatus }"
        v-on:click="copyToClipBoard"
        >{{ copyStatus ? "Copied" : "Copy link" }}</v-btn
      >
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
          class="mb-8 mr-4 mr-sm-6"
          :class="{ 'mb-12': editMode }"
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :editMode="editMode"
          :index="index"
          @addToSelectedProducts="addToSelectedProducts"
          @updateProductProfit="updateProductProfit($event, index)"
        />
      </div>
      <!-- pagination -->
      <div class="d-flex justify-space-between align-center flex-wrap">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <p class="mb-2 mr-5">
            Page {{ pageDetails.current_page }} of {{ pageDetails.last_page }}
          </p>
        </div>
        <div class="pagination mb-2">
          <v-pagination
            v-model="getCurrentPage.currentPage"
            :length="pageDetails.last_page"
            @input="setCurentPage"
            circle
          ></v-pagination>
        </div>
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
      copyStatus: false,
      url: `https://${this.$store.getters["inventory/sellerStoreDetails"].username}.kuuzza.store`,
      pageDetails: {},
      initialpage: 1,
    };
  },
  created() {
    this.loading = true;
    const params = new URLSearchParams(window.location.search);
    this.initialpage = params.get("page") ? params.get("page") : 1;
    this.getSellerStoreProducts(this.initialpage);
  },
  computed: {
    getCurrentPage() {
      return {
        currentPage: this.pageDetails.current_page,
      };
    },
  },
  methods: {
    getSellerStoreProducts(page) {
      this.$store
        .dispatch("inventory/getSellerStoreProducts", { page: page })
        .then((response) => {
          this.products = response.data.data;
          this.pageDetails = response.data.meta;
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
      if (this.selectedProducts.length > 0) {
        this.deletingProducts = true;
        this.$store
          .dispatch("inventory/deleteBulkProductInStore", {
            ids: this.selectedProducts,
          })
          .then(() => {
            this.deletingProducts = false;
            this.selectedProducts.forEach((item) => {
              let productIndex = this.products.findIndex((x) => x.id === item);
              this.products.splice(productIndex, 1);
            });
            this.selectedProducts = [];
          })
          .catch(() => {
            this.deletingProducts = false;
          });
      }
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
        this.selectedProducts.splice(productIndex, 1);
      }
    },
    // set current page
    setCurentPage() {
      const params = new URLSearchParams(window.location.search);
      if (this.getCurrentPage.currentPage != params.get("page")) {
        this.$router.push({
          name: "Store",
          query: {
            page: this.getCurrentPage.currentPage,
          },
        });
        this.getSellerStoreProducts(this.getCurrentPage.currentPage);
      }
    },
    copyToClipBoard() {
      navigator.clipboard.writeText(this.url);
      this.copyStatus = true;
      setTimeout(() => {
        this.copyStatus = false;
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Store.scss";
</style>