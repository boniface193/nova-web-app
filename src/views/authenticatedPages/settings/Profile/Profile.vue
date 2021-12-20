<template>
  <div>
    <!-- user profile -->
    <v-row>
      <v-col class="col-12 col-md-5 text-center">
        <div
          class="d-flex align-center justify-center"
          style="position: relative"
        >
          <router-link
            :to="{ name: 'ProfilePage' }"
            style="text-decoration: none"
          >
            <span class="back-btn">
              <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
            </span>
          </router-link>
          <h3 class="align-self-center">Edit Profile</h3>
        </div>
        <div class="profile-img my-5">
          <v-img src="@/assets/images/user-profile.svg"></v-img>
        </div>
        <h4>{{ userInfo.name }}</h4>
        <a class="primary--text" style="font-size: 14px"
          >Change profile picture</a
        >
      </v-col>

      <!-- user credential section -->
      <v-col
        class="col-12 col-md-7 pl-md-7 pr-md-10 pt-9 pb-16 px-4"
        style="border-left: 1px solid #f1edec"
      >
        <!-- first name field -->
        <div class="mb-5 settings-input">
          <p class="mb-1 secondary--text">First Name</p>
          <v-text-field
            class="input mt-0"
            v-model="computedInfo.currentFirstName"
            :rules="inputRules"
            type="name"
            color="primary"
            :disabled="editFirstName == false"
            required
          >
          </v-text-field>
          <!-- edit btn -->
          <span
            class="edit-btn"
            @click="editFirstName = true"
            v-show="editFirstName == false"
            >Edit</span
          >
          <!-- done btn -->
          <span
            class="edit-btn"
            v-show="editFirstName && !firstNameLoader"
            @click="editInfo('first_name')"
            >Done</span
          >
          <!-- loader -->
          <span class="edit-btn" v-show="firstNameLoader == true">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="20"
            ></v-progress-circular>
          </span>
        </div>
        <!-- last name field -->
        <div class="mb-5 settings-input">
          <p class="mb-1 secondary--text">Last Name</p>
          <v-text-field
            class="input mt-0"
            v-model="computedInfo.currentLastName"
            :rules="inputRules"
            type="name"
            color="primary"
            :disabled="editLastName == false"
            required
          >
          </v-text-field>
          <!-- edit btn -->
          <span
            class="edit-btn"
            v-show="editLastName == false"
            @click="editLastName = true"
            >Edit</span
          >
          <!-- done btn -->
          <span
            class="edit-btn"
            v-show="editLastName && !lastNameLoader"
            @click="editInfo('last_name')"
            >Done</span
          >
          <!-- loader -->
          <span class="edit-btn" v-show="lastNameLoader == true">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="20"
            ></v-progress-circular>
          </span>
        </div>

        <!-- phone number field -->
        <div class="mb-5 settings-input phone-field">
          <p class="mb-1">Phone Number</p>
          <span class="primary--text phone-format">+234</span>
          <v-text-field
            class="input mt-0"
            :rules="phoneRules"
            v-model="computedInfo.currentPhoneNum"
            type="tel"
            color="primary"
            :disabled="editPhoneNum == false"
            required
          >
          </v-text-field>
          <!-- edit btn -->
          <span
            class="edit-btn"
            v-show="editPhoneNum == false"
            @click="editPhoneNum = true"
            >Edit</span
          >
          <!-- done btn -->
          <span
            class="edit-btn"
            v-show="editPhoneNum && !phoneNumLoader"
            @click="editInfo('phonenum')"
            >Done</span
          >
          <!-- loader -->
          <span class="edit-btn" v-show="phoneNumLoader == true">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="20"
            ></v-progress-circular>
          </span>
        </div>

        <!-- Address field -->
        <div class="mb-5 settings-input">
          <p class="mb-1">Address</p>
          <v-text-field
            class="input mt-0"
            :rules="addressRules"
            type="address"
            color="primary"
            v-model="address"
            :disabled="editAddress == false"
            id="autocomplete"
            required
          >
          </v-text-field>
          <!-- edit btn -->
          <span
            class="edit-btn"
            v-show="editAddress == false"
            @click="editAddress = true"
            >Edit</span
          >
          <!-- done btn -->
          <span
            class="edit-btn"
            v-show="editAddress && !addressLoader"
            @click="editInfo('editAddress')"
            >Done</span
          >
          <!-- loader -->
          <span class="edit-btn" v-show="addressLoader == true">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="20"
            ></v-progress-circular>
          </span>
        </div>
        <!-- Email -->
        <div class="mb-5 settings-input">
          <p class="mb-1">Email</p>
          <v-text-field
            class="input mt-0"
            type="email"
            color="primary"
            v-model="computedInfo.email"
            disabled
            required
          >
          </v-text-field>
        </div>
      </v-col>
    </v-row>

    <!-- loader -->
    <div class="loader-body text-center pt-10" v-show="loader">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
