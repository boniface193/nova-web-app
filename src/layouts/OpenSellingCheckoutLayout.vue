<template>
  <div>
    <div class="checkout-page__header">
      <!-- logo section -->
      <div class="checkout-page__header__logo">
        <img src="@/assets/images/primary-logo.png" alt="" />
      </div>
      <div class="checkout-page__header__message-section">
        <div class="d-flex align-center mb-3">
          <p class="secondary--text mr-1 mb-0">Chat Seller:</p>

          <a
            :href="
              '//' +
              `api.whatsapp.com/send?text=Hello my name is ${orderDetails.customer.name}&phone=${sellerDetails.phone_number}`
            "
            target="_blank"
            style="text-decoration: none"
            class="primary--text d-flex align-center"
          >
            <img class="mr-2" src="@/assets/icons/whatsapp-icon.svg" alt="" />
            <span class="seller-name">{{ sellerDetails.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- go to previous page -->
    <router-link
      :to="{
        path: `/openSellingCheckout-details?OpenOrder_id=${this.orderDetails.id}`,
      }"
      style="text-decoration: none"
      class="mx-5"
      v-if="this.$route.name === 'PaymentDetails'"
    >
      <span class="back-btn">
        <v-icon color="black" style="font-size: 25px">mdi-chevron-left</v-icon>
      </span>
    </router-link>

    <div class="d-flex py-5 text-center" v-if="pageLoader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>

    <router-view v-else :orderDetails="orderDetails" :sellerDetails="sellerDetails" />
    <!-- page loader -->
    
    <!-- Modal for dialog messages -->
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
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "CheckoutPage",
  components: { Modal },
  data: function () {
    return {
      model: null,
      selectedImg: "",
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      orderDetails: {
        delivery_location: {},
        customer: {},
        product_description: "",
      },
      sellerDetails: {},
      pageLoader: false,
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("OpenOrder_id");
    this.$store
      .dispatch("orders/getOpenSellingById", {
        id: orderId,
      })
      .then((response) => {
        if (response.data.data.payment_status === "PAID") {
          this.$router.push({
            path: `/openOrder-status?OpenOrder_id=${orderId}`,
          });
        } else {
          this.orderDetails = response.data.data;
          this.orderDetails.other_images.push(
            this.orderDetails.product_image_url
          );
          this.getSellerDetails(this.orderDetails.seller_id);
        }
      })
      .catch((error) => {
        this.pageLoader = false;
        this.statusImage = failedImage;
        this.dialog = true;
        if (error.status == 422 || error.status == 400) {
          this.dialogMessage = error.data.message;
        } else if (error.status == 404) {
          this.dialogMessage = "404 not found";
        } else if (error.status == 500) {
          this.dialogMessage = "Something went wrong, please try again";
        } else if (!navigator.onLine) {
          this.dialogMessage = "No internet connection!";
        } else {
          this.dialogMessage = error.message;
        }
      });
  },
  methods: {
    selectByImage(params) {
      this.selectedImg = this.orderDetails.other_images.find(
        (item) => item == params
      );
    },
    getSellerDetails(seller_id) {
      this.$store
        .dispatch("onboarding/getSellerDetails", {
          id: seller_id,
        })
        .then((response) => {
          this.sellerDetails = response.data.data;
          this.pageLoader = false;
        })
        .catch((error) => {
          this.pageLoader = false;
          this.statusImage = failedImage;
          this.dialog = true;
          if (error.status == 422 || error.status == 400) {
            this.dialogMessage = error.data.message;
          } else if (error.status === 404) {
            this.dialogMessage = "404 not found";
          } else if (error.status === 500) {
            this.dialogMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.dialogMessage = "No internet connection!";
          } else {
            this.dialogMessage = error.message;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.checkout-page {
  &__header {
    position: sticky;
    height: 80px;
    border-bottom: 1px solid rgba(43, 43, 43, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    z-index: 3;
    background: var(--v-white-base);
    padding: 20px 9% 0px 9%;
    &__logo {
      width: 100px;
      img {
        width: 100%;
      }
    }
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
