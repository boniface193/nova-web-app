<template>
  <div class="referral-earnings-container">
    <div v-show="!pageLoader">
      <!-- card section -->
      <div class="referral-earnings-container__referral-card mb-6">
        <img src="@/assets/images/reward.svg" alt="" />
        <div class="card-text px-8 py-10">
          <h2 class="white--text">Referral Earnings</h2>

          <p class="earnings white--text">
            <span>&#8358;{{ totalReferralEarnings.original_balance }}</span
            ><br />
            <span>{{ user.name }}</span>
          </p>
        </div>
      </div>
      <v-btn
        class="primary mt-5"
        :disabled="totalReferralEarnings.original_balance <= 100 ||confirmLoader"
        :loading="confirmLoader"
        @click="openConfirmationDialog()"
        depressed
        >Withdraw earnings</v-btn
      >

      <!-- referral earning list -->
      <div
        class="referral-earnings-container__earning-list"
        v-show="referralEarningList.length > 0"
      >
        <div
          class="referral-earnings-container__earning-list__item"
          v-for="(item, index) in referralEarningList"
          :key="index"
        >
          <div class="d-flex" style="width: 100%">
            <div
              class="referral-earnings-container__earning-list__item__profile mr-3"
            >
              <img v-if="item.image" :src="item.image" alt="profile" />
              <v-icon v-else size="80">mdi-account-circle</v-icon>
            </div>

            <div style="width: 100%" class="mt-2">
              <div class="d-flex justify-space-between mb-2">
                <h3 class="mb-0">{{ item.seller_name }}</h3>
                <h3 class="mb-0">+&#8358;{{ item.reward }}</h3>
              </div>
              <p class="mb-0">
                Sold
                <span class="primary--text"
                  >{{ item.quantity }} {{ item.product_name }}</span
                >
              </p>
            </div>
          </div>
        </div>
        <!-- pagination -->
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="d-flex justify-space-between align-center flex-wrap">
            <p class="mb-2 mr-5">
              Page {{ referralEarningsPageDetails.current_page }} of
              {{ referralEarningsPageDetails.last_page }}
            </p>
          </div>
          <div class="referral-earnings-container__pagination mb-2">
            <v-pagination
              v-model="referralEarningsPageDetails.current_page"
              :length="referralEarningsPageDetails.last_page"
              @input="setCurentPage"
              circle
            ></v-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- show when no referral yet -->
    <div
      class="text-center pt-10 pb-5"
      v-show="!pageLoader && referralEarningList.length == 0"
    >
      <p class="mb-0 secondary--text" style="font-size: 20px">
        No Referral Earnings Available!
      </p>
    </div>
    <!-- page loader -->
    <div class="text-center pt-10 pb-5" v-show="pageLoader">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
              &#8358;{{ totalReferralEarnings.original_balance  }}</span
            >
          </p>
          <!-- bank charges -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Bank charges: </span
            ><span class="ml-3"
              >&#8358;{{ totalReferralEarnings.bank_charges }}
            </span>
          </p>
          <!-- Processing fee -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Processing fee: </span
            ><span class="ml-3"
              >&#8358;{{ totalReferralEarnings.processing_fee }}
            </span>
          </p>
          <!-- verification fee -->
          <p class="mt-1 mb-0 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Verification fee: </span
            ><span class="ml-3"
              >&#8358;{{ totalReferralEarnings.verification_fee }}
            </span>
          </p>
          <!-- total amount receiveable -->
          <p class="mt-1 mb-5 mr-2 d-flex justify-space-between">
            <span style="font-weight: 600">Total amount receiveable: </span
            ><span class="ml-3"
              >&#8358;{{ totalReferralEarnings.amount_to_receive }}
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
              >&#8358;{{ totalReferralEarnings.amount_to_receive }}</span
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
import { mapState } from "vuex";
import failedImage from "@/assets/images/failed-img.svg";
import successImage from "@/assets/images/success-img.svg";
import Modal from "@/components/secondary/Modal.vue";
export default {
  name: "RefferalEarnings",
  components: { Modal },
  data: function () {
    return {
      dialogMessage: "",
      dialog: false,
      statusImage: null,
      pageLoader: false,
      withdrawLoader: false,
      confirmLoader: false,
      confirmationDialog: false,
      accountDetails: {
        data: {},
        meta: {
          has_bank_account: true,
        },
      },
    };
  },
  created() {
    this.pageLoader = true;
    this.$store.dispatch("referral/getTotalReferralEarnings").then(() => {
      this.getReferralEarningList();
    });
  },
  computed: {
    ...mapState({
      referralEarningList: (state) => state.referral.referralEarningList,
      totalReferralEarnings: (state) => state.referral.totalReferralEarnings,
      referralEarningsPageDetails: (state) => state.referral.referralEarningsPageDetails,
      user: (state) => state.settings.profile,
    }),
  },
  methods: {
    // get the list of earning from referring
    getReferralEarningList() {
      this.$store
        .dispatch("referral/getReferralEarningList")
        .then(() => {
          this.getUserBankDetails();
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
    // go to next page
    setCurentPage() {
      this.$store.commit(
        "referral/setPage",
        this.referralEarningsPageDetails.current_page
      );
    },
    // get user bank details
    getUserBankDetails() {
      this.$store
        .dispatch("bankService/getUserBankDetails", {
          user_id: this.user.id,
        })
        .then((response) => {
          this.pageLoader = false;
          this.accountDetails = response.data;
          if (this.accountDetails.meta.has_bank_account !== true) {
            this.$router.push({
              name: "AddBankDetails",
            });
          }
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
    openConfirmationDialog() {
      if (this.$store.getters["settings/profile"].kyc_status === "verified") {
        this.$store.commit("settings/setSellerStatus", true);
        this.confirmLoader = true;
        this.$store
          .dispatch("referral/getTotalReferralEarnings")
          .then(() => {
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
        .dispatch("bankService/withdrawReferralEarning")
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
  },
};
</script>
<style lang="scss" scoped>
.referral-earnings-container {
  width: 50%;
  &__referral-card {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    height: 250px;
    img {
      width: 100%;
    }
    .card-text {
      position: absolute;
      height: 100%;
      top: 0px;
      h2 {
        font-size: 23px;
      }
      p {
        font-size: 18px;
      }
    }
    .earnings {
      position: absolute;
      bottom: 8%;
    }
  }
  &__earning-list {
    &__item {
      display: flex;
      padding: 12px 0px;
      border-bottom: 1px solid #c4c4c4;
      &__profile {
        min-width: 80px;
        min-height: 80px;
        background: #ddefef;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  &__pagination {
    max-width: 450px;
  }
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
@media (max-width: 800px) {
  .referral-earnings-container {
    width: 100%;
  }
}
@media (max-width: 550px) {
  .referral-earnings-container {
    &__referral-card {
      .earnings {
        position: absolute;
        bottom: 35%;
      }
    }
  }
}
</style>