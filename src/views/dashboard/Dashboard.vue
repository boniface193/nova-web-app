<template>
  <div>
    <div class="primary pb-12 py-12">
      <div class="mx-7">
        <Calender class="float-right" autoApply @updateDate="dateValue" />
        <div class="welcome-text">Hello,</div>
        <div class="welcome-text-sm">{{ userInfo.name }}</div>
      </div>
      <div class="mx-7 mt-8 d-flex justify-center">
        <v-row style="position: absolute; width: 90%">
          <!-- current sales -->
          <v-col cols="6" sm="4" md="" lg="" class="pr-0">
            <v-card
              v-if="currentLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <v-skeleton-loader type="article"> </v-skeleton-loader>
            </v-card>
            <v-card
              v-if="!currentLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <div class="text-center">
                <div class="d-flex justify-center pt-5">
                  <div class="mx-4 position-abs">
                    <img
                      src="@/assets/images/shopping.png"
                      width="21.5"
                      height="21.27"
                      class="ml-percent mt-4"
                    />
                  </div>
                  <div
                    class="rounded-pill pa-7 text-center round-img-bg-danger"
                  ></div>
                </div>
                <div class="card-header">₦{{ curentSale }}</div>
                <div class="card-sale">In sales</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error':
                      diffCurrentSales == 0 || diffCurrentSales.includes('-'),
                  }"
                >
                  {{ diffCurrentSales }}
                </div>
                <div class="card-history my-2">
                  <router-link
                    :to="{ name: 'SettlementHistory' }"
                    style="text-decoration: none"
                  >
                    Settlement history<v-icon size="12" class="primary--text"
                      >mdi-arrow-right</v-icon
                    ></router-link
                  >
                </div>
              </div>
            </v-card>
          </v-col>
          <!-- current sale -->

          <!-- payment total revenue -->
          <v-col cols="6" sm="4" md="" lg="" class="pr-0">
            <v-card
              v-if="payment"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <v-skeleton-loader type="article"> </v-skeleton-loader>
            </v-card>
            <v-card
              v-if="!payment"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <div class="text-center">
                <div class="d-flex justify-center pt-5">
                  <div class="mx-4 position-abs">
                    <img
                      src="@/assets/images/money.svg"
                      width="21.5"
                      height="21.27"
                      class="ml-percent mt-4"
                    />
                  </div>
                  <div
                    class="rounded-pill pa-7 text-center round-img-bg-success"
                  ></div>
                </div>
                <div class="card-header">₦{{ totalRevenue }}</div>
                <div class="card-sale">In profits</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error':
                      awaitingSettlement == 0 ||
                      awaitingSettlement.includes('-'),
                  }"
                >
                  {{ awaitingSettlement }}
                  <span class="awaiting">(awaiting settlements)</span>
                </div>
                <div class="card-history my-2">
                  <router-link
                    :to="{ name: 'AddBankDetails' }"
                    style="text-decoration: none"
                  >
                    Withdraw funds<v-icon size="12" class="primary--text"
                      >mdi-arrow-right</v-icon
                    ></router-link
                  >
                </div>
              </div>
            </v-card>
          </v-col>
          <!-- payment total Revenue -->

          <!-- sale point -->
          <v-col cols="6" sm="4" md="" lg="" class="pr-0">
            <v-card
              v-if="sellLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <v-skeleton-loader type="article"> </v-skeleton-loader>
            </v-card>
            <v-card
              v-if="!sellLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <div class="text-center">
                <div class="d-flex justify-center pt-5">
                  <div class="mx-4 position-abs">
                    <img
                      src="@/assets/images/group.svg"
                      width="21.5"
                      height="21.27"
                      class="ml-percent mt-4"
                    />
                  </div>
                  <div
                    class="rounded-pill pa-7 text-center round-img-bg-primary"
                  ></div>
                </div>
                <div class="card-header">₦{{ cSales }}</div>
                <div class="card-sale">Sales Points</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error': diffSales == 0 || diffSales.includes('-'),
                  }"
                >
                  {{ diffSales }}
                </div>
                <div class="card-history my-2">
                  <router-link
                    :to="{ name: 'reward' }"
                    style="text-decoration: none"
                  >
                    Claim reward<v-icon size="12" class="primary--text"
                      >mdi-arrow-right</v-icon
                    ></router-link
                  >
                </div>
              </div>
            </v-card>
          </v-col>
          <!-- end of sale point -->

          <!-- sallers rank-->
          <v-col cols="6" sm="4" md="" lg="" class="pr-0">
            <v-card
              v-if="rankLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <v-skeleton-loader type="article"> </v-skeleton-loader>
            </v-card>
            <v-card
              v-if="!rankLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <div class="text-center">
                <div class="d-flex justify-center pt-5">
                  <div class="mx-4 position-abs">
                    <img
                      src="@/assets/images/cup.svg"
                      width="21.5"
                      height="21.27"
                      class="ml-percent mt-4"
                    />
                  </div>
                  <div
                    class="rounded-pill pa-7 text-center round-img-bg-warning"
                  ></div>
                </div>
                <div class="card-header">₦{{ pRank }}</div>
                <div class="card-sale">on leaderboard</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error': diffSales == 0 || diffSales.includes('-'),
                  }"
                >
                  {{ diffRank }}
                </div>
                <div class="card-history my-2">
                  <router-link
                    :to="{ name: 'leaderboard' }"
                    style="text-decoration: none"
                  >
                    View Leaderboard<v-icon size="12" class="primary--text"
                      >mdi-arrow-right</v-icon
                    ></router-link
                  >
                </div>
              </div>
            </v-card>
          </v-col>
          <!-- end of sallers rank -->
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Calender from "@/components/general/calender.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Calender,
    // Layout,
  },
  data() {
    return {
      // seller
      sellLoading: true,
      cSales: "",
      diffSales: "",
      // rank
      rankLoading: true,
      pRank: "",
      diffRank: "",
      // getSellerTotalSale
      currentSales: "",
      diffCurrentSales: "",
      currentLoading: true,
      // total payment
      totalRevenue: "",
      settled: "",
      awaitingSettlement: "",
      availableBalance: "",
      payment: true,
    };
  },
  computed: {
    ...mapGetters({
      dashboard: "dashboard/dashboard",
      userInfo: "settings/profile",
    }),
  },
  created() {
    this.$store.dispatch("dashboard/getSellerPoint").then((res) => {
      let resObj = {
        difference: res.diff.toString(),
        curentSale: res.current_sales.toString(),
      };
      this.cSales = resObj.curentSale;
      this.diffSales = resObj.difference;
      this.sellLoading = false;
    });

    this.$store.dispatch("dashboard/getSellerRank").then((res) => {
      let resObj = {
        difference: res.diff.toString(),
        curentSale: res.present_rank.toString(),
      };
      this.pRank = resObj.curentSale;
      this.diffRank = resObj.difference;
      this.rankLoading = false;
    });

    this.$store.dispatch("dashboard/getSellerTotalSale").then((res) => {
      let resObj = {
        difference: res.current_sales.toString(),
        curentSale: res.diff.toString(),
      };
      this.curentSale = resObj.difference;
      this.diffCurrentSales = resObj.curentSale;
      this.currentLoading = false;
    });
    if (this.userInfo.id === "") {
      this.$store.dispatch("settings/getUserProfile").then(() => {
        this.$store
          .dispatch("dashboard/getTotalRevenue", { id: this.userInfo.id })
          .then((res) => {
            console.log("payment if", res);
            this.totalRevenue = res.total_revenue;
            this.settled = res.settled;
            this.awaitingSettlement = res.awaiting_settlement;
            this.availableBalance = res.available_balance;
            this.payment = false
          });
      });
    } else {
      this.$store
        .dispatch("dashboard/getTotalRevenue", { id: this.userInfo.id })
        .then((res) => {
          console.log("payment else", res);
          this.totalRevenue = res.total_revenue;
          this.settled = res.settled;
          this.awaitingSettlement = res.awaiting_settlement;
          this.availableBalance = res.available_balance;
          this.payment = false
        });
    }
  },
  methods: {
    dateValue(value) {
      this.$store.commit("dashboard/filterRange", {
        startDate: moment(value.startDate).format("L"),
        endDate: moment(value.endDate).format("L"),
      });
      this.$store.dispatch("dashboard/searchSellerPoint");
      this.$store.dispatch("dashboard/searchSellerRank");
      this.$store.dispatch("dashboard/searchSellerTotalSales");
      this.$store.dispatch("dashboard/getTotalRevenue");
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome-text {
  font-family: "Product Sans Medium";
  font-weight: normal;
  color: #ffffff;
  font-size: 24px;
}
.welcome-text-sm {
  font-family: "Product Sans Light";
  font-weight: lighter;
  font-variant: normal;
  letter-spacing: 0.8px;
  font-size: 16px;
  color: #ffffff;
}
.round-img-bg-danger {
  background: #ffecec 0% 0% no-repeat padding-box;
}
.round-img-bg-success {
  background: #dbffdc 0% 0% no-repeat padding-box;
}
.round-img-bg-primary {
  background: #eaecf9 0% 0% no-repeat padding-box;
}
.round-img-bg-warning {
  background: #fff4d2 0% 0% no-repeat padding-box;
}
.position-abs {
  position: absolute;
  z-index: 1;
}
.ml-percent {
  z-index: 1 !important;
}
.card-header {
  color: #2b2b2b;
  font-size: 17px;
  font-family: "Product Sans Bold";
  margin: 10px 0px 0px 0px;
  font-weight: bold;
}
.card-sale {
  color: #979797;
  font-family: "Product Sans Light";
  font-size: 12px;
}
.card-success {
  color: #29db58;
  font-size: 10px;
  font-family: "Product Sans Bold";
}
.card-error {
  color: #ff3b3b;
  font-size: 10px;
  font-family: "Product Sans Bold";
}
.card-history {
  color: #5063ca;
  font-family: "Product Sans Medium";
  font-size: 10px;
}
.awaiting {
  color: #979797;
  font-family: "Product Sans Light";
  font-size: 8px;
}
</style>