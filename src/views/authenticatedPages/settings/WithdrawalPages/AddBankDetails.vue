<template>
  <div>
    <div class="bank-container" v-show="!pageLoader">
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link :to="{ path: '/settings' }" style="text-decoration: none">
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <h3 class="align-self-center">Bank Accounts</h3>
      </div>

      <div class="mt-5 px-2">
        <h3 class="mb-4">Hello {{ userInfo.name }},</h3>

        <!-- description -->
        <p class="secondary--text mb-4">Please provide your bank details</p>

        <!-- error message -->
        <p class="error--text mb-1" v-show="error">{{ errorMsg }}</p>

        <!-- form section -->
        <v-form ref="form">
          <!-- Select Bank -->
          <div class="mb-9">
            <p class="mb-1">Bank *</p>
            <customSelect
              width="100%"
              height="57px"
              caretColor="#029B97"
              placeholder="Select bank"
              :searchBar="true"
              :items="bankList"
              :item="bank.name"
              :inputStatus="bankError"
              @selectedItem="setBank"
            />
            <div v-if="bankError === true" class="inputError error--text">
              Bank is required
            </div>
          </div>

          <!-- acciunt number field-->
          <div class="mb-5">
            <p class="mb-1">Account Number *</p>
            <v-text-field
              class="input mt-0"
              v-model="accNumber"
              :rules="accountNumRules"
              type="number"
              color="primary"
              placeholder="Enter account number"
              @keyup="validateAccount"
              required
            >
            </v-text-field>
            <div class="primary--text">
              <span v-show="!fetchingAccountDetails">{{
                accountDetails.account_name
              }}</span>
              <span v-show="fetchingAccountDetails">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="20"
                ></v-progress-circular>
              </span>
            </div>
          </div>

          <v-btn
            class="primary px-4"
            :disabled="!accountVerified || this.accNumber.length !== 10"
            @click="openPasswordModal"
            depressed
            >Save and continue</v-btn
          >
        </v-form>
      </div>
    </div>
    <!-- page loader -->
    <div class="d-flex text-center" v-if="pageLoader">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      ></v-progress-circular>
    </div>
    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog = false"
            >mdi-close</v-icon
          >
        </div>
        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </Modal>
    <!-- Modal for dialog messages -->
    <Modal :dialog="passwordDialog" width="300">
      <div class="white pa-3 pb-2 dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="passwordDialog = false"
            >mdi-close</v-icon
          >
        </div>
        <div class="px-4">
          <p class="mt-2 mb-1">
            Please enter your password for security measures
          </p>
          <!-- error message -->
          <p class="error--text mt-2 mb-1" v-show="passwordError">
            {{ passwordErrorMsg }}
          </p>
          <!-- form section-->
          <v-form class="password-container" ref="passwordForm">
            <!-- password -->
            <v-text-field
              class="input mt-5"
              v-model="password"
              :rules="passwordRules"
              type="password"
              label="Enter your password"
              color="primary"
              required
              @keyup.enter="setAccountDetails()"
            ></v-text-field>
            <v-text-field style="display: none"></v-text-field>

            <!-- button container -->
            <div class="pa-0 mt-1" style="width: 100%">
              <v-btn
                class="primary mb-5 mx-auto"
                :loading="loading"
                :disabled="loading"
                @click="setAccountDetails()"
                >Submit</v-btn
              >
            </div>
          </v-form>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import customSelect from "@/components/secondary/CustomSelect.vue";
import { mapGetters } from "vuex";
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "WithdrawFund",
  components: { customSelect, Modal },
  props: ["accountDetails"],
  data: function () {
    return {
      password: "",
      loading: false,
      passwordError: false,
      passwordErrorMsg: "",
      accNumber: "",
      bank: {},
      dialog: false,
      dialogMessage: "",
      error: false,
      errorMsg: "",
      statusImage: null,
      pageLoader: false,
      bankError: false,
      fetchingAccountDetails: false,
      accountVerified: false,
      passwordDialog: false,
      accountNumRules: [
        // verifies email address satisfies the requirement
        (v) => !!v || "Account Number is required",
        (v) => v.length == 10 || "Invalid account number",
      ],
      passwordRules: [
        // verifies password satisfies the requirement
        (v) => !!v || "Password is required",
      ],
    };
  },
  created() {
    if (this.bankList.length === 0) {
      this.getBankList();
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
      bankList: "bankService/bankList",
    }),
  },
  methods: {
    // get the list of banks
    getBankList() {
      this.pageLoader = true;
      this.$store
        .dispatch("bankService/getBankList")
        .then((response) => {
          this.$store.commit("bankService/setBankList", response.data.data);
          this.pageLoader = false;
        })
        .catch((error) => {
          this.pageLoader = false;
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // verfiy that category is selected
    verifyBankSelect() {
      if (this.bank.name === "") {
        this.bankError = true;
      } else {
        this.bankError = false;
        this.validateAccount();
        this.accountVerified = false;
      }
    },
    setBank(params) {
      this.bank = params;
      this.verifyBankSelect();
    },
    validateAccount() {
      if (this.bank.name !== undefined && this.accNumber.length == 10) {
        this.fetchingAccountDetails = true;
        this.accountVerified = false;
        this.$store
          .dispatch("bankService/validateBankAccount", {
            account_number: this.accNumber,
            bank_code: this.bank.code,
            bank_name: this.bank.name,
          })
          .then((response) => {
            this.accountDetails = response.data.data;
            this.accountVerified = true;
            this.error = false;
            this.errorMsg = "";
            this.fetchingAccountDetails = false;
          })
          .catch((error) => {
            this.accountVerified = false;
            this.accountDetails = {};
            this.fetchingAccountDetails = false;

            if (error.status == 422 || error.status == 400) {
              this.error = true;
              this.errorMsg = error.data.message;
            }
          });
      }
    },
    setAccountDetails() {
      this.$refs.passwordForm.validate();
      this.loading = true;
      if (this.$refs.passwordForm.validate()) {
        this.$store
          .dispatch("bankService/setAccountDetails", {
            account_number: this.accNumber,
            bank_code: this.bank.code,
            bank_name: this.bank.name,
            password: this.password,
          })
          .then(() => {
            this.loading = false;
            this.passwordError = false;
            this.passwordDialog = false;
            // get lastest profile information
            location.reload();
          })
          .catch((error) => {
            this.loading = false;
            if (error.status == 422 || error.status == 400) {
              this.passwordError = true;
              if (error.data.errors.password) {
                this.passwordErrorMsg = error.data.errors.password[0];
              } else if (error.data.errors.account_number) {
                this.passwordErrorMsg = error.data.errors.account_number[0];
              }
            }
          });
      }
    },
    openPasswordModal() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.passwordDialog = true;
        this.$refs.passwordForm.reset();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bank-container {
  width: 50%;
}
.password-container .v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 100%;
  padding: 0 16px;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
.inputError {
  line-height: 12px;
  word-break: break-word;
  word-wrap: break-word;
  font-size: 12px;
  margin-top: 8px;
  padding-left: 12px;
}
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
@media (max-width: 750px) {
  .bank-container {
    width: 100%;
  }
}
@media (max-width: 500px) {
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 100%;
  }
}
</style>