<template>
  <!-- search bar -->
  <div class="d-flex">
  <div
    class="search-bar"
    :style="{ background: bgColor, 'border-color': borderColor }"
  >
    <!-- input field -->
    <input
      type="text"
      v-model="searchValue"
      @change="updateSearchValue"
      @keyup.enter="updateSearchValue"
      :placeholder="placeholder"
    />
    </div>
    <v-icon @click="updateSearchValue" class="primary pa-2 rounded-r-lg" color="#DDF8F7" style="cursor: pointer;">mdi-magnify</v-icon>
  </div>
</template>
<script>
export default {
  name: "SearchBar",
  data: function () {
    return {
      searchValue: "",
    };
  },
  props: ["placeholder", "bgColor", "borderColor"],
  methods: {
    updateSearchValue() {
      this.$emit("search", this.searchValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.search-bar {
  width: 100%;
  height: 42px;
  background: #f9fafe;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  display: flex;
  align-items: center;
  padding: 2px 0px;
  border: 1px solid transparent;
  input {
    margin-left: 7px;
    height: 100%;
    border: none;
    outline: none;
    padding-left: 2px;
    width: -webkit-fill-available;
    background: transparent;
  }
}
@media (max-width: 600px) {
  .search-bar {
    width: 100%;
  }
}
</style>