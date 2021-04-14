<template>
  <div class="signin-container">
    <!-- app logo -->
    <router-link to="/" class="d-flex dark--text app-logo">
      <div class="nova-logo d-flex align-center justify-center mx-auto my-5">
        <img src="@/assets/images/primary-logo.png" />
      </div>
    </router-link>
    <h3 class="headings">Login into your Account</h3>

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
        label="Email or phoneNumber"
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
          to="/forgotpassword"
          class="primary--text"
          style="text-decoration: none"
          ><span style="font-size: 13px">Forgot password?</span></router-link
        >
      </div>

      <!-- button container -->
      <div class="pa-0 mt-5">
        <v-btn height="48px" block depressed
          class="primary mb-5 mx-auto"
          @click="validateForm"
          :loading="loading"
          :disabled="loading"
          >Log In</v-btn
        >

        <!-- create account link -->
        <p style="font-size: 16px; font-family: 'Product Sans' Light; color: #646464;">
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
export default {
  name: "Signin",
  data: function () {
    return {
      errorMessage: "",
      error: false,
      loading: false,
      email: "",
      password: "",
      showPassword: true,
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
        this.signin();
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
        })
        .then((response) => {
          this.loading = false;
          if (response.data.message === "Login successful.") {
            this.$router.push({ name: "InventoryHome" });
          }
        })
        .catch((error) => {
          this.error = true;
          this.loading = false;
          if (error.response) {
            this.errorMessage = `Incorrect email address or password`;
          } else {
            this.errorMessage = "No internet Connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.signin-container {
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .headings {
    font-size: 20px;
    font-family: "Product Sans" Medium;
    color: #2b2b2b;
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
.input {
  width: 100%;
}
.v-btn:not(.v-btn--round).v-size--default {
  border-radius: 8px;
  font-family: 'Product Sans Regular';
  font-size: 16px;
  
}
</style>