<template>
  <div
    style="
      position: relative;
      max-width: fit-content;
      max-width: -moz-fit-content;
    "
    @mouseleave="closeDropDown()"
  >
    <div class="category-container">
      <div
        class="mr-3 px-6 category secondary--text"
        :class="{
          'category--active': (activeLink || selectedCategory) == '',
        }"
        v-show="productCategories.length > 0"
        @click.stop="itemSelected('')"
      >
        All
      </div>

      <div
        class="mr-3 px-4 category secondary--text"
        v-for="(category, index) in productCategories"
        :key="index"
        :class="{
          'category--active': (activeLink || selectedCategory) == category.name,
        }"
        @click.stop="itemSelected(category.id)"
        @mouseover="openDropDown(category.name, category.children)"
      >
        {{ category.name }}
      </div>
    </div>

    <!-- sub catgeory section -->
    <div>
      <div class="sub-category-container sub-category-container--mobile" v-if="hover">
        <div
          class="sub-category"
          v-for="(subCategory, index2) in subCategories"
          :key="index2"
        >
          <p class="mb-1" @click.stop="itemSelected(subCategory.id)">
            {{ subCategory.name }}
          </p>
          <hr class="mb-2" />
          <p
            class="item mb-1"
            v-for="(subSubCategory, index3) in subCategory.children"
            :key="index3"
            @click.stop="itemSelected(subSubCategory.id)"
          > 
            {{ subSubCategory.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import failedImage from "@/assets/images/failed-img.svg";
export default {
  name: "CategoryList",
  data: function () {
    return {
      hover: false,
      activeLink: null,
      subCategories: [],
      selectedCategory: "",
    };
  },
  created() {
    if (this.$store.getters["inventory/productCategories"].length == 0) {
      this.getProductCategories();
    }
  },
  computed: {
    ...mapGetters({
      productCategories: "inventory/productCategories",
    }),
  },
  methods: {
    closeDropDown() {
      this.hover = false;
      this.activeLink = null;
    },
    openDropDown(activeLink, childrenCategory) {
      this.hover = true;
      this.activeLink = activeLink;
      this.subCategories = childrenCategory;
    },
    searchCategories(id, arr) {
      let item = arr.filter(({ children }) =>
        children.find((item) => item.id === id)
      );
      return item;
    },
    // get the list of product category
    getProductCategories() {
      this.$store
        .dispatch("inventory/getProductCategories")
        .then((response) => {
          this.$store.commit(
            "inventory/setProductCategories",
            response.data.data
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    itemSelected(categoryID) {
      this.closeDropDown();
      this.selectedCategory = categoryID;
      // commit values for filter
      this.$store.commit("inventory/setFilter", {
        minPrice: 0,
        maxPrice: 0,
      });

      // set page back to page 1
      this.$store.commit("inventory/setPage", 1);

      // set category
      this.$store.commit("inventory/setCategory", categoryID);

      // get products
      this.getProducts();
    },
    // get products
    getProducts() {
      const params = new URLSearchParams(window.location.search);
      this.$store.commit("inventory/setSearchProduct", false);
      if (params.get("search") || params.get("page")) {
        this.$router.push({
          name: "InventoryHome",
          query: {},
        });
      }
      this.$store.commit("inventory/setInventoryLoader", true);
      this.$store
        .dispatch("inventory/getfilteredProducts")
        .then(() => this.$store.commit("inventory/setInventoryLoader", false))
        .catch((error) => {
          this.$store.commit("inventory/setInventoryLoader", false);
          this.statusImage = failedImage;
          if (error.status === 422 || error.status === 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.response.data.message;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.category-container {
  position: relative;
  display: flex;
  flex: wrap;
  flex-wrap: nowrap;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  overflow-x: auto;
  max-width: 100%;
  display: flex;
  width: fit-content;
  width: -moz-fit-content;
  margin: auto;
  .category {
    border: 1px solid #bebebe;
    border-radius: 8px;
    font-size: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: fit-content;
    min-width: -moz-fit-content;
    cursor: pointer;
    &:hover {
      color: var(--v-primary-base) !important;
      background: var(--v-background-base);
    }
    &--active,
    &--selected {
      color: white !important;
      background: var(--v-primary-base);
    }
  }
  .sub-category-container {
    width: calc(100% - 12px);
    min-height: 250px;
    max-height: 500px;
    top: 40px;
    display: flex;
    left: 0px;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 10px;
    position: absolute;
    background: #ffffff;
    justify-content: flex-end;
    flex-wrap: wrap;
    flex-direction: column;
    overflow-y: auto;
    cursor: context-menu;
    z-index: 4;
    .sub-category {
      padding: 10px;
      width: 33%;
      height: auto;
      &:hover {
        color: var(--v-secondary-background-base);
      }
      .item {
        font-size: 15px;
        color: var(--v-secondary-base);
        cursor: pointer;
        &:hover {
          color: var(--v-primary-base);
        }
      }
    }
  }
  .category:hover + .sub-category-container {
    display: flex;
    color: black;
  }
  &:hover > .sub-category-container &::-webkit-scrollbar {
    display: none;
  }
}
@media (max-width: 700px) {
  .sub-category-container--mobile{
    display: none;
  }
}
</style>