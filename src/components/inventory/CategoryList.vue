<template>
  <div class="category-container">
    <div
      class="mr-3 px-4 category secondary--text"
      v-for="(category, index) in categories"
      :key="index"
    >
      {{ category }}
    </div>
  </div>
</template>
<script>
export default {
  name: "CategoryList",
  data: function () {
    return {
      categories: [
        "Phone and Tablets",
        "Computing",
        "Power",
        "Clothing",
        "Kitchen Accessories",
        "Phone and Tablets",
        "Computing",
        "Power",
        "Clothing",
        "Kitchen Accessories",
        "Phone and Tablets",
        "Computing",
        "Power",
        "Clothing",
        "Kitchen Accessories",
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.category-container {
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow-x: auto;
  flex-wrap: nowrap;
  overflow-y: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  display: flex;
  .category {
    border: 1px solid #bebebe;
    border-radius: 8px;
    font-size: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    min-width: fit-content;
    cursor: pointer;
    &:hover {
      background: #DDF8F7;
      color: #029B97 !important;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>