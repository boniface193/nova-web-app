<template>
  <div class="signup-container">
    <div class="description">
      <a
        style="text-decoration: none"
        :href="`${websiteBaseURL}`"
        v-show="presentForm === 'form1'"
      >
        <v-icon color="black">mdi-chevron-left</v-icon>
      </a>

      <v-icon
        color="black"
        v-show="presentForm === 'form2'"
        @click="previousForm(1)"
        >mdi-chevron-left</v-icon
      >

      <h3 class="headings" v-show="presentForm === 'form1'">
        Sign up now and start earning!
      </h3>
      <h3 v-show="presentForm === 'form2'">Create Password</h3>
    </div>

    <!-- Error message -->
    <p v-show="error" class="error--text mt-3 mb-0">
      <span v-html="errorMessage"></span>
    </p>

    <!-- first form section-->
    <v-form
      class="flex-wrap form-container"
      ref="form1"
      :class="{
        'd-none': presentForm != 'form1',
        'd-flex': presentForm == 'form1',
      }"
    >
      <!-- First Name -->
      <v-text-field
        class="input mt-5"
        v-model="firstName"
        :rules="fullNameRules"
        type="name"
        label="First Name"
        color="primary"
        required
        @keyup.enter="$refs.input3.focus"
      ></v-text-field>
      <!-- last name -->
      <v-text-field
        class="input mt-5"
        v-model="lastName"
        :rules="fullNameRules"
        type="name"
        label="Last Name"
        color="primary"
        required
        @keyup.enter="$refs.input3.focus"
      ></v-text-field>

      <!-- Email Adrress-->
      <v-text-field
        class="input mt-5"
        v-model="email"
        :rules="emailRules"
        type="email"
        label="Email"
        color="primary"
        required
        @keyup.enter="$refs.input4.focus"
        ref="input3"
      ></v-text-field>

      <!-- Phone Number -->
      <div
        class="d-flex align-center phone-field"
        style="width: 100%; position: relative"
      >
        <v-icon color="#64B161" class="mt-3 mr-1">mdi-whatsapp</v-icon>
        <span class="primary--text phone-format">+234</span>
        <v-text-field
          class="mt-5"
          v-model="phoneNumber"
          :rules="phoneNumberRules"
          label="Phone Number"
          color="primary"
          type="tel"
          required
          ref="input4"
          @keyup.enter="validateForm(1)"
        ></v-text-field>
      </div>
      <v-text-field
        label="Referral ID (Optional)"
        v-model="referralID"
        :disabled="disabled"
      >
      </v-text-field>

      <!-- button container -->
      <div class="pa-0 mt-5 btn-container-form1" style="width: 100%">
        <v-btn
          height="48px"
          block
          depressed
          class="primary mb-5 mx-auto"
          @click="validateForm(1)"
          :loading="loading1"
          :disabled="loading1"
          >Next</v-btn
        >
        <!-- signin link -->
        <p
          style="
            font-size: 16px;
            font-family: 'Product Sans' Light;
            color: #646464;
          "
        >
          Already have an account?
          <router-link to="/signin" style="text-decoration: none"
            >Sign In</router-link
          >
        </p>
      </div>
    </v-form>

    <!-- password form section -->
    <v-form
      class="flex-wrap form-container"
      ref="form2"
      :class="{
        'd-none': presentForm != 'form2',
        'd-flex': presentForm == 'form2',
      }"
    >
      <!-- Create password -->
      <v-text-field
        class="input mt-5"
        v-model="createPassword"
        :rules="createPasswordRules"
        label="Create Password"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'password' : 'text'"
        color="primary"
        @keyup.enter="$refs.input10.focus"
        ref="input9"
        required
      ></v-text-field>

      <!-- Confirm password-->
      <v-text-field
        class="input mt-5"
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        label="Confirm Password"
        :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="() => (showConfirmPassword = !showConfirmPassword)"
        :type="showConfirmPassword ? 'password' : 'text'"
        color="primary"
        required
        ref="input10"
        @keyup.enter="validateForm(2)"
      ></v-text-field>

      <div class="d-flex align-center mt-5">
        <v-checkbox v-model="acceptTerms" class="mr-1"></v-checkbox>
        <p class="mb-0 text-left" style="">
          I agree to Kuuzza
          <a
            style="text-decoration: none"
            :href="`${websiteBaseURL}/customer/terms-conditions`"
            target="_blank"
            class="primary--text"
          >
            Terms of Service
          </a>
          and
          <a
            style="text-decoration: none"
            :href="`${websiteBaseURL}/privacy-policy`"
            target="_blank"
            class="primary--text"
          >
            Privacy Policy</a
          >
        </p>
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
      <div class="pa-0 mt-5" style="width: 100%">
        <v-btn
          class="primary px-8 mb-5 mx-auto"
          @click="validateForm(2)"
          :loading="loading2"
          :disabled="loading2 || !acceptTerms"
          >Next</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import InvisibleRecaptcha from "@/components/secondary/InvisibleRecaptcha.vue";
