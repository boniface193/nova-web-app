<template>
  <div class="signin-container">
    <!-- app logo -->
    <router-link to="/" class="d-flex dark--text app-logo">
      <div class="nova-logo d-flex align-center justify-center mx-auto my-5">
        <img src="@/assets/images/primary-logo.png" />
      </div>
    </router-link>
    <h3>Login into your Account</h3>

    <!-- Error message -->
    <p v-show="error" class="error--text mt-3 mb-0">
      <span v-html="errorMessage"></span>
    </p>

    <!-- login form -->
    <v-form class="flex-wrap form-container" ref="form">
      <!-- Email Adrress-->
      <v-text-field
        class="input mr-5 mt-5"
        v-model="email"
        :rules="emailRules"
        type="email"
        label="Email"
        color="primary"
        required
        @keyup.enter="$refs.input2.focus"
      ></v-text-field>

      <!-- Password -->
      <v-text-field
        class="input mr-5 mt-5"
        v-model="password"
        :rules="passwordRules"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'password' : 'text'"
        label="Password"
        color="primary"
        required
        ref="input2"
        @keyup.enter="validateForm()"
      ></v-text-field>

      <!-- forgot password link-->
      <div class="d-flex justify-end">
        <router-link
          to="/forgot-password"
          class="primary--text"
          style="text-decoration: none"
          ><span style="font-size: 13px">Forgot password?</span></router-link
        >
      </div>

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
      <div class="pa-0 mt-5">
        <v-btn
          height="48px"
          block
          depressed
          class="primary mb-5 mx-auto"
          @click="validateForm"
          :loading="loading"
          :disabled="loading"
          >Log In</v-btn
        >

        <!-- create account link -->
        <p
          style="
            font-size: 16px;
            font-family: 'Product Sans' Light;
            color: #646464;
          "
        >
          Don't have an account?
          <router-link to="/signup" style="text-decoration: none"
            >Create Account</router-link
          >
        </p>
      </div>
    </v-form>
  </div>
</template>
<script>
import InvisibleRecaptcha from "@/components/secondary/InvisibleRecaptcha.vue";
export default {
  name: "Signin",
  components: { InvisibleRecaptcha },
  data: function () {
    return {
      sitekey: `${process.env.VUE_APP_GOOGLE_RECAPTCHA_SITE_MAP}`,
      errorMessage: "",
      error: false,
      loading: false,
      email: "",
      password: "",
      showPassword: true,
      recaptchaToken: null,
      emailRules: [
        // verifies email address satisfies the requirement
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        // verifies password satisfies the requirement
        (v) => !!v || "Password is required",
      ],
    };
  },
  methods: {
    //validates form
    validateForm() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.$refs.invisibleRecaptcha1.execute()
      }
    },
    //Sign in
    signin() {
      this.loading = true;
      this.$store
        .dispatch("onboarding/signIn", {
          email: this.email,
          password: this.password,
          type: "seller",
          recaptcha: this.recaptchaToken,
        })
        .then((response) => {
          if (response.data.message === "Login successful.") {
            if (localStorage.getItem("nextRoute")) {
              location.replace(localStorage.getItem("nextRoute"));
            } else {
              this.$router.push({ path: "/inventory" });
            }
          }
        })
        .catch((error) => {
          this.error = true;
          this.loading = false;
          if (error.status == 422) {
            this.errorMessage = `Incorrect email address or password`;
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
      this.signin();
    },
    resetCaptcha() {
      this.$refs.invisibleRecaptcha1.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Signin.scss";
</style>