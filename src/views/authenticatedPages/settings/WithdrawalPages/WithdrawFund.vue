<template>
  <div>
    <div class="withdraw-container">
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link
          :to="{ name: 'ProfilePage' }"
          style="text-decoration: none"
        >
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <h3 class="align-self-center">Withdrawal</h3>
      </div>

      <div>
        <div class="d-flex align-center">
          <div class="profile-image">
            <img src="@/assets/images/user-profile.svg" alt="" />
          </div>
          <h4>{{ userInfo.name }}</h4>
        </div>
        <div class="account-details-container">
          <div class="d-flex justify-space-between align-center my-5">
            <p class="secondary--text mb-0">Your balance:</p>
            <h3 v-show="!fetchingBalance">
              &#8358;{{ revenueDetails.available_balance_label }}
            </h3>
            <span v-show="fetchingBalance">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </span>
          </div>
          <div class="d-flex justify-space-between align-baseline my-5">
            <p class="secondary--text mb-0">To:</p>
            <div class="text-right">
              <h3>{{ this.accountDetails.data.name }}</h3>
              <h5>{{ this.accountDetails.data.number }}</h5>
              <h5>{{ this.accountDetails.data.bank_name }}</h5>
            </div>
          </div>
          <!-- <div class="d-flex justify-space-between align-baseline my-5 mb-10">
            <p class="secondary--text mb-0">Charges:</p>
            <h5>&#8358;100</h5>
          </div> -->
          <!-- withdrwa btn -->
          <v-btn
            class="primary mt-5"
            :disabled="revenueDetails.available_balance <= 100 || confirmLoader"
            :loading="confirmLoader"
            @click="openConfirmationDialog()"
            depressed
            >Withdraw</v-btn
          >
          <!-- change account btn -->
          <router-link
            :to="{ name: 'EditBankDetails' }"
            style="text-decoration: none"
          >
            <v-btn class="mt-5 primary--text background" depressed
              >Change account number
            </v-btn>
          </router-link>
          <!-- payment history btn -->
          <router-link
            :to="{ name: 'PaymentHistory' }"
            style="text-decoration: none"
          >
            <v-btn class="mt-5 primary--text background" depressed
              >Payment History
            </v-btn>
          </router-link>
           <!-- payment history btn -->
          <router-link
            :to="{ name: 'Kyc' }"
            style="text-decoration: none"
          >
            <v-btn class="mt-5 primary--text background" depressed
              >Complete Kyc Verification
            </v-btn>
          </router-link>
        </div>
      </div>
    </div>

    <!-- confirmation Modal -->
    <Modal :dialog="confirmationDialog" width="550">
      <div class="white pa-3 px-5 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon
            class="error--text close-btn"
            @click="confirmationDialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="text-left confirmation-dialog">
          <p class="mt-5 mb-5">
            <span style="font-weight: 600">Payment method: </span
            ><span
              class="ml-3 primary white--text px-3 py-1"
              style="border-radius: 5px"
            >
              Bank transfer</span
            >
          </p>

          <!-- Available balance -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Available balance: </span
            ><span class="ml-3">
              &#8358;{{ withdrawDetails.original_balance }}</span
            >
          </p>
          <!-- bank charges -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Bank charges: </span
            ><span class="ml-3"
              >&#8358;{{ withdrawDetails.bank_charges }}
            </span>
          </p>
          <!-- Processing fee -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Processing fee: </span
            ><span class="ml-3"
              >&#8358;{{ withdrawDetails.processing_fee }}
            </span>
          </p>
          <!-- verification fee -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Verification fee: </span
            ><span class="ml-3"
              >&#8358;{{ withdrawDetails.verification_fee }}
            </span>
          </p>
          <!-- total amount receiveable -->
          <p class="mt-1 mb-5 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Total amount receiveable: </span
            ><span class="ml-3"
              >&#8358;{{ withdrawDetails.amount_to_receive }}
            </span>
          </p>

          <!-- acount details -->
          <h5>
            <span>Account name: </span
            ><span class="secondary--text">{{
              this.accountDetails.data.name
            }}</span>
          </h5>
          <h5>
            <span>Account number: </span
            ><span class="secondary--text">{{
              this.accountDetails.data.number
            }}</span>
          </h5>
          <h5>
            <span>Bank name: </span
            ><span class="secondary--text">{{
              this.accountDetails.data.bank_name
            }}</span>
          </h5>

          <p class="mt-4">
            You are about to send
            <span class="primary--text"
              >&#8358;{{ withdrawDetails.amount_to_receive }}</span
            >
            to your bank account
          </p>

          <!-- withdraw btn -->
          <v-btn
            class="primary mt-5 mx-auto"
            :disabled="withdrawLoader"
            :loading="withdrawLoader"
            @click="withdrawFunds()"
            depressed
            >Get Paid Now</v-btn
          >
        </div>
      </div>
    </Modal>

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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import failedImage from "@/assets/images/failed-img.svg";
import successImage from "@/assets/images/success-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "WithdrawFund",
  components: { Modal },
  props: ["accountDetails"],
  data: function () {
    return {
      pageLoader: false,
      dialogMessage: "",
      dialog: false,
      statusImage: null,
      withdrawLoader: false,
      fetchingBalance: false,
      revenueDetails: {
        available_balance: 0,
      },
      withdrawDetails: {},
      confirmLoader: false,
      confirmationDialog: false,
    };
  },
  created() {
    this.fetchingBalance = true;
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.getRevenueDetails();
      });
    } else {
      this.getRevenueDetails();
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
    }),
    getAccountDetails() {
      return {
        accountDetails: this.accountDetails,
      };
    },
  },
  methods: {
    // separate money with comma
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    openConfirmationDialog() {
      if (
        this.$store.getters["settings/profile"].kyc_status === "verified"
      ) {
        this.$store.commit("settings/setSellerStatus", true);
        this.confirmLoader = true;
        this.$store
          .dispatch("bankService/getWithdrawalFees")
          .then((response) => {
            this.withdrawDetails = response.data.data;
            this.confirmLoader = false;
            this.confirmationDialog = true;
          })
          .catch((error) => {
            if (error.status == 400 || error.status == 422) {
              this.dialogMessage = error.data.message;
              this.statusImage = failedImage;
              this.dialog = true;
            }
          });
      } else {
        this.$router.push({
          name: "Kyc",
        });
      }
    },
    withdrawFunds() {
      this.withdrawLoader = true;
      this.$store
        .dispatch("bankService/withdrawFunds")
        .then(() => {
          this.confirmationDialog = false;
          this.withdrawLoader = false;
          this.dialog = true;
          this.statusImage = successImage;
          this.fetchingBalance = true;
          this.getRevenueDetails();

          this.dialogMessage =
            "Your request have been received successfully, your account would be credited within 24hrs";
        })
        .catch((error) => {
          this.confirmationDialog = false;
          this.withdrawLoader = false;
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
    // fetch revenue details
    getRevenueDetails() {
      this.$store
        .dispatch("bankService/getRevenueDetails", {
          sellerId: this.userInfo.id,
        })
        .then((response) => {
          this.revenueDetails = response.data.data;
          this.fetchingBalance = false;
        })
        .catch((error) => {
          this.fetchingBalance = false;
          if (error.status == 422 || error.status == 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.withdraw-container {
  width: 50%;
}
.back-btn {
  position: absolute;
  left: 0px;
  top: 0;
}
.profile-image {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  img {
    width: 100%;
    height: 100%;
  }
}
.account-details-container {
  width: 500px;
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 100%;
    padding: 0 16px;
    border-radius: 12px;
  }
}
.confirmation-dialog {
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    min-width: 80%;
    padding: 0 16px;
    border-radius: 8px;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 950px) {
  .withdraw-container {
    width: 100%;
  }
}
@media (max-width: 550px) {
  .account-details-container {
    width: 100%;
  }
}
</style>