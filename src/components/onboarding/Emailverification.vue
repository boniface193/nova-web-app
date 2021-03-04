<template>
  <div class="emailverification-container">
    <div>
      <!-- alert -->
      <v-alert type="success" v-show="resendOtpSuccess"
        >OPT has been sent successfully!</v-alert
      >

      <div class="description">
        <!-- app logo -->
        <router-link to="/" class="d-flex dark--text">
          <div
            class="nova-logo d-flex align-center justify-center mx-auto my-5"
          >
            <img src="@/assets/images/primary-logo.png" />
          </div>
        </router-link>

        <h3 class="my-5">Verify your Email Address</h3>

        <p class="mt-3">
          Please enter the code sent to {{ $route.params.email }}
        </p>

        <!-- error message -->
        <p class="error--text mt-3 mb-0" v-show="errorMessage == true">
          {{ message }}
        </p>
      </div>

      <v-form class="form-container">
        <div class="mb-2 mx-auto">
          <v-otp-input
            ref="otpInput1"
            separator=""
            :num-inputs="5"
            :should-auto-focus="true"
            input-type="number"
            @on-complete="handleOnComplete"
            @on-change="handleOnChange"
          />
        </div>

        <!-- button container -->
        <div class="pa-0 mt-10" style="width: 100%">
          <p>
            Didn't receive the code?
            <a style="text-decoration: none" @click="resendOTP">Resend Code</a>
          </p>
          <v-btn
            class="primary py-5 mb-5 mx-auto"
            @click="SubmitCode()"
            :loading="loading"
            :disabled="loading"
            >Verify</v-btn
          >
        </div>
      </v-form>
    </div>
    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="450">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="cancelModal"
            >mdi-close</v-icon
          >
        </div>

        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>
        <h3>Account Verified!</h3>
        <p class="my-3">You have successfully verified your Account.</p>

        <v-btn
          class="primary mx-auto py-5 px-8"
          :loading="loading2"
          :disabled="loading2"
          v-if="dashboardBtn"
          @click="grantAccess"
          >Start Selling</v-btn
        >
      </div>
    </modal>
  </div>
</template>
<script>
import OtpInput from "@/components/onboarding/verifyInput";
import modal from "@/components/modal.vue";
import successImage from "@/assets/images/success-img.svg";
//import failedImage from "@/assets/img/failed-img.svg";
export default {
  name: "Emailverification",
  components: {
    "v-otp-input": OtpInput,
    modal,
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      loading2: false,
      verify: false,
      code: null,
      errorMessage: false,
      message: "",
      resendOtpSuccess: false,
      dashboardBtn: true,
      statusImage: null,
    };
  },
  methods: {
    // check if code changes
    handleOnChange(value) {
      this.code = value;
      if (this.code.length != 5) {
        this.verify = false;
      }
    },
    // checks if code is complete
    handleOnComplete(value) {
      this.verify = true;
      this.code = value;
      this.errorMessage = false;
    },
    // submit OTP
    SubmitCode() {
      if (this.verify) {
        this.loading = true;
        this.$store
          .dispatch("onboarding/verifyEmail", {
            otp: this.code,
            email: this.$route.params.email,
            type: "seller",
          })
          .then((response) => {
            this.loading = false;
            if (response.data.message === "Email verified successfully.") {
              this.statusImage = successImage;
              if (localStorage.getItem("accessToken")) {
                this.dialog = true;
                this.dashboardBtn = true;
              } else {
                this.dashboardBtn = false;
                this.dialog = true;
              }
            }
          })
          .catch((error) => {
            this.loading = false;
            this.errorMessage = true;
            if (error.response) {
              this.message = error.response.data.errors.otp[0];
            } else {
              this.message = "No internet connection";
            }
          });
      } else {
        this.errorMessage = true;
        this.message =
          "Please Enter the 5 digits code sent to your email adddress";
      }
    },
    // resend OTP
    resendOTP() {
      this.$store
        .dispatch("onboarding/resendEmailOTP", {
          email: this.$route.params.email,
          type: "seller",
        })
        .then((response) => {
          if (response.data.message === "An OTP has been sent to your email.") {
            this.resendOtpSuccess = true;
            setTimeout(() => {
              this.resendOtpSuccess = false;
            }, 3000);
          }
        })
        .catch((error) => {
          this.errorMessage = true;
          if (error.response) {
            this.message = error.response.errors.email[0];
          } else {
            this.message = "No internet Connection!";
          }
        });
    },
    // close modal
    cancelModal() {
      this.dialog = false;
      this.denialAccess();
    },
    //allows user to access the dashboard
    grantAccess() {
      this.$router.push({ name: "InventoryHome" });
    },
    // destroy token
    denialAccess() {
      this.$store.commit("onboarding/removeToken");
      this.$router.push({ name: "Signin" });
    },
  },
};
</script>
<style lang="scss" scoped>
.emailverification-container {
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .v-icon {
    font-size: 25px;
  }
  .description {
    width: 90%;
    margin: auto;
  }
  .nova-logo {
    width: 120px;
    img {
      width: 100%;
    }
  }
  .form-container {
    width: 90%;
    margin: auto;
    padding: 15px 0px;
  }
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 70%;
  padding: 0 16px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 700px) {
  .emailverification-container {
    .description {
      text-align: left;
    }
    .app-logo {
      margin: 20px 0px;
    }
  }
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 100%;
    padding: 0 16px;
  }
}
</style>