export default {
  name: "Signup",
  components: { InvisibleRecaptcha },
  data: function () {
    return {
      websiteBaseURL: process.env.VUE_APP_WEBSITE_BASE_URL,
      sitekey: `${process.env.VUE_APP_GOOGLE_RECAPTCHA_SITE_MAP}`,
      loading1: false,
      loading2: false,
      acceptTerms: false,
      errorMessage: "",
      error: false,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      createPassword: "",
      confirmPassword: "",
      showPassword: true,
      showConfirmPassword: true,
      referralID: "",
      disabled: false,
      recaptchaToken: null,
      fullNameRules: [
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
        (v) => v.length > 9 || "Number should be 10 digits",
        (v) => v.length < 11 || "Maximum of 10 digits is allowed",
      ],
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
  computed: {
    //get state properties from vuex store
    ...mapState({
      presentForm: (state) => state.onboarding.presentSignupForm,
    }),
  },
  mounted() {
    const productURL = new URLSearchParams(window.location.search);
    const productId = productURL.get("productId");
    localStorage.setItem("productID", productId);
    let url_ID = window.location.href;
    let newURL = new URL(url_ID);
    this.referralID =
      newURL.searchParams.get("referral_id") ||
      localStorage.getItem("referral_id");
    if (this.referralID !== null) {
      localStorage.setItem("referral_id", `${this.referralID}`);
    } else {
      return null;
    }

    if (newURL.searchParams.get("referral_id")) {
      this.disabled = true;
    }
  },
  methods: {
    //validate forms
    validateForm(formNum) {
      this.$refs[`form${formNum}`].validate();
      if (this.$refs[`form${formNum}`].validate()) {
        if (formNum == 2) {
          if (this.acceptTerms) {
            this.$refs.invisibleRecaptcha1.execute();
          }
        } else if (formNum == 1) {
          this.loading1 = true;
          this.$store
            .dispatch("onboarding/checkAccount", {
              email: this.email,
            })
            .then(() => {
              this.$refs.form2.reset();
              this.$store.commit(
                "onboarding/setPresentSignupForm",
                `form${formNum + 1}`
              );
              this.error = false;
              this.loading1 = false;
              this.errorMessage = "";
            })
            .catch((error) => {
              this.error = true;
              this.loading1 = false;

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
        }
      }
    },
    // go to previous form
    previousForm(formNum) {
      this.$store.commit("onboarding/setPresentSignupForm", `form${formNum}`);
    },
    //submit form and create an account
    submit() {
      this.loading2 = true;
      this.$store
        .dispatch("onboarding/register", {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone_number:
            this.phoneNumber.substring(0, 1) == "0"
              ? "+234" + this.phoneNumber.substring(1)
              : "+234" + this.phoneNumber,
          password: this.createPassword,
          password_confirmation: this.confirmPassword,
          referral_id: localStorage.getItem("referral_id") || this.referralID,
          recaptcha: this.recaptchaToken,
        })
        .then((response) => {
          this.loading2 = false;
          if (response.data.message === "Registeration successful.") {
            localStorage.removeItem("referral_id");
            this.$store.commit("onboarding/setPresentSignupForm", "form1");
            this.$router.push({
              name: "EmailVerification",
              params: {
                email: this.email,
              },
            });
          }
        })
        .catch((error) => {
          this.error = true;
          this.loading2 = false;
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
          this.resetCaptcha();
        });
    },
    recaptchaCallback(token) {
      this.recaptchaToken = token;
      this.submit();
    },
    resetCaptcha() {
      this.$refs.invisibleRecaptcha1.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Signup.scss";
</style>