<template>
  <div class="category-container">
    <div
      class="mr-2 px-1 category secondary--text"
      v-for="(category, index) in productCategories"
      :key="index"
    >
      {{ category.name }}
      <div class="sub-category-container">
        <div
          class="sub-category"
          v-for="(subCategory, index2) in category.children"
          :key="index2"
        >
          <p class="mb-1" @click.stop="itemSelected(subCategory.name)">
            {{ subCategory.name }}
          </p>
          <hr class="mb-2" />
          <p
            class="item mb-1"
            v-for="(subSubCategory, index3) in subCategory.children"
            :key="index3"
            @click.stop="itemSelected(subSubCategory.name)"
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
export default {
  name: "CategoryList",
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
    itemSelected(){}
  },
};
</script>
<style lang="scss" scoped>
.category-container {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  // -ms-overflow-style: none; /* IE and Edge */
  // scrollbar-width: none;
  display: flex;
  width: fit-content;
  margin: auto;
  z-index: 4;
  .category {
    border: 1px solid #bebebe;
    border-radius: 8px;
    font-size: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    width: fit-content;
    cursor: pointer;
    z-index: 5;
    &:hover {
      color: var(--v-primary-base);
      background: var(--v-background-base);
    }
    .sub-category-container {
      width: calc(100% - 12px);
      min-height: 250px;
      max-height: 500px;
      top: 42px;
      left: 0px;
      box-shadow: 0px 3px 6px #00000029;
      border-radius: 10px;
      position: absolute;
      background: #ffffff;
      display: none;
      justify-content: flex-end;
      flex-wrap: wrap;
      flex-direction: column;
      overflow-y: auto;
      cursor: context-menu;
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
    &:hover > .sub-category-container {
      display: flex;
      color: black;
    }
  }
  // &::-webkit-scrollbar {
  //   display: none;
  // }

  @media (max-width: 650px){
    .category{
      height: 55px;
    }
  }
}
</style>