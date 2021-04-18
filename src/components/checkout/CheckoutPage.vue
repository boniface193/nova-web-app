<template>
  <div class="px-4 py-5" style="background: #fafafa; height: 100%">
    <!-- go to previous page -->
    <router-link
      :to="{
        path: `/checkout-details?order_id=${this.orderDetails.id}`,
      }"
      style="text-decoration: none"
      class="mx-5"
      v-if="this.$route.name === 'PaymentDetails'"
    >
      <span class="back-btn">
        <v-icon color="black" style="font-size: 25px">mdi-chevron-left</v-icon>
      </span>
    </router-link>

    <v-row v-show="!pageLoader">
      <v-col class="col-12 col-md-6 pt-5 pt-md-15 px-5">
        <div
          class="image-container pa-10"
          :class="this.$route.name === 'PaymentDetails' ? 'hide-image' : ''"
        >
          <img :src="orderDetails.product_image_url" alt="" />
        </div>
      </v-col>
      <v-col class="col-12 col-md-6 pt-5 pt-md-15 pr-0">
        <router-view
          :orderDetails="orderDetails"
          :productDetails="productDetails"
          :storeDetails="storeDetails"
        />
      </v-col>
    </v-row>
    <!-- page loader -->
    <div class="d-flex py-5 text-center" v-if="pageLoader">
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
  name: "CheckoutPage",
  components: { modal },
  data: function () {
    return {
      quantity: 1,
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      orderDetails: {
        delivery_location: {},
        customer: {},
        variants: []
      },
      productDetails: {
        description: ""
      },
      storeDetails: {
        refund_policy: {},
      },
      pageLoader: false,
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    this.$store
      .dispatch("orders/getOrdersDetail", {
        id: orderId,
      })
      .then((response) => {
        if (response.data.data.payment_status === "PAID") {
          this.$router.push({
            path: `/order-status?order_id=${orderId}`,
          });
        } else {
          this.orderDetails = response.data.data;
          this.getProductDetails(this.orderDetails.product_id);
        }
      })
      .catch((error) => {
        this.pageLoader = false;
        this.statusImage = failedImage;
        this.dialog = true;
        if (error.response.status == (422 || 400)) {
          this.dialogMessage = error.response.data.message;
        } else if (error.response.status == 404) {
          this.dialogMessage = "404 not found";
        } else if (error.response.status == 500) {
          this.dialogMessage = "Something went wrong, please try again";
        } else if (!navigator.onLine) {
          this.dialogMessage = "No internet connection!";
        }
      });
  },
  methods: {
    getProductDetails(product_id) {
      this.$store
        .dispatch("inventory/getProductDetail", {
          id: product_id,
        })
        .then((response) => {
          this.productDetails = response.data.data;
          this.getStoreDetails(this.orderDetails.store_id);
        })
        .catch((error) => {
          this.pageLoader = false;
          this.statusImage = failedImage;
          this.dialog = true;
          if (error.response.status === (422 || 400)) {
            this.dialogMessage = error.response.data.message;
          } else if (error.response.status === 404) {
            this.dialogMessage = "404 not found";
          } else if (error.response.status === 500) {
            this.dialogMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.dialogMessage = "No internet connection!";
          }
        });
    },
    getStoreDetails(store_id) {
      this.$store
        .dispatch("onboarding/getStoreDetails", {
          id: store_id,
        })
        .then((response) => {
          this.storeDetails = response.data.data;
          this.pageLoader = false;
        })
        .catch((error) => {
          this.pageLoader = false;
          this.statusImage = failedImage;
          this.dialog = true;
          if (error.response.status === (422 || 400)) {
            this.dialogMessage = error.response.data.message;
          } else if (error.response.status === 404) {
            this.dialogMessage = "404 not found";
          } else if (error.response.status === 500) {
            this.dialogMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.dialogMessage = "No internet connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.image-container {
  width: 80%;
  background: #fff;
  margin: auto;
  border-radius: 12px;
  position: relative;
  img {
    width: 100%;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 960px) {
  .hide-image {
    display: none !important;
  }
}
</style>
