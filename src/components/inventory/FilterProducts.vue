<template>
  <div>
    <BasicFilter
      :price="filterParameters.price"
      toolTipText="Filter products"
      headerName="Filter Products"
      @filterOption="filterTable"
      @resetFilter="resetFilter"
    />
    <!-- do not remove -->

    <!--------------------------- modal for dialog messages ------------------------------>
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
  </div>
</template>
<script>
import BasicFilter from "@/components/general/BasicFilter.vue";
import Modal from "@/components/modal.vue";
import failedImage from "@/assets/images/failed-img.svg";
import { mapState } from "vuex";
export default {
  name: "FilterProducts",
  components: {
    BasicFilter,
    Modal,
  },
  data: function () {
    return {
      searchValue: "",
      dialog: false,
      dialogMessage: "",
      statusImage: null,
      filterParameters: {
        price: true,
      },
      filteringOptions: {
        minPrice: 0,
        maxPrice: 0,
      },
    };
  },
  computed: {
    ...mapState({
      inventoryLoader: (state) => state.inventory.inventoryLoader,
    }),
  },
  methods: {
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
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // filterTable
    filterTable(params) {
      // commit values for filter
      this.$store.commit("inventory/setFilter", {
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      });

      // set page back to page 1
      this.$store.commit("inventory/setPage", 1);

      // get products
      this.getProducts();
    },
    // reset filter
    resetFilter() {
      // commit values for filter
      this.$store.commit("inventory/setFilter", {
        minPrice: 0,
        maxPrice: 0,
      });

      // set page back to page 1
      this.$store.commit("inventory/setPage", 1);

      // get products
      this.getProducts();
    },
  },
};
</script>
<style lang="scss" scoped>
.row {
  margin: 0px !important;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
</style>