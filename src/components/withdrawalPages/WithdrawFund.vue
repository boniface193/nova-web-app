<template>
  <div>
    <div class="withdraw-container">
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link :to="{ path: '/dashboard' }" style="text-decoration: none">
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
            <h3 v-show="!fetchingBalance">&#8358;{{revenueDetails.available_balance}}</h3>
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
          <div class="d-flex justify-space-between align-baseline my-5 mb-10">
            <p class="secondary--text mb-0">Charges:</p>
            <h5>&#8358;100</h5>
          </div>
          <!-- withdrwa btn -->
          <v-btn
            class="primary mt-5"
            :disabled="withdrawLoader"
            :loading="withdrawLoader"
            @click="withdrawFunds()"
            >Withdraw</v-btn
          >
          <!-- change account btn -->
          <router-link
            :to="{ name: 'EditBankDetails' }"
            style="text-decoration: none"
          >
            <v-btn class="mt-5 primary--text" style="background: #f3f5ff"
              >Change account number
            </v-btn>
          </router-link>
          <!-- payment history btn -->
          <router-link
            :to="{ name: 'PaymentHistory' }"
            style="text-decoration: none"
          >
            <v-btn class="mt-5 primary--text" style="background: #f3f5ff"
              >Payment History
            </v-btn>
          </router-link>
        </div>
      </div>
    </div>

    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="400">
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
    </modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import failedImage from "@/assets/images/failed-img.svg";
import successImage from "@/assets/images/success-img.svg";
import modal from "@/components/modal.vue";
export default {
  name: "WithdrawFund",
  components: { modal },
  props: ["accountDetails"],
  data: function () {
    return {
      pageLoader: false,
      dialogMessage: "",
      dialog: false,
      statusImage: null,
      withdrawLoader: false,
      fetchingBalance: false,
      revenueDetails: {},
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
    withdrawFunds() {
      this.withdrawLoader = true;
      this.$store
        .dispatch("bankService/withdrawFunds")
        .then(() => {
          this.withdrawLoader = false;
          this.dialog = true;
          this.statusImage = successImage;
          this.dialogMessage =
            "Your request have been received successfully, your account would be credited within 24hrs";
        })
        .catch((error) => {
          this.withdrawLoader = false;
          this.dialog = true;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = error.response.data.message;
          } else {
            this.dialogMessage = "No internet Connection!";
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
          this.fetchingBalance  = false;
        })
        .catch((error) => {
          this.dialog = true;
          this.fetchingBalance  = false;
          this.statusImage = failedImage;
          if (error.response) {
            this.dialogMessage = error.response.data.message;
          } else {
            this.dialogMessage = "No internet Connection!";
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