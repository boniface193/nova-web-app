<template>
  <div class="dashboard-container mx-auto">
    <div class="primary pt-16 pb-16" style="height: 280px">
      <div class="mt-8 px-5 px-md-7">
        <!-- <Calender class="float-right" autoApply @updateDate="dateValue" /> -->
        <div class="welcome-text">Hello,</div>
        <div class="welcome-text-sm">{{ userInfo.name }}</div>
      </div>
      <div
        class="
          mt-16
          pb-16
          px-5 px-md-7
          card-container
        "
      >
        <!-- current sales -->
        <div class="card mr-0 mr-sm-4 mb-6">
          <v-skeleton-loader type="article" v-if="currentLoading">
          </v-skeleton-loader>
          <div v-if="!currentLoading">
            <div
              class="content-img"
              style="background: #ffecec 0% 0% no-repeat padding-box"
            >
              <img src="@/assets/icons/shopping.png" />
            </div>

            <h3>&#8358; {{ curentSale }}</h3>
            <p class="card-sale mb-1">In sales</p>

            <p
              class="card-success mb-0"
              :class="{
                'card-error':
                  awaitingSettlement == 0 || awaitingSettlement.includes('-'),
              }"
            >
              {{ awaitingSettlement }}
            </p>
            <!-- settlements link -->
            <router-link
              :to="{ name: 'SettlementHistory' }"
              style="text-decoration: none"
              class="card-history my-1"
            >
              Settlement history<v-icon size="12" class="primary--text ml-1"
                >mdi-arrow-right</v-icon
              ></router-link
            >
          </div>
        </div>
        <!-- payment total revenue -->
        <div class="card mr-0 mr-sm-4 mb-6">
          <v-skeleton-loader type="article" v-if="payment"></v-skeleton-loader>
          <div v-if="!payment">
            <div
              class="content-img"
              style="background: #dbffdc 0% 0% no-repeat padding-box"
            >
              <img src="@/assets/icons/money.svg" />
            </div>
            <h3>&#8358; {{ totalRevenue }}</h3>
            <p class="card-sale mb-1">In profits</p>

            <p
              class="card-success mb-0"
              :class="{
                'card-error':
                  awaitingSettlement == 0 || awaitingSettlement.includes('-'),
              }"
            >
              {{ awaitingSettlement }}
              <span class="awaiting">(awaiting settlements)</span>
            </p>
            <!-- withdraw fund link -->
            <router-link
              :to="{ name: 'AddBankDetails' }"
              style="text-decoration: none"
              class="card-history my-1"
            >
              Withdraw funds<v-icon size="12" class="primary--text ml-1"
                >mdi-arrow-right</v-icon
              ></router-link
            >
          </div>
        </div>
        <!-- sale point -->
        <div class="card mr-0 mr-sm-4 mb-6">
          <v-skeleton-loader
            type="article"
            v-if="sellLoading"
          ></v-skeleton-loader>
          <div v-if="!sellLoading">
            <div
              class="content-img"
              style="background: #eaecf9 0% 0% no-repeat padding-box"
            >
              <img src="@/assets/icons/group.svg" />
            </div>
            <h3>{{ diffSales }}</h3>
            <p class="card-sale mb-1">Lifetime Sales Points</p>
            <p
              class="card-success mb-0"
              :class="{
                'card-error': cSales == 0 || cSales.includes('-'),
              }"
            >
              {{ diffSales }}
              <span class="awaiting">( available points )</span>
            </p>
            <!-- reward link -->
            <router-link
              :to="{ name: 'Reward' }"
              style="text-decoration: none"
              class="card-history my-1"
            >
              Claim reward<v-icon size="12" class="primary--text ml-1"
                >mdi-arrow-right</v-icon
              ></router-link
            >
          </div>
        </div>
        <!-- Refer now -->
        <div class="card mr-0 mr-sm-4 mb-6">
          <v-skeleton-loader type="article" v-if="earningLoading"></v-skeleton-loader>
          <div v-if="!earningLoading">
            <div
              class="content-img"
              style="background: #dbffdc 0% 0% no-repeat padding-box"
            >
              <img src="@/assets/icons/money.svg" />
            </div>
            <h3>&#8358; {{ referralEarnings }}</h3>
            <p class="card-sale mb-1">In referral earnings</p>

            <!-- withdraw fund link -->
            <router-link
              :to="{ name: 'ReferFriends' }"
              style="text-decoration: none"
              class="mt-3"
            >
              <v-btn style="height: 35px" class="primary mx-auto">Refer now</v-btn>
            </router-link>
          </div>
        </div>
        <!-- sellers rank-->
        <div class="card mr-0 mr-sm-4 mb-6">
          <v-skeleton-loader
            type="article"
            v-if="rankLoading"
          ></v-skeleton-loader>
          <div v-if="!rankLoading">
            <div
              class="content-img"
              style="background: #fff4d2 0% 0% no-repeat padding-box"
            >
              <img src="@/assets/icons/cup.svg" />
            </div>
            <h3>{{ pRank || "-" }}</h3>
            <p class="card-sale mb-1">On leaderboard</p>
            <p
              class="card-success mb-0"
              :class="{
                'card-error': diffRank === '0' || diffRank.includes('-'),
              }"
            >
              {{ diffRank || "-" }}
            </p>
            <!-- leaderboard link -->
            <router-link
              :to="{ name: 'Leaderboard' }"
              style="text-decoration: none"
              class="card-history my-1"
            >
              View Leaderboard<v-icon size="12" class="primary--text ml-1"
                >mdi-arrow-right</v-icon
              ></router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
