<template>
  <div class="customer-details">
    <div
      class="d-flex align-center justify-center mb-8"
      style="position: relative"
    >
      <!-- go to previous page -->
      <router-link
        :to="{
          path: `/inventory/cart`,
        }"
        style="text-decoration: none"
      >
        <span class="back-btn">
          <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
        </span>
      </router-link>
      <!-- title -->
      <h3 class="align-self-center">Customer Details</h3>
    </div>

    <!-- form section -->
    <v-form class="d-flex justify-space-between flex-wrap" ref="form">
      <!-- name field -->
      <div class="mb-5 input-field">
        <p class="mb-1">Name*</p>
        <v-text-field
          color="primary"
          placeholder="Customer's full name"
          v-model="name"
          :rules="nameRules"
          @keyup.enter="$refs.input2.focus"
          required
        >
        </v-text-field>
      </div>
      <!-- phone number field -->
      <div class="mb-5 input-field phone-field">
        <p class="mb-1">
          Phone Number*
          <span class="primary--text"
            >(Ensure that this phone number is reachable at all times)</span
          >
        </p>
        <span class="primary--text phone-format">+234</span>
        <v-text-field
          color="primary"
          placeholder="Customer's mobile phone number"
          v-model="phoneNumber"
          :rules="phoneNumberRules"
          type="telephone"
          ref="input2"
          @keyup.enter="$refs.input3.focus"
          required
        >
        </v-text-field>
      </div>
      <!-- Email -->
      <div class="mb-5 input-field">
        <p class="mb-1">Email (optional)</p>
        <v-text-field
          color="primary"
          placeholder="Customer's email address"
          v-model="email"
          :rules="emailRules"
          ref="input3"
          @keyup.enter="$refs.autocomplete.focus"
          required
        >
        </v-text-field>
      </div>
      <!-- Address field -->
      <div class="mb-5 input-field">
        <p class="mb-1">
          Address*
          <span class="primary--text"
            >(Delivery location are Lagos, Abuja, Rivers, Oyo, Kwara, Ogun and
            Ondo only)</span
          >
        </p>
        <v-text-field
          color="primary"
          placeholder="Street address"
          v-model="address"
          :rules="addressRules"
          ref="autocomplete"
          id="autocomplete"
          @keyup.enter="submitCustomerDetails()"
          required
        >
        </v-text-field>
      </div>

      <!-- <div> -->
      <v-btn
        depressed
        class="primary"
        :loading="loading"
        :disabled="loading"
        @click="submitCustomerDetails()"
        >Submit</v-btn
      >
      <!-- </div> -->
    </v-form>
    <!-- link container -->
    <Modal persistent :dialog="showLink" transition="dialog-bottom-transition">
      <template>
        <v-card class="rounded-t-xl rounded-b-0 position-modal">
          <v-card-text>
            <p class="mt-8">Complete Sale</p>
            <p
              class="mb-4 secondary--text"
              style="font-size: 14px; color: #979797"
            >
              Kindly share the link below with your customer to make payment
            </p>
          </v-card-text>
          <div class="link py-3 px-2">
            <img src="@/assets/icons/link.svg" alt="" />
            <span
              class="text-truncate"
              style="cursor: pointer; height: 25px; overflow: hidden"
              v-on:click="copyToClipBoard"
              >{{ url }}</span
            >
            <span style="position: relative">
              <v-icon class="ml-5 copy-btn" v-on:click="copyToClipBoard"
                >mdi-content-copy</v-icon
              >
              <span
                v-show="copyStatus"
                class="copy-status primary--text py-1 px-2"
                >Copied</span
              >
            </span>
          </div>
          <v-card-actions class="mt-5 justify-center">
            <div class="container">
              <div class="row">
                <!-- <div class="col-lg-4"></div> -->
                <div class="col-6">
                  <v-btn
                    color="#E7FAF9"
                    block
                    class="primary--text elevation-0"
                    v-on:click="copyToClipBoard"
                    >Copy link
                  </v-btn>
                </div>
                <div class="col-6">
                  <v-btn
                    block
                    class="primary elevation-0"
                    @click="shareDialog = true"
                    >Share Link</v-btn
                  >
                </div>
              </div>
            </div>
          </v-card-actions>
          <v-card-actions class="justify-center mb-5">
            <router-link :to="{ name: 'InventoryHome' }">
              <v-btn text color="primary">Continue selling</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </template>
    </Modal>
    <!-- Modal for dialog messages -->
    <Modal :dialog="shareDialog" width="250">
      <div class="white pa-3 pb-5 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="shareDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="d-flex align-center justify-space-between px-8">
          <whats-app
            class="mt-3 mr-3"
            :url="url"
            :title="``"
            scale="2"
          ></whats-app>
          <twitter class="mt-3 mr-3" :url="url" :title="``" scale="2"></twitter>
          <facebook
            class="mt-3 mr-3"
            :url="url"
            scale="2"
            :title="``"
          ></facebook>
        </div>
        <p class="mt-4 mb-0 secondary--text">
          Share products with customers on social media
        </p>
      </div>
    </Modal>
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
import { Facebook } from "vue-socialmedia-share";
import { Twitter } from "vue-socialmedia-share";
import { WhatsApp } from "vue-socialmedia-share";
import { searchKeyInObject, search } from "@/helpers/general.js";
export default {
  name: "CustomerDetailsForm",
  components: { Modal, Facebook, Twitter, WhatsApp },
  data: function () {
    return {
      showLink: false,
      copyStatus: false,
      shareDialog: false,
      loading: false,
      url: "",
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      lat: "",
      lng: "",
      validAddress: false,
      state: null,
      stateKey: null,
      allowedLocation: {
        LAGOS: "Lagos",
        ABUJA: "Federal Capital Territory",
        RIVERS: "Rivers",
        OYO: "Oyo",
        KWARA: "Kwara",
        ONDO: "Ondo",
        OGUN: "Ogun State",
      },
      autocomplete: "",
      nameRules: [
        (v) => !!v || "Name is required", // verifies name satisfies the requirement
      ],
      emailRules: [
        // verifies email address satisfies the requirement
        (v) => v.length == 0 || /.+@.+\..+/.test(v) || "Invalid email",
      ],
      phoneNumberRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "This field is required",
        (v) => v.substring(0, 1) != 0 || "Phone number cannot begin with 0",
        (v) => v.length > 9 || "Number should 10 digits or more",
        (v) => v.length < 11 || "Maximum 11 digits or more",
      ],
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
    getAddress() {
      return {
        address: "",
      };
    },
  },
  methods: {
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
    submitCustomerDetails() {
      this.$refs.form.validate();
      if (this.$refs.form.validate() && this.validAddress) {
        this.loading = true;
        let getUrl = window.location;
        let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
        this.$store
          .dispatch("orders/createOrder", {
            customer: {
              name: this.name,
              email:
                this.email == "" || this.email == null ? undefined : this.email,
              phone:
                this.phoneNumber.substring(0, 1) == "0"
                  ? "+234" + this.phoneNumber.substring(1)
                  : "+234" + this.phoneNumber,
              location: {
                address: this.address,
                lat: this.lat,
                lng: this.lng,
                state: this.stateKey,
              },
            },
            payment_link: `${baseUrl}checkout-details`,
          })
          .then((response) => {
            this.loading = false;
            this.url = response.data.data.payment_link;
            this.showLink = true;
            this.$store.commit("orders/setTotalNumberOfProductsInCart", 0);
          })
          .catch((error) => {
            this.loading = false;
            if (error.status === 422) {
              this.statusImage = failedImage;
              this.dialog = true;
              this.dialogMessage = error.data.customer;
            } else if (error.status === 400) {
              this.statusImage = failedImage;
              this.dialog = true;
              this.dialogMessage = error.data.message;
            }
          });
      }
    },
    copyToClipBoard() {
      navigator.clipboard.writeText(this.url);
      this.copyStatus = true;
      setTimeout(() => {
        this.copyStatus = false;
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "CustomerDetailsForm.scss";
</style>