import Modal from "@/components/secondary/Modal.vue";
import successImage from "@/assets/images/success-img.svg";
import failedImage from "@/assets/images/failed-img.svg";
import { mapGetters } from "vuex";
export default {
  name: "userDetails",
  components: { Modal },
  data: function () {
    return {
      phoneNum: "",
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      editFirstName: false,
      editLastName: false,
      editPhoneNum: false,
      editAddress: false,
      phoneNumLoader: false,
      firstNameLoader: false,
      lastNameLoader: false,
      addressLoader: false,
      address: "",
      lat: "",
      lng: "",
      validAddress: false,
      state: null,
      autocomplete: "",
      inputRules: [(v) => !!v || "This field is required"],
      phoneRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "This field is required",
        (v) => v.substring(0, 1) != 0 || "Phone number cannot begin with 0",
        (v) => v.length > 9 || "Number should be 10 digits",
        (v) => v.length < 11 || "Maximum of 10 digits is allowed",
      ],
      addressRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "Address is required",
        () => this.validAddress || "Select a valid address",
      ],
      loader: false,
    };
  },
  created() {
    this.address =
      this.$store.getters["settings/profile"].location !== null
        ? this.$store.getters["settings/profile"].location.address
        : "null";
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
    ...mapGetters({
      userInfo: "settings/profile",
    }),
    computedInfo() {
      // gets the values of user information
      //let userInfo = this.$store.getters["settings/getUserProfile"];
      let firstName = this.userInfo.first_name;
      let lastName = this.userInfo.last_name;
      let phoneNum = this.userInfo.phone_number.substring(4);
      let address =
        this.userInfo.location !== null
          ? this.userInfo.location.address
          : "null";
      let email = this.userInfo.email;
      let currentFirstName = this.userInfo.first_name;
      let currentLastName = this.userInfo.last_name;
      let currentPhoneNum = this.userInfo.phone_number.substring(4);
      let currentAddress =
        this.userInfo.location !== null
          ? this.userInfo.location.address
          : "null";

      return {
        firstName: firstName,
        lastName: lastName,
        phoneNum: phoneNum,
        address: address,
        currentFirstName: currentFirstName,
        currentLastName: currentLastName,
        currentPhoneNum: currentPhoneNum,
        currentAddress: currentAddress,
        email: email,
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
        this.state = this.search(
          "administrative_area_level_1",
          place.address_components
        ).long_name;
        this.state = this.formatState(this.state);
      }
    },
    search(nameKey, myArray) {
      for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].types[0] === nameKey) {
          return myArray[i];
        }
      }
    },
    formatState(state) {
      if (state == "Federal Capital Territory") {
        return "ABUJA";
      } else {
        let capitalState = state.toUpperCase();
        return capitalState.replace(/ +/g, "_");
      }
    },
    // submits the edited information
    editInfo(input_field) {
      // check if the edit input field is the first name
      if (
        input_field === "first_name" &&
        this.computedInfo.currentFirstName !== ""
      ) {
        if (
          this.computedInfo.currentFirstName !== this.computedInfo.firstName
        ) {
          this.firstNameLoader = true;
          this.$store
            .dispatch("settings/editUserProfile", {
              first_name: this.computedInfo.currentFirstName,
            })
            .then(() => {
              this.dialogMessage = "First name changed successfully!";
              this.editFirstName = false;
              this.firstNameLoader = false;
              this.statusImage = successImage;
              this.dialog = true;
            })
            .catch(() => {
              this.dialogMessage = "";
              this.firstNameLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editFirstName = false;
        }
      }

      // check if the edit input field is the last name
      if (
        input_field === "last_name" &&
        this.computedInfo.currentLastName !== ""
      ) {
        if (this.computedInfo.currentLastName !== this.computedInfo.lastName) {
          this.lastNameLoader = true;
          this.$store
            .dispatch("settings/editUserProfile", {
              last_name: this.computedInfo.currentLastName,
            })
            .then(() => {
              this.dialogMessage = "Last name changed successfully!";
              this.editLastName = false;
              this.lastNameLoader = false;
              this.statusImage = successImage;
              this.dialog = true;
            })
            .catch(() => {
              this.dialogMessage = "";
              this.lastNameLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editLastName = false;
        }
      }

      // check if the edited input field is the admin phone number
      if (
        input_field === "phonenum" &&
        this.computedInfo.currentPhoneNum !== "" &&
        this.computedInfo.currentPhoneNum.substring(0, 1) != "0"
      ) {
        if (this.computedInfo.currentPhoneNum !== this.computedInfo.phoneNum) {
          this.phoneNumLoader = true;
          this.$store
            .dispatch("settings/editUserProfile", {
              phone_number:
                this.computedInfo.currentPhoneNum.substring(0, 1) == "0"
                  ? "+234" + this.computedInfo.currentPhoneNum.substring(1)
                  : "+234" + this.computedInfo.currentPhoneNum,
            })
            .then(() => {
              this.dialogMessage = "Phone number changed successfully!";
              this.editPhoneNum = false;
              this.phoneNumLoader = false;
              this.statusImage = successImage;
              this.dialog = true;
            })
            .catch((error) => {
              if (error.status == 422) {
                this.dialogMessage = error.data.errors.phone_number[0];
              } else if (error.status == 400) {
                this.dialogMessage = error.data.message;
              }
              this.phoneNumLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editPhoneNum = false;
        }
      }
      // check if the edit input field is the admin name
      if (input_field === "editAddress" && this.address !== "") {
        if (this.address !== this.computedInfo.address) {
          this.addressLoader = true;
          this.$store
            .dispatch("settings/editUserProfile", {
              location: {
                address: this.address,
                lat: this.lat,
                lng: this.lng,
                state: this.state,
              },
            })
            .then(() => {
              this.dialogMessage = "Store address changed successfully!";
              this.editAddress = false;
              this.addressLoader = false;
              this.statusImage = successImage;
              this.dialog = true;
            })
            .catch((error) => {
              if (error.status == 400 || error.status == 422) {
                this.dialogMessage = error.data.message;
              }
              this.addressLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editAddress = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Profile.scss";
</style>