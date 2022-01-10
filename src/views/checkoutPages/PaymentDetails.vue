<template>
  <div class="checkout-page__payment">
    <div class="checkout-page__payment__header">
      <!-- back button -->
      <div
        class="secondary--text d-flex align-center"
        style="cursor: pointer"
        @click="routeToCheckoutDetails()"
      >
        <v-icon class="secondary--text mr-1" style="font-size: 20px"
          >mdi-arrow-left</v-icon
        >
        <span>Back</span>
      </div>
    </div>
    <div class="checkout-page__payment__content">
      <div class="checkout-page__payment__content__left">
        <!-- change address -->
        <div class="d-flex align-baseline justify-space-between mb-3">
          <h3>ADDRESS DETAILS</h3>
          <h3
            class="primary--text"
            style="cursor: pointer"
            @click="openEditAddressModal()"
          >
            CHANGE
          </h3>
        </div>

        <!-- edit address -->
        <div
          class="py-3 px-4 mb-3 text-center dialog"
          v-show="editAddressDialog"
          style="border: 1px solid rgba(43, 43, 43, 0.1); border-radius: 8px"
        >
          <div class="d-flex justify-end">
            <v-icon class="error--text" @click="editAddressDialog = false"
              >mdi-close</v-icon
            >
          </div>
          <!-- description -->
          <h4 style="font-weight: normal" class="mt-5 text-left">
            Change your delivery location
            <span class="primary--text"
              >(Delivery locations are lagos, Abuja, Rivers, Oyo, ondo and kwara
              only)</span
            >
          </h4>
          <v-form ref="addressForm">
            <!-- Address field -->
            <div class="my-5">
              <v-text-field
                color="primary"
                placeholder="Street address"
                v-model="address"
                :rules="addressRules"
                ref="autocomplete"
                id="autocomplete"
                required
              >
              </v-text-field>
              <v-text-field style="display: none"></v-text-field>
            </div>
          </v-form>
          <!-- edit address btn -->
          <v-btn
            class="primary"
            :loading="editLoader"
            :disabled="editLoader"
            @click="editOrderAddress()"
            >Update</v-btn
          >
        </div>

        <h3>{{ orderDetailsPayment.customer_name }}</h3>
        <p class="small-font-size">
          {{ orderDetailsPayment.delivery_location.address }}<br />{{
            orderDetailsPayment.customer_phone
          }}
        </p>
        <p></p>

        <h3 class="mb-1">DELIVERY METHOD</h3>
        <h4>Select a delivery method</h4>
        <v-radio-group
          v-model="orderDetailsPayment.delivery_method"
          class="mt-1"
          @change="changeDeliveryMethod()"
        >
          <v-radio
            class="primary--text mb-0"
            :label="`Express Delivery (₦${orderDetailsPayment.delivery_fee})`"
            value="express"
          ></v-radio>
          <span class="ml-8 mb-4 primary--text"
            >Item would be delivered within 24hrs</span
          >
          <v-radio
            class="primary--text mb-0"
            :label="`Standard Delivery`"
            value="standard"
            disabled
          ></v-radio>
          <span class="ml-8 mb-0 primary--text"
            >Item would be delivered within 3 working days<span
              class="secondary--text"
              >(Coming soon)</span
            ></span
          >
        </v-radio-group>
      </div>

      <div class="checkout-page__payment__content__right">
        <h3 class="mb-3">ORDER DETAILS</h3>

        <p
          class="d-flex justify-space-between mb-2"
          v-for="(item, index) in orderDetailsPayment.cart_items"
          :key="index"
        >
          <span>
            <span class="font-weight-bold mr-4">{{ item.quantity }}X</span>
            <span class="secondary--text">{{ item.product.name }}</span>
          </span>

          <span class="primary--text">&#8358;{{ item.total_cost_label }}</span>
        </p>

        <h3 class="mb-3 mt-4">SUMMARY</h3>
        <p class="d-flex justify-space-between mb-2">
          <span class="secondary--text">Subtotal</span>
          <span>&#8358;{{ orderDetailsPayment.sub_total_label }}</span>
        </p>
        <p class="d-flex justify-space-between mb-2">
          <span class="secondary--text">Shipping Fee</span>
          <span>&#8358;{{ orderDetailsPayment.delivery_fee }}</span>
        </p>

        <h3 class="d-flex justify-space-between mb-2">
          <span>Total</span>
          <span class="primary--text"
            >&#8358;{{ orderDetailsPayment.total_label }}</span
          >
        </h3>
        <!-- payment btn -->
        <v-btn
          width="200"
          class="primary py-3 mt-5"
          :loading="loading"
          :disabled="loading"
          @click="payForItem"
          >Pay now</v-btn
        >
      </div>
    </div>
    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center">
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
import { searchKeyInObject, search } from "@/helpers/general.js";
export default {
  name: "PaymentDetails",
  props: ["orderDetails"],
  components: { Modal },
  data: function () {
    return {
      loading: false,
      dialog: false,
      editAddressDialog: false,
      statusImage: null,
      dialogMessage: "",
      editLoader: false,
      paymentDetails: {
        amount: "",
        customer: {
          name: "",
          email: "",
          phone: null,
        },
      },
      orderDetailsPayment: this.orderDetails,
      lat: this.orderDetails.delivery_location.lat,
      lng: this.orderDetails.delivery_location.lng,
      address: this.orderDetails.delivery_location.address,
      validAddress: false,
      state: null,
      stateKey: null,
      allowedLocation: {
        LAGOS: "Lagos",
        ABUJA: "Federal Capital Territory",
        //RIVERS: "Rivers",
        //OYO: "Oyo",
        //KWARA: "Kwara",
        //ONDO: "Ondo",
        //OGUN: "Ogun State",
      },
      autocomplete: "",
      addressRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Address is required",
        () =>
          this.validAddress || "please select a location that we deliver to",
      ],
    };
  },
  mounted() {
    this.autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(6.5244, 3.3792)
        ),
        componentRestrictions: { country: ["NG"] },
        fields: ["geometry", "name", "formatted_address", "address_components"],
      }
    );

    this.autocomplete.addListener("place_changed", this.onPlaceChanged);
  },
  computed: {
    paymentOption() {
      return {
        public_key: this.paymentDetails.public_key,
        tx_ref: this.paymentDetails.tx_ref,
        amount: this.paymentDetails.amount,
        currency: this.paymentDetails.currency,
        payment_options: this.paymentDetails.payment_options,
        redirect_url: "",
        customer: {
          name: this.paymentDetails.customer.name,
          email: this.paymentDetails.customer.email,
          phone_number: this.paymentDetails.customer.phone,
        },
        callback: this.confirmPaymentStatus,
        onclose: this.closedPaymentModal,
      };
    },
  },
  methods: {
    openEditAddressModal() {
      this.editAddressDialog = true;
    },
    changeDeliveryMethod() {
      this.changeOrderAddressOrDeliveryMethod();
    },
    editOrderAddress() {
      this.$refs.addressForm.validate();
      if (this.$refs.addressForm.validate() && this.validAddress) {
        this.editLoader = true;
        this.changeOrderAddressOrDeliveryMethod();
      }
    },
    changeOrderAddressOrDeliveryMethod() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$store
        .dispatch("orders/editOrderAddress", {
          customer: {
            location: {
              address: this.address,
              lat: this.lat,
              lng: this.lng,
              state: this.stateKey
            },
          },
          order_id: orderId,
          delivery_method: this.deliveryMethod,
        })
        .then((response) => {
          this.editLoader = false;
          this.editAddressDialog = false;
          this.orderDetailsPayment.delivery_location.address =
            response.data.data.delivery_location.address;
          this.orderDetailsPayment.delivery_fee =
            response.data.data.delivery_fee;
          this.orderDetailsPayment.total_label = response.data.data.total_label;
        })
        .catch((error) => {
          this.dialog = true;
          this.editLoader = false;
          this.statusImage = failedImage;
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
    payForItem() {
      this.loading = true;
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$store
        .dispatch("orders/payForOrder", {
          id: orderId,
        })
        .then((response) => {
          this.loading = false;
          this.paymentDetails = response.data.data;
          this.payViaService();
        })
        .catch((error) => {
          this.dialog = true;
          this.loading = false;
          this.statusImage = failedImage;
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
    payViaService() {
      this.payWithFlutterwave(this.paymentOption);
    },
    confirmPaymentStatus(response) {
      if (response.status == "successful") {
        this.$router.push({
          path: `/payment-success?session_id=${this.orderDetailsPayment.id}`,
        });
        location.reload();
      } else {
        this.$router.push({
          path: `/payment-failed?session_id=${this.orderDetailsPayment.id}`,
        });
      }
    },
    closedPaymentModal() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$router.push({
        path: `/payment-details?session_id=${orderId}`,
      });
      window.location.reload();
    },
    onPlaceChanged() {
      let place = this.autocomplete.getPlace();
      if (!place.geometry) {
        // User did not select a prediction; reset the input field
        this.validAddress = false;
      } else {
        //Display details about the valid place
        this.address = place.name + " " + place.formatted_address;
        this.validAddress = true;
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.state = search(
          "administrative_area_level_1",
          place.address_components
        ).long_name;
        let locationDetails = searchKeyInObject(
          this.state,
          this.allowedLocation
        );
        this.validAddress = locationDetails.status;
        this.stateKey = locationDetails.key;
      }
    },
    routeToCheckoutDetails() {
      this.$router.push({
        path: `/checkout-details?session_id=${this.orderDetailsPayment.id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.checkout-page__payment {
  padding: 30px 9%;
  &__header {
  }
  &__content {
    padding: 30px 0px;
    display: flex;
    flex-wrap: wrap;
    &__left {
      width: 50%;
      padding-right: 25px;
    }
    &__right {
      width: 50%;
      padding-left: 25px;
    }
  }
}
.small-font-size {
  font-size: 14px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 959px) {
  .checkout-page__payment {
    padding: 20px 5%;
    &__content {
      &__left {
        width: 100%;
        padding-right: 0px;
      }
      &__right {
        width: 100%;
        padding-left: 0px;
      }
    }
  }
}
</style>