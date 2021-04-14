<template>
  <!-- search bar -->
  <div class="search-bar" :style="{background: bgColor, 'border-color': borderColor}">
    <v-icon class="primary--text">mdi-magnify</v-icon>
    <!-- input field -->
    <input
      type="text"
      v-model="searchValue"
      @change="updateSearchValue"
      @keyup.enter="updateSearchValue" :placeholder="placeholder" class="form-controlly pl-10 form-control-bgColor" />
    
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
.form-controlly {
  display: block;
  width: 100%;
  padding: 0.55rem 1rem;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #21252900;
  background-color: #f3f5ff;
  background-clip: padding-box;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border-radius: 12px;
}
.form-controlly:focus {
  color: #212529;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.position-abs {
  position: absolute !important;
  color: #5064cc;
  font-size: 20px !important;
  opacity: 0.5;
}
</style>