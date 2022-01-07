<template>
  <div>
    <div class="" style="padding: 30px 9%">
      <div class="my-8">
        <span @click="$router.back()" style="cursor: pointer">
          <v-icon size="20" color="black">mdi-arrow-left</v-icon>
          back
        </span>
      </div>

      <v-row>
        <v-col sm="6" cols="">
          <div class="d-flex align-baseline justify-space-between">
            <h3 class="text-uppercase">Address Details</h3>
            <!-- change address -->
            <h3
              class="primary--text text-uppercase"
              style="cursor: Pointer"
              @click="openEditAddressModal"
            >
              Change
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
                >(Delivery locations are lagos, Abuja, Rivers, Oyo, ondo, kwara,
                and Ogun only)</span
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
                  ref="deliveryAddress"
                  id="deliveryAddress"
                  required
                >
                </v-text-field>
                <v-text-field style="display: none"></v-text-field>
              </div>
            </v-form>
            <!-- edit address btn -->
            <v-btn
              class="primary elevation-0"
              :loading="editLoader"
              :disabled="editLoader"
              @click="editOrderAddress()"
              >Update</v-btn
            >
          </div>
          <div class="my-4">
            <h3>{{ pageDetails.orderDetails.customer.name }}</h3>
            <p class="secondary--text mb-0">
              {{ deliveryLocation }}<br />{{
                pageDetails.orderDetails.customer.phone
              }}
            </p>
          </div>
          <!-- delivery method  -->
          <div>
            <h3 class="text-uppercase">delivery method:</h3>
            <h4 class="my-3">Select a delivery method</h4>
            <v-radio-group
              v-model="deliveryMethod"
              class="mt-1"
              @change="changeDeliveryMethod()"
            >
              <v-radio
                class="primary--text mb-0"
                :label="`Express Delivery (₦${expressDeliveryFee})`"
                value="express"
              ></v-radio>
              <span class="ml-8 mb-4 primary--text"
                >Item would be delivered within 24hrs</span
              >
            </v-radio-group>
          </div>
        </v-col>
        <v-col sm="6" cols="">
          <!-- shipping details -->
          <!-- <div class="mb-4">
            <h3 class="text-uppercase">Order Details</h3>
            <p class="secondary--text mb-0">
              <span style="font-weight: 600; color: black"
                >{{ pageDetails.orderDetails.total_product_price_label }}
              </span>
              <span class="mx-2">X</span>
              <span> {{ pageDetails.orderDetails.product_name }}</span>
            </p>
          </div> -->
          <!-- payment summary -->
          <div class="mb-3 summary-container">
            <h3 class="mb-1 text-uppercase">Summary</h3>
            <div class="d-flex align-center justify-space-between mb-2">
              <p class="secondary--text mb-0">Item</p>
              <h4>&#8358;{{ pageDetails.orderDetails.subtotal_label }}</h4>
            </div>
            <div class="d-flex align-center justify-space-between mb-2">
              <p class="secondary--text mb-0">Shipping fee</p>
              <h4>&#8358;{{ deliveryFee }}</h4>
            </div>
            <div class="d-flex align-center justify-space-between mb-2 mt-2">
              <h3 class="mb-0 text-uppercase">Total</h3>
              <h3 class="primary--text">&#8358;{{ totalPrice }}</h3>
            </div>
            <!-- payment btn -->
            <v-btn
              class="primary py-3 mt-5 elevation-0"
              :loading="processingLoader"
              :disabled="processingLoader"
              @click="payForItem"
              >Pay now</v-btn
            >
          </div>
        </v-col>
      </v-row>
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
import { searchKeyInObject, search } from "@/helpers/general.js";
export default {
  name: "DeliveryPage",
  components: {
    Modal,
  },
  props: ["productDetails", "orderDetails"],
  data: function () {
    return {
      deliveryMethod: this.orderDetails.delivery_method,
      expressDeliveryFee: this.orderDetails.express_delivery_fee_label,
      standardDeliveryFee: this.orderDetails.standard_delivery_fee_label,
      dialog: false,
      editAddressDialog: false,
      statusImage: null,
      dialogMessage: "",
      processingLoader: false,
      editLoader: false,
      deliveryLocation: this.orderDetails.delivery_location.address,
      deliveryFee: this.orderDetails.delivery_fee_label,
      totalPrice: this.orderDetails.total_price_label,
      paymentDetails: {
        amount: "",
        customer: {
          name: "",
          email: "",
          phone: null,
        },
      },
      lat: this.orderDetails.delivery_location.lat,
      lng: this.orderDetails.delivery_location.lng,
      address: this.orderDetails.delivery_location.address,
      allowedLocation: {
        LAGOS: "Lagos",
        ABUJA: "Federal Capital Territory",
        //RIVERS: "Rivers",
        //OYO: "Oyo",
        //KWARA: "Kwara",
        //OGUN: "Ogun State",
        //ONDO: "Ondo",
      },
      deliveryState: null,
      deliveryAddressAutocomplete: "",
      validAddress: false,
      autocomplete: "",
      addressRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Address is required",
        () => this.validAddress || "Select a valid Address",
      ],
    };
  },
  mounted() {
    let region = {
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(6.5244, 3.3792)
      ),
      componentRestrictions: { country: ["NG"] },
      fields: ["geometry", "name", "formatted_address", "address_components"],
    };

    this.deliveryAddressAutocomplete =
      new window.google.maps.places.Autocomplete(
        document.getElementById("deliveryAddress"),
        region
      );
    this.deliveryAddressAutocomplete.addListener("place_changed", () => {
      this.onPlaceChanged("delivery");
    });
    // this.autocomplete.addListener("place_changed", this.onPlaceChanged);
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
    pageDetails() {
      return {
        productDetails: this.productDetails,
        orderDetails: this.orderDetails,
      };
    },
  },
  methods: {
    payForItem() {
      this.processingLoader = true;
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$store
        .dispatch("orders/payForOpenSellingOrder", {
          id: orderId,
        })
        .then((response) => {
          this.processingLoader = false;
          this.paymentDetails = response.data.data;
          this.payViaService();
        })
        .catch((error) => {
          this.dialog = true;
          this.processingLoader = false;
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
    makePaymentCallback(response) {
      this.verifyPayment(response);
    },
    confirmPaymentStatus(response) {
      if (response.status == "successful") {
        this.$router.push({
          path: `/open-selling-payment-success?session_id=${this.pageDetails.orderDetails.id}`,
        });
        location.reload();
      } else {
        this.$router.push({
          path: `/open-selling-payment-failed?session_id=${this.paymentDetails.orderDetails.id}`,
        });
      }
    },
    closedPaymentModal() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("OpenOrder_id");
      this.$router.push({
        path: `/open-selling-checkout-details?session_id=${orderId}`,
      });
    },
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

    onPlaceChanged() {
      let place = this.deliveryAddressAutocomplete.getPlace();
      if (!place.geometry) {
        // User did not select a prediction; reset the input field
        this.validAddress = false;
      } else {
        //Display details about the valid place
        this.validAddress = true;
        this.address = place.name + " " + place.formatted_address;
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.deliveryState = search(
          "administrative_area_level_1",
          place.address_components
        ).long_name;
        let locationDetails = searchKeyInObject(
          this.deliveryState,
          this.allowedLocation
        );
        this.validDeliveryAddress = locationDetails.status;
        this.deliveryState = locationDetails.key;
      }
    },

    changeOrderAddressOrDeliveryMethod() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("session_id");
      this.$store
        .dispatch("orders/updateDeliveryLoationAndMethod", {
          customer: {
            location: {
              address: this.address,
              lat: this.lat,
              lng: this.lng,
              state: this.deliveryState,
            },
          },
          id: orderId,
          delivery_method: this.deliveryMethod,
        })
        .then((response) => {
          this.editLoader = false;
          this.editAddressDialog = false;
          this.deliveryLocation = response.data.data.delivery_location.address;
          this.deliveryFee = response.data.data.delivery_fee_label;
          this.totalPrice = response.data.data.total_price_label;
          this.expressDeliveryFee =
            response.data.data.express_delivery_fee_label;
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
  },
};
</script>
<style lang="scss" scoped>
.payment-page {
  width: 500px;
  margin: auto;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 40px;
  min-width: 200px;
  padding: 0 16px;
}
.flutterwave-btn {
  width: 150px;
  padding: 8px 0px;
  cursor: pointer;
  color: white;
  background: #029b97;
  border-radius: 5px;
  margin-top: 20px;
  display: none;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.edit-address-dialog {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 100%;
  position: sticky;
  bottom: 0;
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 100%;
    padding: 0 16px;
  }
}
@media (max-width: 1100px) {
  .payment-page {
    width: 400px;
  }
}
@media (max-width: 960px) {
  .payment-page {
    width: 550px;
  }
}
@media (max-width: 600px) {
  .payment-page {
    width: 100%;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 100%;
  }
}
</style>