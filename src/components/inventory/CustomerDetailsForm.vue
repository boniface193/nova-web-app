<template>
  <div class="px-2 px-md-7 customer-details">
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
      <div class="mb-5 input-field">
        <p class="mb-1">Phone Number*</p>
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
        <p class="mb-1">Email*</p>
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
          <span class="primary--text">(Delivery within lagos only)</span>
        </p>
        <v-text-field
          color="primary"
          placeholder="Street address"
          v-model="address"
          :rules="addressRules"
          ref="autocomplete"
          id="autocomplete"
          @keyup.enter="submitCustomerDetails"
          required
        >
        </v-text-field>
      </div>

      <div>
        <v-btn
          class="primary"
          :loading="loading"
          :disabled="loading"
          @click="submitCustomerDetails"
          >Submit</v-btn
        >
      </div>
    </v-form>
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
//import selectBtn from "@/components/general/selectBtn.vue";
import failedImage from "@/assets/images/failed-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "CustomerDetailsForm",
  components: { modal },
  data: function () {
    return {
      loading: false,
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
      autocomplete: "",
      variants: [],
      nameRules: [
        (v) => !!v || "Name is required", // verifies name satisfies the requirement
      ],
      emailRules: [
        // verifies email address satisfies the requirement
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      phoneNumberRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Phone Number is required",
      ],
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
  created() {
    // const routeParameter = new URLSearchParams(
    //   decodeURIComponent(window.location.search)
    // )
    console.log(
      this.convertQueryToObject(decodeURIComponent(window.location.search))
    );
  },
  computed: {
    getAddress() {
      return {
        address: "",
      };
    },
  },
  methods: {
    convertQueryToObject(querystring) {
      // parse query string
      const params = new URLSearchParams(querystring);

      const obj = {};

      // iterate over all keys
      for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
          obj[key] = params.getAll(key);
        } else {
          obj[key] = params.get(key);
        }
      }

      return obj;
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
      }
    },
    submitCustomerDetails() {
      this.$refs.form.validate();
      if (this.$refs.form.validate() && this.validAddress) {
        this.loading = true;
        let getUrl = window.location;
        let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";

        let urlQuery = this.convertQueryToObject(
          decodeURIComponent(window.location.search)
        );
        Object.keys(urlQuery).forEach((key) => {
          let variantItem = {};
          if (key !== "quantity" && key !== "profit") {
            variantItem.name = key;
            variantItem.value = urlQuery[`${key}`];
            this.variants.push(variantItem);
          }
        });
        this.$store
          .dispatch("orders/createOrder", {
            product_id: this.$route.params.id,
            customer: {
              name: this.name,
              email: this.email,
              phone: this.phoneNumber,
              location: {
                address: this.address,
                lat: this.lat,
                lng: this.lng,
              },
            },
            variants: this.variants,
            total_items: parseInt(urlQuery.quantity, 10),
            payment_link: `${baseUrl}checkout-details`,
            seller_profit: parseInt(urlQuery.profit, 10),
          })
          .then((response) => {
            this.loading = false;
            const url = response.data.meta.payment_link;
            this.$router.push({
              path: `/inventory/${
                this.$route.params.id
              }?createLink=true&link=${encodeURIComponent(url)}`,
              params: {
                id: this.$route.params.id,
              },
            });
          })
          .catch((error) => {
            this.dialog = true;
            this.loading = false;
            this.statusImage = failedImage;
            if (error.response) {
              this.dialogMessage = error.response.data.message;
            } else {
              this.dialogMessage = "No internet Connection!";
            }
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.customer-details {
  width: 50%;
}
.input-field {
  width: 100%;
}
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 150px;
  padding: 0 16px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 950px) {
  .customer-details {
    width: 100%;
  }
}
@media (max-width: 750px) {
  .input-field {
    width: 100%;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 100%;
  }
}
</style>