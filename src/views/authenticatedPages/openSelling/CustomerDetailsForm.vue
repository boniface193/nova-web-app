<template>
  <div>
    <div
      class="d-flex align-center justify-center mb-8"
      style="position: relative"
    >
      <!-- go to previous page -->
      
        <span class="back-btn" style="cursor: pointer;" @click="$router.back()">
          <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
        </span>
      
      <!-- title -->
      <h3 class="align-self-center">Customer Details</h3>
    </div>

    <!-- form section -->
    <v-form class="d-flex justify-space-between flex-wrap" ref="form">
      <v-row>
        <v-col lg="6" offset-lg="3" cols="" class="py-0">
          <!-- name field -->
          <div class="mb-5 input-field">
            <p class="mb-1">Name*</p>
            <v-text-field
              outlined
              dense
              color="primary"
              placeholder="Customer's full name"
              v-model="name"
              :rules="nameRules"
              @keyup.enter="$refs.input2.focus"
              required
            >
            </v-text-field>
          </div>
        </v-col>
        <v-col lg="6" offset-lg="3" cols="" class="py-0">
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
              outlined
              dense
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
        </v-col>
        <v-col lg="6" offset-lg="3" cols="" class="py-0">
          <!-- Email -->
          <div class="mb-5 input-field">
            <p class="mb-1">Email*</p>
            <v-text-field
              outlined
              dense
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
        </v-col>
        <v-col lg="6" offset-lg="3" cols="" class="py-0">
          <!-- Address field -->
          <div class="mb-5 input-field">
            <p class="mb-1">
              Address*
              <span class="primary--text">(Delivery locations are lagos, Abuja, Rivers, Oyo, ondo andkwara only)</span>
            </p>
            <v-text-field
              outlined
              dense
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
        </v-col>
        <v-col lg="6" offset-lg="3" cols="" class="py-0">
          <v-btn
            depressed
            class="primary"
            :loading="loading"
            :disabled="loading"
            @click="submitCustomerDetails"
            >Sell</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <!-- link container -->
    <Modal persistent :dialog="showLink" transition="dialog-bottom-transition">
      <template>
        <v-card class="rounded-t-xl rounded-b-0 position-modal">
          <v-card-text>
            <p
              class="mt-8"
              style="
                font-family: 'Product Sans' Medium;
                font-style: normal;
                font-weight: 500;
                font-size: 20px;
                line-height: 24px;
                color: #2b2b2b;
              "
            >
              Complete Sale
            </p>
            <p
              class="mb-4 secondary--text"
              style="font-size: 14px; color: #979797"
            >
              Kindly Share the link below with your customer to make payment
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
            <v-btn
              text
              color="primary"
              style="
                font-family: 'Product Sans';
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
              "
              @click="returnHome"
              >Return to home</v-btn
            >
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
import { Facebook } from "vue-socialmedia-share";
import { Twitter } from "vue-socialmedia-share";
import { WhatsApp } from "vue-socialmedia-share";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "CustomerDetailsForm",
  components: { Modal, Facebook, Twitter, WhatsApp },
  data: function () {
    return {
      loading: false,
      copyStatus: false,
      statusImage: null,
      url: "",
      showLink: false,
      shareDialog: false,
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
        OGUN: "Ogun"
      },
      autocomplete: "",
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
        (v) => !!v || "This field is required",
        (v) => v.substring(0, 1) != 0 || "Phone number cannot begin with 0",
        (v) => v.length > 9 || "Number should 10 digits or more",
        (v) => v.length < 11 || "Maximum 11 digits or more",
      ],
      addressRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Address is required",
        () => this.validAddress || "please select a location that we deliver to",
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
    this.showDialog();
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
        this.state = this.search(
          "administrative_area_level_1",
          place.address_components
        ).long_name;
        this.checkLocation();
      }
    },
    checkLocation() {
      this.validAddress = false
      for (let key in this.allowedLocation){
        if(this.allowedLocation[key] === this.state){
          this.validAddress = true;
          this.stateKey = key;
        }
      }
    },
    search(nameKey, myArray) {
      for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].types[0] === nameKey) {
          return myArray[i];
        }
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
        let imageURL = JSON.parse(urlQuery.pimg);
        let returnedImgArr = JSON.parse(urlQuery.pimg);
        returnedImgArr.shift();
        let removeImgArr = returnedImgArr.map((item) => {
          return item["image"];
        });
        let latitude = parseFloat(urlQuery.pickupLat, 10);
        let longitude = parseFloat(urlQuery.pickupLong, 10);
        let checkPickUpNum =
          urlQuery.pickupNum.substring(0, 1) == "0"
            ? "+234" + urlQuery.pickupNum.substring(1)
            : "+234" + urlQuery.pickupNum;
        let checkvehicle = urlQuery.carriage.includes("\n")
          ? urlQuery.carriage.replace(/(\r\n|\n|\r)/gm, "")
          : urlQuery.carriage;
        let checkProductPrice = urlQuery.pp.includes("\n")
          ? urlQuery.pp.replace(/(\r\n|\n|\r)/gm, "")
          : urlQuery.pp;
        let checkPickupName = urlQuery.pickupName.includes("\n")
          ? urlQuery.pickupName.replace(/(\r\n|\n|\r)/gm, "")
          : urlQuery.pickupName;
        let trimWhiteSpace = checkPickUpNum.includes("\n")
          ? checkPickUpNum.replace(/(\r\n|\n|\r)/gm, "")
          : checkPickUpNum;
        const createOpenInventory = {
          customer_name: this.name,
          customer_email: this.email,
          customer_phone:
            this.phoneNumber.substring(0, 1) == "0"
              ? "+234" + this.phoneNumber.substring(1)
              : "+234" + this.phoneNumber,
          delivery_location: {
            address: this.address,
            lng: this.lng,
            lat: this.lat,
          },
          payment_link: `${baseUrl}openSellingCheckout-details`,
          product_name: urlQuery.pname,
          product_description: urlQuery.pdis,
          product_image_url: imageURL[0].image,
          product_price: checkProductPrice.includes(" ")
            ? checkProductPrice.trim()
            : checkProductPrice,
          total_items: urlQuery.qty,
          other_images: removeImgArr,
          pickup_name: checkPickupName.includes(" ")
            ? checkPickupName.trim()
            : checkPickupName,
          vehicle_type: checkvehicle.includes(" ")
            ? checkvehicle.trim()
            : checkvehicle,
          pickup_phone: trimWhiteSpace.includes(" ")
            ? trimWhiteSpace.trim()
            : trimWhiteSpace,
          pickup_location: {
            address: urlQuery.pickupAdd,
            lng: longitude,
            lat: latitude,
          },
        };
        this.$store
          .dispatch("orders/createOpenSelling", createOpenInventory)
          .then((response) => {
            this.loading = false;
            const url = response.data.data.payment_link;
            this.$router.push({
              path: `/openSelling/customer-form?createLink=true&link=${encodeURIComponent(
                url
              )}`,
            });
            this.createLink();
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
      this.returnHome();
      setTimeout(() => {
        this.copyStatus = false;
      }, 1000);
    },

    removeHttp(url) {
      return url.replace(/(^\w+:|^)\/\//, "");
    },

    createLink() {
      const params = new URLSearchParams(window.location.search);
      const link = new URLSearchParams(
        decodeURIComponent(window.location.search)
      );

      if (params.get("createLink")) {
        localStorage.setItem("url", link.get("link"));
        this.showDialog();
      } else {
        this.url = "";
        this.showLink = false;
        localStorage.removeItem("url");
      }
    },

    showDialog() {
      if (localStorage.getItem("url")) {
        this.url = localStorage.getItem("url");
        this.showLink = true;
        this.loading = true;
      }
    },

    returnHome() {
      this.$router.push({
        path: "/openSelling",
      });

      localStorage.removeItem("url");
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
  height: 48px;
  border-radius: 8px;
  font-family: "Product Sans Regular";
  font-size: 16px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.phone-format {
  position: absolute;
  margin-top: 10px;
  margin-left: 10px;
}

.link {
  margin: auto 20px;
  color: #029b97;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #029b97;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  img {
    margin-right: 10px;
  }
  .copy-btn {
    cursor: pointer;
    &:hover {
      color: #03a09b;
    }
  }
  .copy-status {
    position: absolute;
    bottom: 100%;
    background: #e0e7ff;
    word-break: none;
    width: 90px;
    right: 0;
    border-radius: 8px;
  }
}

@media (min-width: 751px) {
  .position-modal {
    position: absolute;
    bottom: 30%;
    width: 40%;
    left: 30%;
    border-radius: 8px !important;
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
    width: 100%;
  }
  .position-modal {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
}
</style>
<style lang="scss">
.phone-field
  > .v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot {
  padding-left: 40px;
}
.phone-field > .v-input .v-label {
  padding-left: 40px;
}
</style>