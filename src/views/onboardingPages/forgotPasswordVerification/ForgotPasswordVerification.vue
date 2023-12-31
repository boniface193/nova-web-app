<template>
  <div class="forgotpasswordverification-container">
    <!-- alert -->
    <v-alert type="success" v-show="resendOtpSuccess"
      >OPT has been sent successfully!</v-alert
    >
    <div style="width:90% margin: auto; text-align:left">
      <router-link
        :to="{ name: 'Forgotpassword' }"
        style="text-decoration: none"
      >
        <v-icon color="black">mdi-chevron-left</v-icon>
      </router-link>
    </div>

    <div class="description">
      <h3 class="my-5 headings">Verify your account</h3>

      <p class="mt-3 sub-headings">
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
        <p style="color: #979797; font-size: 14px">
          Didn't receive the code?
          <a style="text-decoration: none; font-size: 14px">
            <span v-show="!resendOTPLoader && !showOTPTimer" @click="resendOTP"
              >Resend Code</span
            >
            <v-progress-circular
              indeterminate
              color="primary"
              size="20"
              class="ml-5"
              v-show="resendOTPLoader"
            ></v-progress-circular>
            <span class="primary--text" v-show="showOTPTimer"
              >You can resend OTP in
              <span class="error--text">{{ timer }}.00</span></span
            >
          </a>
        </p>
        <v-btn
          height="48px"
          block
          depressed
          class="primary mb-5 mx-auto"
          @click="submitCode()"
          :loading="loading"
          :disabled="loading"
          >Verify</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<script>
import OtpInput from "@/components/secondary/verifyInput";
export default {
  name: "forgotPasswordVerification",
  components: {
    "v-otp-input": OtpInput,
  },
  created() {
    this.setOTPTimer();
  },
  data: function () {
    return {
      loading: false,
      verify: false,
      code: null,
      errorMessage: false,
      message: "",
      resendOTPLoader: false,
      resendOtpSuccess: false,
      showOTPTimer: true,
      timer: 60,
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
    setOTPTimer() {
      this.showOTPTimer = true;
      let counter = setInterval(() => {
        if (this.timer === 1) {
          clearInterval(counter);
          this.showOTPTimer = false;
          this.timer = 60;
        } else {
          this.timer -= 1;
        }
      }, 1000);
    },
    // submit code
    submitCode() {
      if (this.verify) {
        this.loading = true;
        this.$store
          .dispatch("onboarding/verifyForgotPassword", {
            otp: this.code,
            email: this.$route.params.email,
            type: "seller",
          })
          .then((response) => {
            this.loading = false;
            if (response.data.message === "OTP verified successfully.") {
              this.$router.push({
                name: "RecoverPassword",
                params: {
                  otp: response.data.otp,
                  email: this.$route.params.email,
                },
              });
            }
          })
          .catch((error) => {
            this.loading = false;
            this.errorMessage = true;
            if (error.status == 422) {
              this.message = error.data.errors.otp[0];
            } else if (error.status == 400) {
              this.message = error.data.message;
            } else if (error.status == 404) {
              this.message = "404 not found";
            } else if (error.status == 500) {
              this.message = "Something went wrong, please try again";
            } else if (!navigator.onLine) {
              this.message = "No internet connection!";
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
      this.resendOTPLoader = true;
      this.$store
        .dispatch("onboarding/resendVerifyForgotPasswordOTP", {
          email: this.$route.params.email,
          type: "seller",
        })
        .then((response) => {
          if (response.data.message === "An OTP has been sent to your email.") {
            this.resendOtpSuccess = true;
            this.resendOTPLoader = false;
            setTimeout(() => {
              this.resendOtpSuccess = false;
            }, 3000);
            this.setOTPTimer();
          }
        })
        .catch((error) => {
          this.errorMessage = true;
          this.resendOTPLoader = false;
          if (error.status == 422) {
            this.message = error.data.errors.email[0];
          } else if (error.status == 400) {
            this.message = error.data.message;
          } else if (error.status == 404) {
            this.message = "404 not found";
          } else if (error.status == 500) {
            this.message = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.message = "No internet connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ForgotPasswordVerification.scss";
</style>