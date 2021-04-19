<template>
  <div class="signup-container">
    <!-- app logo -->
    <!-- <router-link to="/" class="d-flex dark--text app-logo">
      N<v-img src="@/assets/images/fire.svg" max-width="35"></v-img>VA
    </router-link> -->

    <div class="description">
      <router-link
        :to="{ name: 'Home' }"
        style="text-decoration: none"
        v-show="presentForm === 'form1'"
      >
        <v-icon color="black">mdi-chevron-left</v-icon>
      </router-link>

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
      <!-- Full Name -->
      <v-text-field
        class="input mt-5"
        v-model="fullName"
        :rules="fullNameRules"
        type="name"
        label="Full Name"
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

      <v-checkbox
        v-model="acceptTerms"
        label="By clicking continue, you are agreeing to our terms of service and privacy policy"
        class="mt-5"
      ></v-checkbox>

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
export default {
  name: "Signup",
  data: function () {
    return {
      loading1: false,
      loading2: false,
      acceptTerms: false,
      errorMessage: "",
      error: false,
      fullName: "",
      email: "",
      phoneNumber: "",
      createPassword: "",
      confirmPassword: "",
      showPassword: true,
      showConfirmPassword: true,
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
        (v) => v.length > 9 || "Number should 10 digits or more",
        (v) => v.length <= 11 || "Maximum 11 digits or more",
      ],
      createPasswordRules: [
        //verifies password satisfies the requirement
        (v) => !!v || "Password is required",
        (v) =>
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ||
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
  methods: {
    //validate forms
    validateForm(formNum) {
      this.$refs[`form${formNum}`].validate();
      if (this.$refs[`form${formNum}`].validate()) {
        if (formNum == 2) {
          if (this.acceptTerms) {
            this.submit();
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
        } else if (formNum == 2) {
          this.$store.commit(
            "onboarding/setPresentSignupForm",
            `form${formNum + 1}`
          );
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
          full_name: this.fullName,
          email: this.email,
          phone_number:
            this.phoneNumber.substring(0, 1) == "0"
              ? "+234" + this.phoneNumber.substring(1)
              : "+234" + this.phoneNumber,
          password: this.createPassword,
          password_confirmation: this.confirmPassword,
        })
        .then((response) => {
          this.loading2 = false;
          if (response.data.message === "Registeration successful.") {
            this.$store.commit("onboarding/setPresentSignupForm", "form1");
            this.$router.push({
              name: "Emailverification",
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
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.signup-container {
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .headings {
    font-size: 20px;
    font-family: "Product Sans" Medium;
    color: #2b2b2b;
  }
  .description {
    text-align: left;
    width: 90%;
    margin: auto;
    .v-icon {
      font-size: 25px;
      margin-bottom: 30px;
    }
  }
  .form-container {
    width: 90%;
    margin: auto;
    padding: 15px 0px;
  }
}
.phone-format {
  position: absolute;
  left: 28px;
  margin-top: 10px;
}
.input {
  width: 100%;
}
.v-btn:not(.v-btn--round).v-size--default {
  border-radius: 8px;
  font-family: "Product Sans Regular";
  font-size: 16px;
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