//import Calender from "@/components/general/calender.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    //Calender,
    // Layout,
  },
  metaInfo() {
    return {
      title: "Kuuzza | Dashboard"
    };
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
      earningLoading: true,
      referralEarnings: 0
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
    // .catch((error) => {
    //   if (error.status === 401 || error.status === 403) {
    //     localStorage.removeItem("accessToken");
    //     window.location.href = "/signin";
    //   }
    // });

    this.$store.dispatch("dashboard/getSellerRank").then((res) => {
      let resObj = {
        difference: res.today_rank === null ? "" : res.today_rank.toString(),
        curentSale:
          res.overall_rank === null ? "" : res.overall_rank.toString(),
      };
      this.pRank = resObj.curentSale;
      this.diffRank = resObj.difference;
      this.rankLoading = false;
    });
    // referral earning 
    this.$store.dispatch("referral/getTotalReferralEarnings").then((res) => {
      this.earningLoading = false;
      this.referralEarnings = res.data.data.total_reward
    });

    this.$store.dispatch("dashboard/getSellerTotalSale").then((res) => {
      let resObj = {
        difference: res.current_sales_label,
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
            this.totalRevenue = res.total_revenue_label;
            this.settled = res.settled;
            // convertion to thousands
            let awaitingSettle = Math.floor(res.awaiting_settlement);
            let convertToString = awaitingSettle.toString();
            if (convertToString.length >= 4) {
              let roundedSettlement = `${awaitingSettle / 1000}k`;
              this.awaitingSettlement = roundedSettlement;
            } else if (convertToString.length >= 7) {
              let roundedSettlement = `${awaitingSettle / 1000000}k`;
              this.awaitingSettlement = roundedSettlement;
            } else {
              this.awaitingSettlement = res.awaiting_settlement_label;
            }
            this.availableBalance = res.available_balance;
            this.payment = false;
          });
      });
    } else {
      this.$store
        .dispatch("dashboard/getTotalRevenue", { id: this.userInfo.id })
        .then((res) => {
          this.totalRevenue = res.total_revenue_label;
          this.settled = res.settled;
          // convertion to thousands
          let awaitingSettle = Math.floor(res.awaiting_settlement);
          let convertToString = awaitingSettle.toString();
          if (convertToString.length >= 4) {
            let roundedSettlement = `${awaitingSettle / 1000}k`;
            this.awaitingSettlement = roundedSettlement;
          } else if (convertToString.length >= 7) {
            let roundedSettlement = `${awaitingSettle / 1000000}k`;
            this.awaitingSettlement = roundedSettlement;
          } else {
            this.awaitingSettlement = res.awaiting_settlement_label;
          }
          this.availableBalance = res.available_balance;
          this.payment = false;
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
      this.$store.dispatch("dashboard/getTotalRevenue", {
        id: this.userInfo.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Dashboard.scss";
</style>