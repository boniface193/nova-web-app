<template>
  <div>
    <!-- user profile -->
    <v-row class="px-2 px-md-7">
      <v-col class="col-12 col-md-5 pt-9 text-center">
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
        <!-- full name field -->
        <div class="mb-5 settings-input">
          <p class="mb-1">Name</p>
          <v-text-field
            class="input mt-0"
            v-model="computedInfo.currentFullName"
            :rules="inputRules"
            type="name"
            color="primary"
            :disabled="editAdminName == false"
            required
          >
          </v-text-field>
          <!-- edit btn -->
          <span
            class="edit-btn"
            v-show="editAdminName == false"
            @click="editAdminName = true"
            >Edit</span
          >
          <!-- done btn -->
          <span
            class="edit-btn"
            v-show="editAdminName && !nameLoader"
            @click="editInfo('admin_name')"
            >Done</span
          >
          <!-- loader -->
          <span class="edit-btn" v-show="nameLoader == true">
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
            :rules="inputRules"
            type="address"
            color="primary"
            v-model="computedInfo.currentAddress"
            :disabled="editAddress == false"
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
            v-show="editAddress && !phoneNumLoader"
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
      </v-col>
    </v-row>

    <!-- loader -->
    <div class="loader-body text-center pt-10" v-show="loader">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
  </div>
</template>
<script>
import modal from "@/components/modal.vue";
import successImage from "@/assets/images/success-img.svg";
import failedImage from "@/assets/images/failed-img.svg";
import { mapGetters } from "vuex";
export default {
  name: "userDetails",
  components: { modal },
  data: function () {
    return {
      phoneNum: "",
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      editAdminName: false,
      editPhoneNum: false,
      editAddress: false,
      phoneNumLoader: false,
      nameLoader: false,
      addressLoader: false,
      inputRules: [(v) => !!v || "This field is required"],
      phoneRules: [
        //verifies phone number satisfies the requirement
        (v) => !!v || "This field is required",
        (v) => v.substring(0, 1) != 0 || "Phone number cannot begin with 0",
        (v) => v.length > 9 || "Number should 10 digits or more",
        (v) => v.length <= 11 || "Maximum 11 digits or more",
      ],
      loader: false,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
    }),
    computedInfo() {
      // gets the values of user information
      //let userInfo = this.$store.getters["settings/getUserProfile"];
      let fullName = this.userInfo.name;
<<<<<<< HEAD
      let phoneNum = this.userInfo.phone_number.substring(4);
      let address = this.userInfo.address;
      let email = this.userInfo.email;
=======
      let phoneNum = this.userInfo.phone_number;
      let address = "22 Abubakar Way, Abuja";
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3
      let currentFullName = this.userInfo.name;
      let currentPhoneNum = this.userInfo.phone_number.substring(4);
      let currentAddress = this.userInfo.address || "null";

      return {
        fullName: fullName,
        phoneNum: phoneNum,
        address: address,
        currentFullName: currentFullName,
        currentPhoneNum: currentPhoneNum,
        currentAddress: currentAddress,
<<<<<<< HEAD
        email: email,
=======
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3
      };
    },
  },
  methods: {
    // submits the edited information
    editInfo(input_field) {
      // check if the edit input field is the admin name
      if (
        input_field === "admin_name" &&
        this.computedInfo.currentFullName !== ""
      ) {
        if (this.computedInfo.currentFullName !== this.computedInfo.fullName) {
          this.nameLoader = true;
          this.$store
            .dispatch("settings/editUserProfile", {
              name: this.computedInfo.currentFullName,
            })
            .then(() => {
              this.dialogMessage = "Name changed successfully!";
              this.editAdminName = false;
              this.nameLoader = false;
              this.statusImage = successImage;
              this.dialog = true;
            })
            .catch((error) => {
              if (error.response) {
                this.dialogMessage = "";
              } else {
                this.dialogMessage = "No internet connection!";
              }
              this.nameLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editAdminName = false;
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
              if (error.response) {
                this.dialogMessage = error.response.data.errors.phone_number[0];
              } else {
                this.dialogMessage = "No internet connection!";
              }
              this.phoneNumLoader = false;
              this.statusImage = failedImage;
              this.dialog = true;
            });
        } else {
          this.editPhoneNum = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .v-image {
    width: 100%;
    height: 100%;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.store-width {
  width: 50%;
}
.settings-input {
  position: relative;
  .edit-btn {
    position: absolute;
    bottom: 25px;
    right: 0;
    cursor: pointer;
<<<<<<< HEAD
    color: #029b97;
=======
    color: #5064cc;
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3
    background: white;
    padding: 5px 0px 0px 5px;
  }
}
.phone-format {
  position: absolute;
  margin-top: 16px;
}
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
@media (max-width: 950px) {
  .store-width {
    width: 100%;
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