<template>
  <div>
    <!-- search bar -->
    <SearchBar
      placeholder="Search Inventory"
      bgColor="#DDF8F7"
      borderColor="transparent"
      @search="setSearchValue"
    />
  </div>
</template>
<script>
import SearchBar from "@/components/primary/SearchBar.vue";
import failedImage from "@/assets/images/failed-img.svg";
export default {
  name: "SearchProduct",
  components: { SearchBar },
  data: function(){
    return {
      searchValue: ""
    }
  },
  methods: {
    // set search value
    setSearchValue(params) {
      this.$store.commit("inventory/setSearchValue", params);
      this.searchValue = params
      this.$store.commit("inventory/setSearchProduct", true);
      this.$store.commit("inventory/setPage", 1);
      this.searchProducts();
    },
    // search products
    searchProducts() {
      if (this.searchValue !== "") {
        this.$store.commit("inventory/setSearchProduct", true);
        this.$router.push({
          //name: "InventoryHome",
          query: { search: this.searchValue, page: 1 },
        });
      } else {
        this.$store.commit("inventory/setSearchProduct", false);
        return null
        // this.$router.push({
        // //   //name: "InventoryHome",
        //   query: { page: 1 },
        // });
      }
      this.getProducts();
    },
    // get products
    getProducts() {
      this.$store.commit("inventory/setInventoryLoader", true);
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
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
</style>