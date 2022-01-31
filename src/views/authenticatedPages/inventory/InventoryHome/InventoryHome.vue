<template>
  <div class="pb-5">
    <div class="inventory-header">
      <div class="d-md-flex">
        <div class="mb-md-0 mb-6" style="width: 270px">
          <v-btn
            dark
            color="dark"
            :to="{ name: 'FMCGInventory' }"
            class="text-caption text-capitalize elevation-0 mr-4"
            >Start selling FMCG products
            <v-icon class="ml-4">mdi-arrow-right</v-icon></v-btn
          >
        </div>
        <v-spacer></v-spacer>
        <div class="inventory-header__filter-section">
          <div class="search-container">
            <SearchProduct />
          </div>
          <FilterProducts class="ml-1 filter-trigger mr-md-16" />
          <router-link
            :to="{ name: 'ShoppingCart' }"
            class="inventory-header__filter-section__cart"
          >
            <img width="40" src="@/assets/icons/cart-icon.svg" />
            <span class="no-of-item-in-cart">{{
              totalNumberOfProductsInCart
            }}</span>
          </router-link>
        </div>
      </div>
      <div class="mt-8 mt-md-6 mx-auto category-container">
        <CategoryList class="mx-auto" />
      </div>
    </div>
    <div
      class="pt-8 pb-5 products-container"
      v-show="products.length !== 0 && !inventoryLoader"
    >
      <div class="d-flex flex-wrap justify-center">
        <ProductCard
          class="mb-5 mr-4 mr-sm-6"
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :index="index"
          @addToCart="addToCart"
          @addToStore="addToStore"
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
      v-show="products.length == 0 && !inventoryLoader"
    >
      <p class="mb-0 secondary--text" style="font-size: 20px">
        Opps! No product found.
      </p>
    </div>
    <!-- loader -->
    <div class="text-center pt-10 pb-5" v-show="inventoryLoader">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!--------------------------- Modal for dialog messages ------------------------------>
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </Modal>
    <!-- add to cart dialog modal -->
    <AddToCartModal
      :product="currentProduct"
      :addToCartDialog="addToCartDialog"
      @closeAddToCartDialog="addToCartDialog = false"
    />
    <!-- add to store dialog modal -->
    <AddToStoreModal
      :product="currentProduct"
      :addToStoreDialog="addToStoreDialog"
      @closeAddToStoreDialog="addToStoreDialog = false"
    />
  </div>
</template>
<script>
import SearchProduct from "@/components/secondary/inventory/SearchProduct.vue";
import FilterProducts from "@/components/secondary/inventory/FilterProducts.vue";
import CategoryList from "@/components/secondary/inventory/CategoryList.vue";
import ProductCard from "@/components/secondary/inventory/ProductCard.vue";
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
import AddToCartModal from "@/components/secondary/inventory/AddToCartModal";
import AddToStoreModal from "@/components/secondary/inventory/AddToStoreModal";
import { mapGetters, mapState } from "vuex";
export default {
  name: "InventoryHome",
  components: {
    SearchProduct,
    FilterProducts,
    CategoryList,
    ProductCard,
    Modal,
    AddToCartModal,
    AddToStoreModal,
  },
  metaInfo() {
    return {
      title: "Kuuzza | Inventory",
      meta: [
        {
          name: "description",
          content:
            "Tap into our decentralised sales force and watch your business scale",
        },
        {
          property: "og:title",
          content:
            "Tap into our decentralised sales force and watch your business scale",
        },
        { property: "og:site_name", content: "Kuuzza | Inventory" },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  data: function () {
    return {
      dialogMessage: "",
      statusImage: null,
      dialog: false,
      currentProduct: {
        min_order_quantity: 1,
        variants: [{}],
        max_profit: 0,
      },
      addToCartDialog: false,
      addToStoreDialog: false,
    };
  },
  created() {
    this.$store.commit("inventory/setInventoryLoader", true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("page")) {
      // set page back to page 1
      this.$store.commit("inventory/setPage", params.get("page"));
      if (params.get("search")) {
        this.$store.commit("inventory/setSearchValue", params.get("search"));
        this.$store.commit("inventory/setSearchProduct", true);
        this.getSearchProduct();
      } else {
        this.$store.commit("inventory/setSearchProduct", false);
        this.getfilteredProducts();
      }
    } else {
      this.$store.commit("inventory/setSearchProduct", false);
      this.getProducts();
    }
    this.$store.commit("settings/setSellerStatus", true);
  },
  computed: {
    ...mapGetters({
      products: "inventory/products",
    }),
    ...mapState({
      inventoryLoader: (state) => state.inventory.inventoryLoader,
      page: (state) => state.inventory.page,
      pageDetails: (state) => state.inventory.pageDetails,
      searchValue: (state) => state.inventory.searchValue,
      searchProduct: (state) => state.inventory.searchProduct,
      totalNumberOfProductsInCart: (state) =>
        state.orders.totalNumberOfProductsInCart,
    }),
    getCurrentPage() {
      return {
        currentPage: this.pageDetails.current_page,
      };
    },
  },
  methods: {
    addToCart(product) {
      this.currentProduct = product;
      this.addToCartDialog = true;
    },
    addToStore(product) {
      this.currentProduct = product;
      this.addToStoreDialog = true;
    },
    getProducts() {
      // set category
      this.$store.commit("inventory/setCategory", "");
      this.$store
        .dispatch("inventory/getProducts")
        .then(() => {
          this.$store.commit("inventory/setInventoryLoader", false);
          this.dialog = false;
        })
        .catch((error) => {
          this.$store.commit("inventory/setInventoryLoader", false);
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // set current page
    setCurentPage() {
      this.$store.commit("inventory/setPage", this.getCurrentPage.currentPage);
      const params = new URLSearchParams(window.location.search);
      if (this.searchProduct === true) {
        if (this.getCurrentPage.currentPage != params.get("page")) {
          this.$router.push({
            name: "InventoryHome",
            query: {
              search: this.searchValue,
              page: this.getCurrentPage.currentPage,
            },
          });
          this.getSearchProduct();
        }
      } else {
        this.$router.push({
          name: "InventoryHome",
          query: { page: this.getCurrentPage.currentPage },
        });
        this.getfilteredProducts();
      }
    },
    // request for page with the request informations
    getfilteredProducts() {
      this.$store
        .dispatch("inventory/getfilteredProducts")
        .then(() => this.$store.commit("inventory/setInventoryLoader", false))
        .catch((error) => {
          this.$store.commit("inventory/setInventoryLoader", false);
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // search products
    getSearchProduct() {
      this.$store
        .dispatch("inventory/searchProducts")
        .then(() => this.$store.commit("inventory/setInventoryLoader", false))
        .catch((error) => {
          this.$store.commit("inventory/setInventoryLoader", false);
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./inventoryHome";
</style>