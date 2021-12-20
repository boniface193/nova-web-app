<template>
  <div>
    <div
      class="d-flex align-center justify-center mb-8"
      style="position: relative"
    >
      <!-- go to previous page -->

      <span class="back-btn" @click="$router.back()" style="cursor: pointer">
        <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
      </span>
      <!-- title -->
      <h3 class="align-self-center">Product Details</h3>
    </div>

    <p class="intro-head text-sm-center mb-lg-8">
      Please provide the following product details
    </p>
    <div class="mx-sm-14 mt-5">
      <v-form ref="form">
        <v-row>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <div>
              <label for="" class="text-field">Enter product name</label>
              <v-text-field
                v-model="productName"
                outlined
                dense
                placeholder="e.g. Segi Zobo"
                type="text"
                :rules="nameRules"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <div>
              <label for="" class="text-field">Enter product description</label>
              <v-textarea
                v-model="productDiscription"
                height="140"
                outlined
                dense
                type="text"
                placeholder="Enter a brief description about your product"
                :rules="nameRules"
                required
              ></v-textarea>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="pt-0">
            <imageUploader
              class="float-left mr-2"
              :class="collectImgUpload.length > 0 ? '' : 'mb-5'"
              @images="setImageUrl"
            />
            <v-sheet elevation="0" max-width="">
              <v-slide-group v-model="model" mandatory show-arrows>
                <v-slide-item
                  v-for="(item, index) in collectImgUpload"
                  :key="index"
                >
                  <v-card class="mx-6 elevation-0" outlined width="15%">
                    <v-icon
                      color="error"
                      size="15"
                      class="mt-2"
                      @click="removeImgFromArray(item)"
                      style="
                        cursor: pointer;
                        position: absolute;
                        z-index: 2;
                        right: 0%;
                      "
                      >mdi-close-circle</v-icon
                    >
                    <v-row class="fill-height">
                      <v-img :src="item.image" width="80" height="80" />
                    </v-row>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-sheet>
            <p class="error--text caption float-left" v-show="emptyImage">
              image field is required
            </p>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <div>
              <label for="" class="text-field"
                >How much are you selling this product?</label
              >
              <v-text-field
                outlined
                dense
                placeholder="e.g. 1000"
                type="number"
                v-model="productPrice"
                :rules="nameRules"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <div>
              <label for="" class="text-field">Quantity</label>
              <v-text-field
                outlined
                dense
                :rules="nameRules"
                placeholder="e.g. 10"
                type="number"
                v-model="quantity"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <div>
              <label for="" class="text-field">Pickup Name</label>
              <v-text-field
                outlined
                dense
                :rules="nameRules"
                placeholder="e.g. ikechukwu"
                type="text"
                v-model="pickupName"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <!-- phone number field -->
            <div class="input-field phone-field">
              <p class="text-field mb-1">
                Pickup Phone Number
                <span class="primary--text"
                  >(Ensure that this phone number is reachable at all
                  times)</span
                >
              </p>
              <span class="primary--text phone-format">+234</span>
              <v-text-field
                color="primary"
                dense
                outlined
                placeholder="e.g. 813471****"
                v-model="pickUpNumber"
                :rules="phoneNumberRules"
                type="tel"
                required
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <!-- transport field -->
            <div class="input-field">
              <p class="mb-1">Transport Method</p>

              <v-select
                dense
                :items="carriage"
                item-text="text"
                label="Select Carriage"
                outlined
                class="pa-0"
                :rules="nameRules"
                @change="selectedCarriage"
              >
                <template v-slot:selection="{ item }">
                  <span class="mr-4">{{ item.text }}</span>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>

                <template v-slot:item="{ item }">
                  <span class="mr-4">{{ item.text }}</span>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
              </v-select>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <!-- Address field -->
            <div class="mb-5">
              <label class="text-field">
                Pickup Address
                <span class="primary--text">(Pick up locations are lagos, Abuja, Rivers, Oyo, ondo andkwara only)</span>
              </label>
              <v-text-field
                outlined
                dense
                type="text"
                color="primary"
                placeholder="1 Isaac John St 1 Isaac John St, Ikeja GRA 101233, Lagos, Nigeria"
                v-model="address"
                :rules="addressRules"
                id="autocomplete"
                @keyup.enter="submitCheckoutDetails"
                required
              >
              </v-text-field>
            </div>
          </v-col>
          <v-col lg="6" offset-lg="3" cols="" class="py-0">
            <v-row>
              <v-col cols="">
                <router-link
                  :to="{ name: 'InventoryHome' }"
                  style="text-decoration: none"
                >
                  <v-btn color="primary" block outlined>Cancel</v-btn>
                </router-link>
              </v-col>
              <v-col cols="">
                <v-btn
                  color="primary"
                  block
                  class="elevation-0"
                  @keyup.enter="submitCheckoutDetails"
                  @click="submitCheckoutDetails"
                  :loading="loading"
                  :disabled="disabled"
                  >Next</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400" height="300">
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
import imageUploader from "@/components/secondary/imageUploader.vue";
import Modal from "@/components/secondary/Modal.vue";
import failedImage from "@/assets/images/failed-img.svg";
export default {
  components: {
    imageUploader,
    Modal,
  },

  data() {
    return {
      carriage: [
        { icon: "mdi-bicycle-basket", text: "BIKE" },
        { icon: "mdi-car", text: "CAR" },
        { icon: "mdi-truck", text: "TRUCK" },
      ],
      selectedTransportMethod: "",
      productName: "",
      productDiscription: "",
      collectImgUpload: [],
      quantity: null,
      productPrice: "",
      pickupName: "",
      pickUpNumber: "",
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
        ONDO: "Ondo"
      },
      autocomplete: "",
      nameRules: [
        (v) => !!v || "this field is required", // verifies name satisfies the requirement
      ],
      phoneNumberRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "This field is required",
        (v) => v.substring(0, 1) != 0 || "Phone number cannot begin with 0",
        (v) => v.length > 9 || "Number should be 10 digits or more",
        (v) => v.length < 11 || "Maximum 11 digits or more",
      ],
       addressRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Address is required",
        () => this.validAddress || "please select a valid pick up location",
      ],
      model: null,
      emptyImage: false,
      loading: false,
      disabled: false,
      dialog: false,
      statusImage: "",
      dialogMessage: "",
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

  methods: {
    selectedCarriage(params) {
      this.selectedTransportMethod = params;
    },
    setImageUrl(params) {
      let allImages = {};
      allImages.image = params.imageUrl;
      if (this.collectImgUpload.length === 5) {
        this.dialogMessage = "Images exceeded 5";
        (this.dialog = true), (this.statusImage = failedImage);
      } else {
        this.emptyImage = false;
        this.collectImgUpload.push(allImages);
      }
    },
    removeImgFromArray(params) {
      const checkForIndex = this.collectImgUpload.indexOf(params);
      if (checkForIndex > -1) {
        this.collectImgUpload.splice(checkForIndex, 1);
      }
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

    submitCheckoutDetails() {
      this.$refs.form.validate();
      if (this.collectImgUpload.length >= 1) {
        if (this.$refs.form.validate() && this.validAddress) {
          this.loading = true;
          const encodedURLQuery = `${
            "pname=" + this.productName
          }${encodeURIComponent(
            "&pdis=" + this.productDiscription
          )}${encodeURIComponent(
            "&pimg=" + JSON.stringify(this.collectImgUpload)
          )}${encodeURIComponent("&pp=" + this.productPrice)}
          ${encodeURIComponent("&qty=" + this.quantity)}${encodeURIComponent(
            "&pickupName=" + this.pickupName
          )}
          ${encodeURIComponent("&pickupNum=" + this.pickUpNumber)}
          ${encodeURIComponent("&carriage=" + this.selectedTransportMethod)}
          ${encodeURIComponent(
            "&pickupAdd=" + this.address
          )}${encodeURIComponent("&pickupLat=" + this.lat)}${encodeURIComponent(
            "&pickupLong=" + this.lng
          )}`;
          this.$router.push({
            path: `openSelling/customer-form?${encodedURLQuery}`,
          });
        }
      } else {
        this.emptyImage = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
.intro-head {
  left: 7.73%;
  right: 13.6%;
  top: 11.82%;
  bottom: 86.11%;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  color: #979797;
}

.text-field {
  left: 7.73%;
  right: 59.47%;
  top: 17.18%;
  bottom: 81.07%;
  font-size: 14px;
  line-height: 16px;
  /* identical to box height, or 114% */
  letter-spacing: 0.01em;
  color: #2b2b2b;
}

.phone-format {
  position: absolute;
  margin-top: 10px;
  margin-left: 10px;
}
@media (max-width: 426px) {
  .intro-head {
    font-size: 13px;
  }
}
</style>