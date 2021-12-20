/* eslint-disable prettier/prettier */
<template>
  <div>
    <!-- kyc container -->
    <div v-show="!sellerStatus">
      <router-link
        :to="{
          name: 'AddBankDetails'
        }"
        style="text-decoration: none"
        class="mx-5"
      >
        <span class="back-btn">
          <v-icon color="black" style="font-size: 25px"
            >mdi-chevron-left</v-icon
          >
        </span>
      </router-link>
      <!-- page description -->
      <div>
        <h2 class="text-center mt-5 mb-0">Please complete verification</h2>
      </div>
      <!-- step progress  -->
      <div class="progress-container mx-auto">
        <StepProgress
          :steps="['Profile Upload', 'Identity Verifcation']"
          :currentStep="currentStep"
          :lineThickness="lineThickness"
          :activeColor="activeColor"
          :activeThickness="activeThickness"
          :passiveThickness="passiveThickness"
          :passiveColor="passiveColor"
          class="mt-5 mb-5"
        />
      </div>
      <!-- form section -->
      <div class="form-container mt-8 mt-sm-16 pt-5 mx-auto">
        <!-- image uploaded section -->
        <KycProfileUplaod
          v-show="presentForm === 'form1'"
          @setImage="setUploadImages"
        />

        <!-- Identification type -->
        <v-form ref="form2" v-show="presentForm === 'form2'">
          <!-- ID type -->
          <div class="mb-8">
            <p class="mb-1 question">Select your ID type</p>
            <div class="select-item">
              <SelectBtn
                bgColor="transparent"
                borderRadius="5px"
                borderColor="slategrey"
                :items="['NIN', 'Driver\'s license', 'Voter\'s card']"
                :item="'---Select ID ---'"
                :inputStatus="IDErrorStatus"
                errorMsg="select an ID"
                @selectedItem="setIDType"
              />
            </div>
          </div>
          <div class="mb-3">
            <p class="mb-1 question">Enter ID number</p>
            <v-text-field
              class=""
              v-model="IDNumber"
              :rules="IDRules"
              type="text"
              color="primary"
              required
              outlined
              @keyup.enter="goNextForm(2)"
            ></v-text-field>
          </div>
          <!-- btn container -->
          <div class="d-flex justify-space-between">
            <v-btn class="primary--text background px-8" @click="goPrevForm(1)">
              Back
            </v-btn>
            <v-btn
              class="primary px-8"
              @click="goNextForm(3)"
              :disabled="submitLoader"
              :loading="submitLoader"
              >Submit</v-btn
            >
          </div>
        </v-form>
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
    <div v-show="sellerStatus" class="mt-10">
      <!-- go back to withdrawal page -->
      <router-link
        :to="{
          name: 'AddBankDetails'
        }"
        style="text-decoration: none"
        class="mx-5"
      >
        <span class="back-btn">
          <v-icon color="black" style="font-size: 25px"
            >mdi-chevron-left</v-icon
          >
        </span>
      </router-link>
      <!-- kyc status message -->
      <h2 class="text-center primary--text mt-10">
        Your Kyc verification was completed successfully!
      </h2>
    </div>
  </div>
</template>
<script>
import StepProgress from "@/components/secondary/StepProgress.vue";
import SelectBtn from "@/components/primary/SelectBtn.vue";
import KycProfileUplaod from "@/components/secondary/KycProfileUpload.vue";
import Modal from "@/components/secondary/Modal.vue";
import failedImage from "@/assets/images/failed-img.svg";
import { mapState } from "vuex";
export default {
  name: "Kyc",
  components: {
    StepProgress,
    SelectBtn,
    KycProfileUplaod,
    Modal
  },
  data: function() {
    return {
      submitLoader: false,
      lineThickness: 4,
      activeThickness: 4,
      passiveThickness: 4,
      activeColor: "#FFA500",
      passiveColor: "#ddd",
      currentStep: 0,
      presentForm: "form1",
      IDType: null,
      IDNumber: "",
      profileImage: null,
      IDErrorStatus: false,
      form1IsValid: false,
      form2IsValid: false,
      loading: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      inputRules: [v => !!v || "This field is required"],
      addressRules: [
        //verifies pick up address satisfies the requirement
        v => !!v || "Address is required",
        () => this.validAddress || "Select a valid Address"
      ],
      IDRules: [
        //verifies phone number satisfies the requirement
        v => !!v || "This field is required",
        v => v.length <= 19 || "Maximum of 19 digits is allowed"
      ]
    };
  },
  created() {
    if (this.$store.getters["settings/profile"].name != "") {
      this.verfiyKyc();
    } else {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.verfiyKyc();
      });
    }
  },
  computed: {
    ...mapState({
      sellerStatus: state => state.settings.allowSellerToSell
    })
  },
  methods: {
    // verfiy kyc
    verfiyKyc() {
      if (this.$store.getters["settings/profile"].kyc_status === "verified") {
        this.$store.commit("settings/setSellerStatus", true);
      } else {
        this.$store.commit("settings/setSellerStatus", false);
      }
    },
    // go to the next form
    goNextForm(formNum) {
      if (formNum === 2) {
        this.presentForm = "form2";
      }
      if (formNum === 3) {
        this.validateForm2();
        if (this.form2IsValid) {
          this.submitForm();
        }
      }
    },
    // go back to previous form
    goPrevForm(formNum) {
      this.presentForm = `form${formNum}`;
      this.currentStep = formNum - 1;
    },
    // submit KYC
    submitForm() {
      this.submitLoader = true;
      const formData = new FormData();
      formData.set("id_number", this.IDNumber);
      formData.set("photo", this.profileImage[0]);
      formData.set("id_type", this.IDType);
      formData.set(
        "first_name",
        this.$store.getters["settings/profile"].first_name
      );
      formData.set(
        "last_name",
        this.$store.getters["settings/profile"].last_name
      );
      this.$store
        .dispatch("settings/addKYC", formData)
        .then(() => {
          this.submitLoader = false;
          location.reload();
        })
        .catch(error => {
          this.submitLoader = false;
          if (error.status === 422 || error.status === 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // set the images returned from component
    setUploadImages(params) {
      this.profileImage = params.profileImage;
      this.goNextForm(2);
    },
    // set ID type
    setIDType(params) {
      if (params == "NIN") {
        this.IDType = "nin";
      } else if (params == "Driver's license") {
        this.IDType = "dl";
      } else if (params == "Voter's card") {
        this.IDType = "vc";
      }
      this.IDErrorStatus = false;
    },
    // validate form 3
    validateForm2() {
      this.IDType !== null
        ? (this.IDErrorStatus = false)
        : (this.IDErrorStatus = true);
      this.$refs.form2.validate();
      !this.IDErrorStatus && this.$refs.form2.validate()
        ? (this.form2IsValid = true)
        : (this.form2IsValid = false);
    }
  }
};
</script>
<style lang="scss" scoped>
.progress-container {
  width: 60%;
}
.form-container {
  width: 50%;
}
.select-item {
  height: 58px;
  position: relative;
}
.back-btn {
  cursor: pointer;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 1200px) {
  .progress-container {
    width: 80%;
  }
  .form-container {
    width: 65%;
  }
}
@media (max-width: 850px) {
  .progress-container {
    width: 85%;
  }
  .form-container {
    width: 75%;
  }
}
@media (max-width: 550px) {
  .progress-container {
    width: 90%;
  }
  .form-container {
    width: 90%;
  }
}
</style>
