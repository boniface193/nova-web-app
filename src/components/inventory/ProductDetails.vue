<template>
  <div class="px-2 px-md-7">
    <div v-show="!loader">
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <!-- go to previous page -->
        <router-link
          :to="{
            name: 'ProductPage',
            params: {
              id: this.$route.params.id,
            },
          }"
          style="text-decoration: none"
        >
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <!-- title -->
        <h3 class="align-self-center headings">Product Details</h3>
      </div>

      <div class="mt-5">
        <h5 class="mb-4 sub-headings">Description</h5>
        <p class="mb-5 details">
          {{ productDetails.description }}
        </p>

        <!-- <h5 class="mb-4">Key Features</h5>
        <p class="mb-5 secondary--text" style="font-size: 14px">
          128GB or 256GB PCle-based flash storage 13 inch 1440 x 900-pixel
          display 8GB of 1600 MHz LPDDR3 RAM Intel HD Graphics 6000 1.8GHz
          dual-core Intel Core i5 processor with 3MB Operating System: Mac OS X
          Product Warranty: 1 year
        </p> -->
      </div>
    </div>
    <div class="d-flex py-5 text-center" v-if="loader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>
    <!-- modal for dialog messages -->
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
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "ProductDetails",
  components: { modal },
  data: function () {
    return {
      productDetails: {},
      loader: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
    };
  },
  created() {
    this.loader = true;
    this.$store
      .dispatch("inventory/getProductDetail", {
        id: this.$route.params.id,
      })
      .then((response) => {
        this.loader = false;
        this.productDetails = response.data.data;
      })
      .catch((error) => {
        this.dialog = true;
        this.loader = false;
        this.statusImage = failedImage;
        if (error.response) {
          this.dialogMessage = "Sorry, this data does not Exist";
        } else {
          this.dialogMessage = "No internet Connection!";
        }
      });
  },
};
</script>
<style lang="scss" scoped>
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.headings {
  color: #2b2b2b;
  font-size: 20px;
}
.sub-headings {
  color: #2b2b2b;
  font-size: 16px;
}
.details {
  color: #979797;
  font-size: 12px;
  opacity: 100%;
}
</style>