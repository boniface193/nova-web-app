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
      <v-text-field style="display:none"></v-text-field>

      <!-- button container -->
      <div class="pa-0 mt-5" style="width: 100%">
        <v-btn
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
export default {
  name: "Forgotpassword",
  data: function () {
    return {
      error: false,
      errorMessage: "",
      loading: false,
      email: "",
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
        this.submitEmail();
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
        })
        .then((response) => {
          this.loading = false;
          if (response.data.message === "An OTP has been sent to your email.") {
            this.$router.push({
              name: "Forgotpasswordverification",
              params: { email: emailAddress },
            });
          }
        })
        .catch((error) => {
          this.error = true;
          this.loading = false;
          if (error.response) {
            this.errorMessage = `This Account does not Exist`;
          } else {
            this.errorMessage = `No internet Connection!`;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.forgotpassword-container {
  width: 100%;
  text-align: center;
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
  height: 45px;
  min-width: 80%;
  padding: 0 16px;
}
@media (max-width: 700px) {
  .forgotpassword-container {
    width: 100%;
    text-align: center;
    .app-logo {
      margin: 20px 0px;
    }
    .description {
      text-align: left;
      width: 90%;
      margin: auto;
    }
  }
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 100%;
    padding: 0 16px;
  }
}
</style>