<template>
  <div class="recoverpassword-container">
    <!-- app logo -->
    <router-link to="/" class="d-flex dark--text app-logo">
      <div class="nova-logo d-flex align-center justify-center mx-auto my-5">
        <img src="@/assets/images/primary-logo.png" />
      </div>
    </router-link>

    <h3>Reset password</h3>

    <!-- error message -->
    <p class="mt-5 mb-0 error--text" v-show="error">
      {{ errorMessage }}
    </p>
    <!-- form section -->
    <v-form class="form-container" ref="form">
      <!-- Create password -->
      <v-text-field
        class="input mr-5 mt-5"
        v-model="createPassword"
        :rules="createPasswordRules"
        label="Create Password"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'password' : 'text'"
        color="primary"
        required
        @keyup.enter="$refs.input2.focus"
      ></v-text-field>

      <!-- Confirm password-->
      <v-text-field
        class="input mr-5 mt-5"
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        label="Confirm Password"
        :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="() => (showConfirmPassword = !showConfirmPassword)"
        :type="showConfirmPassword ? 'password' : 'text'"
        color="primary"
        required
        ref="input2"
        @keyup.enter="validatePassword()"
      ></v-text-field>

      <!-- This is in the component you want to have the reCAPTCHA -->
      <InvisibleRecaptcha
        ref="invisibleRecaptcha1"
        :sitekey="sitekey"
        :elementId="'invisibleRecaptcha1'"
        :badgePosition="'left'"
        :showBadgeMobile="false"
        :showBadgeDesktop="true"
        @recaptchaCallback="recaptchaCallback"
      ></InvisibleRecaptcha>

      <!-- button container -->
      <div class="pa-0 mt-5" style="width: 100%">
        <v-btn
          height="48px"
          block
          depressed
          class="primary mb-5 mx-auto"
          @click="validatePassword()"
          :loading="loading"
          :disabled="loading"
          >Submit</v-btn
        >
      </div>
    </v-form>

    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon
            class="error--text close-btn"
            @click="
              () => {
                this.dialog = false;
                this.$router.push({
                  name: 'Signin',
                });
              }
            "
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
import InvisibleRecaptcha from "@/components/secondary/InvisibleRecaptcha.vue";
//import failedImage from "@/assets/images/failed-img.svg";
export default {
  name: "Recoverpassword",
  components: { Modal, InvisibleRecaptcha },
  data: function () {
    return {
      sitekey: `${process.env.VUE_APP_GOOGLE_RECAPTCHA_SITE_MAP}`,
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      error: false,
      errorMessage: "",
      loading: false,
      createPassword: "",
      confirmPassword: "",
      showPassword: true,
      showConfirmPassword: true,
      recaptchaToken: null,
      createPasswordRules: [
        //verifies password satisfies the requirement
        (v) => !!v || "Password is required",
        (v) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v) ||
          "Password must contain a minimum of 8 character, at least one uppercase, one lowercase, one number",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Password is required",
        (v) => v === this.createPassword || "Passwords do not match",
      ],
    };
  },
  methods: {
    //validates form
    validatePassword() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.$refs.invisibleRecaptcha1.execute()
      }
    },
    //submit password
    recoverPassword() {
      this.loading = true;
      this.$store
        .dispatch("onboarding/recoverPassword", {
          email: this.$route.params.email,
          password: this.createPassword,
          password_confirmation: this.confirmPassword,
          otp: this.$route.params.otp,
          type: "seller",
          recaptcha: this.recaptchaToken,
        })
        .then((response) => {
          this.loading = false;
          if (response.data.message === "Password reset successful.") {
            this.dialogMessage = "Your password has been successfully changed";
            this.dialog = true;
            this.statusImage = successImage;
            this.otp = null;
            //this.$store.commit("onboarding/accessPasswordRecoveryPage", false);
            setTimeout(() => {
              this.$router.push({
                name: "Signin",
              });
            }, 3000);
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = true;
          if (error.status == 422) {
            this.errorMessage = error.data.errors.email[0];
          } else if (error.status == 400) {
            this.errorMessage = error.data.message;
          } else if (error.status == 404) {
            this.errorMessage = "404 not found";
          } else if (error.status == 500) {
            this.errorMessage = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.errorMessage = "No internet connection!";
          }
        });
    },
    recaptchaCallback(token) {
      this.recaptchaToken = token;
      this.recoverPassword();
    },
    resetCaptcha() {
      this.$refs.invisibleRecaptcha1.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./RecoverPassword.scss";
</style>