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
        type="password"
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
        type="password"
        color="primary"
        required
        ref="input2"
        @keyup.enter="validatePassword()"
      ></v-text-field>

      <!-- button container -->
      <div class="pa-0 mt-5" style="width: 100%">
        <v-btn
          class="primary py-5 mb-5 mx-auto"
          @click="validatePassword()"
          :loading="loading"
          :disabled="loading"
          >Submit</v-btn
        >
      </div>
    </v-form>

    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="400">
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
    </modal>
  </div>
</template>
<script>
import modal from "@/components/modal.vue";
import successImage from "@/assets/images/success-img.svg";
import failedImage from "@/assets/images/failed-img.svg";
export default {
  name: "Recoverpassword",
  components: { modal },
  data: function () {
    return {
      dialog: false,
      statusImage: null,
      dialogMessage: "",
      error: false,
      errorMessage: "",
      loading: false,
      createPassword: "",
      confirmPassword: "",
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
  methods: {
    //validates form
    validatePassword() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.recoverPassword();
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
          this.statusImage = failedImage;
          if (error.response) {
            this.errorMessage = "something went wrong, pls try again";
          } else {
            this.errorMessage = "No internet Connection!";
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.recoverpassword-container {
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
</style>