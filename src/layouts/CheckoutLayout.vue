<template>
  <div class="checkout-page">
    <!-- checkout header section -->
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
              `api.whatsapp.com/send?text=Hello my name is ${orderDetails.customer_name}&phone=${sellerDetails.phone_number}`
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
    <!-- route views -->
    <div v-if="!pageLoader">
      <router-view
        :orderDetails="orderDetails"
        :sellerDetails="sellerDetails"
      />
    </div>

    <!-- page loader -->
    <div class="d-flex py-5 text-center" v-if="pageLoader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>
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
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      orderDetails: {
        delivery_location: {},
        customer: {},
        cart_items: [{product: {}, variants: []}]
      },
      pageLoader: false,
      sellerDetails: {},
    };
  },
  created() {
    this.pageLoader = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("session_id");
    this.$store
      .dispatch("orders/getOrderDetailsForCustomer", {
        id: orderId,
      })
      .then((response) => {
        if (response.data.data.is_paid == true) {
          this.$router.push({
            path: `/order-status?session_id=${orderId}`,
          });
        } else {
          this.orderDetails = response.data.data;
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
          this.dialogMessage =
            "This Order is invalid, please confirm that you are using the right link";
        } else if (error.status == 500) {
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
          if (error.status == 422 || error.status == 400) {
            this.dialogMessage = error.data.message;
          } else if (error.status === 404) {
            this.dialogMessage = "404 not found";
          } else if (error.status === 500) {
            this.dialogMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.dialogMessage = "No internet connection!";
          }
        });
    },
    // getStoreDetails(store_id) {
    //   this.$store
    //     .dispatch("onboarding/getStoreDetails", {
    //       id: store_id,
    //     })
    //     .then((response) => {
    //       this.storeDetails = response.data.data;
    //       this.getSellerDetails(this.orderDetails.seller_id);
    //     })
    //     .catch((error) => {
    //       this.pageLoader = false;
    //       this.statusImage = failedImage;
    //       this.dialog = true;
    //       if (error.status == 422 || error.status == 400) {
    //         this.dialogMessage = error.data.message;
    //       } else if (error.status === 404) {
    //         this.dialogMessage = "404 not found";
    //       } else if (error.status === 500) {
    //         this.dialogMessage = "Something went wrong, please try again";
    //       } else if (!navigator.onLine) {
    //         this.dialogMessage = "No internet connection!";
    //       }
    //     });
    // },
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
    &__message-section {
    }
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 959px) {
  .checkout-page {
    &__header {
        padding: 10px 5% 0px 5%;
        height: 70px;
      }
  }
}
@media (max-width: 600px) {
  .seller-name{
    display: none
  }
}
</style>