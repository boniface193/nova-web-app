<template>
  <div>
    <div class="payment-page pb-8 px-8">
      <div class="d-flex align-baseline justify-space-between">
        <h3>Address Details</h3>
        <!-- change address -->
        <p
          class="primary--text"
          style="font-size: 12px; cursor: Pointer"
          @click="openEditAddressModal"
        >
          Change Address
        </p>
      </div>
      <div class="mt-2">
        <div class="mb-4">
          <h4>{{ pageDetails.orderDetails.customer.name }}</h4>
          <p class="secondary--text mb-0">
            {{ deliveryLocation }}<br />{{
              pageDetails.orderDetails.customer.phone
            }}
          </p>
        </div>
        <!-- delivery method  -->
        <div class="mb-0">
          <h4>Select a delivery method:</h4>
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
            <v-radio
              class="primary--text mb-0"
              :label="`Standard Delivery (₦${standardDeliveryFee})`"
              value="standard"
            ></v-radio>
            <span class="ml-8 mb-0 primary--text"
              >Item would be delivered within 3 working days</span
            >
          </v-radio-group>
        </div>
        <!-- shipping details -->
        <div class="mb-4">
          <h4>Order Details</h4>
          <p class="secondary--text mb-0">
            <span style="font-weight: 600; color: black"
              >{{ pageDetails.orderDetails.total_items }}
            </span>
            <span class="mx-2">X</span>
            <span> {{ pageDetails.orderDetails.product_name }}</span>
          </p>
        </div>
        <!-- payment summary -->
        <div class="mb-3 summary-container">
          <h4 class="mb-1">Summary</h4>
          <div class="d-flex align-center justify-space-between mb-2">
            <p class="secondary--text mb-0">Item</p>
            <h4>&#8358;{{ pageDetails.orderDetails.subtotal_label }}</h4>
          </div>
          <!-- <div class="d-flex align-center justify-space-between mb-2">
            <p class="secondary--text mb-0">VAT (7.5%)</p>
            <h4>&#8358;{{ orderDetails.vat_label }}</h4>
          </div> -->
          <div class="d-flex align-center justify-space-between mb-2">
            <p class="secondary--text mb-0">Shipping fee</p>
            <h4>&#8358;{{ deliveryFee }}</h4>
          </div>
          <div class="d-flex align-center justify-space-between mb-2 mt-2">
            <h3 class="mb-0">Total</h3>
            <h3 class="primary--text">&#8358;{{ totalPrice }}</h3>
          </div>
          <!-- payment btn -->
          <v-btn
            class="primary py-3 mt-5"
            :loading="processingLoader"
            :disabled="processingLoader"
            @click="payForItem"
            >Pay now</v-btn
          >
        </div>
      </div>
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

    <!-- edit address modal -->
    <div class="white pa-3 px-5 edit-address-dialog" v-show="editAddressDialog">
      <div>
        <div class="d-flex justify-end">
          <v-icon
            class="error--text close-btn"
            @click="editAddressDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <!-- description -->
        <h3 class="mt-5">Change your delivery location</h3>
        <v-form ref="addressForm">
          <!-- Address field -->
          <div class="my-5">
            <p class="mb-1">Enter your delivery address *</p>
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
    </div>
  </div>
</template>
<script>
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "DeliveryPage",
  components: {
    modal,
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
    this.autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(6.5244, 3.3792)
        ),
        componentRestrictions: { country: ["NG"] },
        fields: ["geometry", "name", "formatted_address"],
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
        callback: this.makePaymentCallback,
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
      const orderId = params.get("order_id");
      this.$store
        .dispatch("orders/payForOrder", {
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
          if (error.response) {
            this.dialogMessage = "Sorry, this order does not Exist";
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
    payViaService() {
      this.payWithFlutterwave(this.paymentOption);
    },
    makePaymentCallback(response) {
      this.verifyPayment(response);
    },
    verifyPayment(value) {
      this.$store
        .dispatch("orders/verifyPayment", {
          ref: value.tx_ref,
          id: value.transaction_id,
          orderId: this.pageDetails.orderDetails.id,
        })
        .then(() => {
          this.$router.push({
            path: `/payment-success?order_id=${this.pageDetails.orderDetails.id}`,
          });
          location.reload();
        })
        .catch((error) => {
          if (error.response) {
            this.$router.push({
              path: `/payment-failed?order_id=${this.paymentDetails.orderDetails.id}`,
            });
          } else {
            this.dialog = true;
            this.dialogMessage = "No internet Connection!";
            this.statusImage = failedImage;
          }
        });
    },
    closedPaymentModal() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");
      this.$router.push({
        path: `/payment-details?order_id=${orderId}`,
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
    changeOrderAddressOrDeliveryMethod() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");
      this.$store
        .dispatch("orders/editOrderAddress", {
          customer: {
            location: {
              address: this.address,
              lat: this.lat,
              lng: this.lng,
            },
          },
          order_id: orderId,
          delivery_method: this.deliveryMethod,
        })
        .then((response) => {
          this.editLoader = false;
          this.editAddressDialog = false;
          this.deliveryLocation = response.data.data.delivery_location.address;
          this.deliveryFee = response.data.data.delivery_fee_label;
          this.totalPrice = response.data.data.total_price_label;
          this.expressDeliveryFee = response.data.data.express_delivery_fee_label;
        })
        .catch((error) => {
          this.dialog = true;
          this.editLoader = false;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = error.response.data.message;
          } else {
            this.dialogMessage = "No internet Connection!";
          }
        });
    },
    onPlaceChanged() {
      let place = this.autocomplete.getPlace();
      if (!place.geometry) {
        // User did not select a prediction; reset the input field
        this.validAddress = false;
      } else {
        //Display details about the valid place
        this.validAddress = true;
        this.address = place.name + " " + place.formatted_address;
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
      }
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