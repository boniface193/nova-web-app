<template>
  <div>
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
        <h3 class="align-self-center">Product Details</h3>
      </div>

      <div class="mt-5">
        <h4 class="mb-4">Description</h4>
        <p class="mb-5 secondary--text" style="font-size: 14px">
          {{ productDetails.description }}
        </p>
      </div>
    </div>
    <div class="d-flex py-5 text-center mx-auto" v-if="loader">
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
        this.loader = false;
        if (error.response.status === (422 || 400)) {
          this.statusImage = failedImage;
          this.dialog = true;
          this.dialogMessage = error.response.data.message;
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
</style>