<template>
  <div class="forgotpassword-container">
    <!-- app logo -->
    <div class="description">
      <router-link to="/" class="d-flex dark--text">
        <div class="nova-logo d-flex align-center justify-center mx-auto my-5">
          <img src="@/assets/images/primary-logo.png" />
        </div>
      </router-link>
      <h3 class="mb-4">Recover password</h3>
      <p>
        Give us your phone number or email address, we will send you
        instructions to reset password
      </p>
    </div>

    <!-- error message -->
    <p v-show="error" class="error--text mt-3 mb-0">
      <span v-html="errorMessage"></span>
    </p>

    <!-- form section-->
    <v-form class="form-container" ref="form">
      <!-- Email Adrress-->
      <v-text-field
        class="input mt-5"
        v-model="email"
        :rules="emailRules"
        type="email"
        label="Email"
        color="primary"
        required
        @keyup.enter="validateEmail()"
      ></v-text-field>

      <!-- do not remove -->
      <v-text-field style="display: none"></v-text-field>

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
          @click="validateEmail()"
          :loading="loading"
          :disabled="loading"
          >Send Reset Password Instructions</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<script>
import InvisibleRecaptcha from "@/components/secondary/InvisibleRecaptcha.vue";
export default {
  name: "Forgotpassword",
  components: { InvisibleRecaptcha },
  data: function () {
    return {
      sitekey: `${process.env.VUE_APP_GOOGLE_RECAPTCHA_SITE_MAP}`,
      error: false,
      errorMessage: "",
      loading: false,
      email: "",
      recaptchaToken: null,
      emailRules: [
        // verifies email address satisfies the requirement
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    //validates form
    validateEmail() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.$refs.invisibleRecaptcha1.execute();
      }
    },
    //submit email
    submitEmail() {
      const emailAddress = this.email;
      this.loading = true;
      this.$store
        .dispatch("onboarding/forgotPassword", {
          email: this.email,
          type: "seller",
          recaptcha: this.recaptchaToken,
        })
        .then((response) => {
          this.loading = false;
          if (response.data.message === "An OTP has been sent to your email.") {
            this.$router.push({
              name: "ForgotPasswordVerification",
              params: { email: emailAddress },
            });
          }
        })
        .catch((error) => {
          this.error = true;
          this.loading = false;
          if (error.status == 422) {
            this.errorMessage = `This Account does not Exist`;
          } else if (error.status == 400) {
            this.errorMessage = error.data.message;
          } else if (error.status == 404) {
            this.message = "404 not found";
          } else if (error.status == 500) {
            this.message = "Something went wrong, please try again";
          } else if (!navigator.onLine) {
            this.message = "No internet connection!";
          }
        });
    },
    recaptchaCallback(token) {
      this.recaptchaToken = token;
      this.submitEmail();
    },
    resetCaptcha() {
      this.$refs.invisibleRecaptcha1.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ForgotPassword.scss";
</style>