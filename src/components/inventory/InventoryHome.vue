<template>
  <div class="px-2 px-md-7 pt-16 pt-md-0 pb-16">
    <div class="d-flex align-center" style="justify-content: flex-end">
      <div class="search-container">
        <SearchProduct />
      </div>

      <FilterProducts class="ml-1" />
    </div>
    <div class="mt-6 category-container">
      <CategoryList class="mx-auto" />
    </div>

    <div
      class="pt-12 pb-5 products-container"
      v-show="products.length !== 0 && !inventoryLoader"
    >
      <div class="d-flex flex-wrap">
        <ProductCard
          class="mb-10"
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
      <!-- pagination -->
      <div class="d-flex justify-space-between px-4 align-center flex-wrap">
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
      <!-- </v-container> -->
      <!--------------------------- modal for dialog messages ------------------------------>
      <modal :dialog="dialog" width="400">
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
      </modal>
    </div>
  </div>
</template>
<script>
import SearchProduct from "@/components/inventory/SearchProduct.vue";
import FilterProducts from "@/components/inventory/FilterProducts.vue";
import CategoryList from "@/components/inventory/CategoryList.vue";
import ProductCard from "@/components/inventory/ProductCard.vue";
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
import { mapGetters, mapState } from "vuex";
export default {
  name: "InventoryHome",
  components: {
    SearchProduct,
    FilterProducts,
    CategoryList,
    ProductCard,
    modal,
  },
  data: function () {
    return {
      dialogMessage: "",
      statusImage: null,
      dialog: false,
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
    }),
    getCurrentPage() {
      return {
        currentPage: this.pageDetails.current_page,
      };
    },
  },
  methods: {
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
          this.dialog = true;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = "Sorry, this data does not Exist";
          } else {
            this.dialogMessage = "No internet Connection!";
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
          this.statusImage = failedImage;
          this.$store.commit("inventory/setInventoryLoader", false);
          this.dialog = true;
          if (error.response) {
            this.dialogMessage = "Something went wrong, pls try again!";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
    // search products
    getSearchProduct() {
      this.$store
        .dispatch("inventory/searchProducts")
        .then(() => this.$store.commit("inventory/setInventoryLoader", false))
        .catch((error) => {
          this.statusImage = failedImage;
          this.$store.commit("inventory/setInventoryLoader", false);
          this.dialog = true;
          if (error.response) {
            this.dialogMessage = "Something went wrong, pls try again!";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.products-container {
  width: 1050px;
  margin: auto;
}
.search-container {
  width: 400px;
}
.category-container {
  max-width: 100%;
  //overflow-x: auto;
  position: relative;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 1300px) {
  .products-container {
    width: 840px;
  }
}
@media (max-width: 860px) {
  .products-container {
    width: 630px;
  }
}
@media (max-width: 650px) {
  .products-container {
    width: 400px;
  }
  .category-container {
    margin: auto 3%;
  }
  .search-container {
    margin: auto 3%;
  }
  .my-sm-5 {
    margin: 8% 0 0 0;
  }
}
@media (max-width: 410px) {
  .products-container {
    width: 100%;
  }
}
@media (max-width: 500px) {
  .search-container {
    max-width: -webkit-fill-available;
    width: -webkit-fill-available;
    min-width: 150px;
    margin: auto 3%;
  }
}
</style>