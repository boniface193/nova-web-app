<template>
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
  <div class="dashboard-container">
    <div class="primary pt-16 pb-8">
      <div class="px-8 mt-8">
        <!-- <Calender class="float-right" autoApply @updateDate="dateValue" /> -->
        <div class="welcome-text">Hello,</div>
        <div class="welcome-text-sm">{{ userInfo.name }}</div>
      </div>
      <div class="mt-16 d-flex justify-center">
        <v-row class="row-properties">
          <!-- current sales -->
          <v-col cols="6" sm="4" md="" lg="">
            <v-card
              v-if="currentLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <v-skeleton-loader type="article"> </v-skeleton-loader>
            </v-card>
            <v-card
              v-if="!currentLoading"
=======
  <div>
    <div class="primary pb-12 py-12">
      <!-- <Layout>
        <template v-slot="slotProps">
          <div class="d-flex">
            <div @click.stop="drawer = !drawer">
              <v-icon size="19" color="#000"> mdi-segment</v-icon>
            </div>
            <v-spacer></v-spacer>
            <div class="">
              <v-img src="@/assets/images/bell.svg" width="11px"></v-img>
            </div>
          </div>
        </template>
      </Layout> -->
      <div class="mx-7">
        <Calender
          class="float-right"
          singleDatePicker
          autoApply
          @updateDate="dateValue"
        />
        <div class="welcome-text">Hello,</div>
        <div class="welcome-text-sm">{{ userInfo.name }}</div>
      </div>
      <div class="mx-7 mt-8 d-flex justify-center">
        <v-row style="position: absolute; width: 90%" class="">
          <v-col
            sm="4"
            md=""
            lg=""
            class="pr-0"
            v-for="items in dashboardItems"
            :key="items.id"
          >
            <v-card
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
                border-radius: 15px;
                height: 186px;
              "
            >
              <div class="text-center">
                <div class="d-flex justify-center pt-5">
                  <div class="mx-4 position-abs">
                    <img
                      :src="items.image"
                      width="21.5"
                      height="21.27"
                      class="ml-percent mt-4"
                    />
                  </div>
                  <div
                    :class="items.image_color"
                    class="rounded-pill pa-7 text-center"
                  ></div>
                </div>
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
                <div class="card-header">
                  <v-icon
                    size="17"
                    class="mb-1 font-weight-bold"
                    color="#2b2b2b"
                    >mdi-currency-ngn</v-icon
                  >{{ curentSale }}
                </div>
                <div class="card-sale">In sales</div>
=======
                <div class="card-header">{{ items.card_header }}</div>
                <div class="card-sale">{{ items.card_sales }}</div>
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
                <div
                  class="card-success"
                  :class="{ 'card-error': items.card_success.includes('-') }"
                >
                  {{ items.card_success }}
                  <span class="awaiting" v-if="items.awaiting"
                    >({{ items.awaiting }})</span
                  >
                </div>
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
              </div>
            </v-card>
          </v-col>
          <!-- current sale -->

          <!-- payment total revenue -->
          <v-col cols="6" sm="4" md="" lg="">
            <v-card
              v-if="payment"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                <div class="card-header">
                  <v-icon
                    size="17"
                    class="mb-1 font-weight-bold"
                    color="#2b2b2b"
                    >mdi-currency-ngn</v-icon
                  >{{ totalRevenue }}
                </div>
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
=======
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
                <div class="card-history my-2">
                  <router-link
                    :to="{ name: items.routes }"
                    style="text-decoration: none"
                  >
                    {{ items.card_history
                    }}<v-icon size="12" class="primary--text"
                      >mdi-arrow-right</v-icon
                    ></router-link
                  >
                </div>
              </div>
            </v-card>
          </v-col>
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
          <!-- payment total Revenue -->

          <!-- sale point -->
          <v-col cols="6" sm="4" md="" lg="">
            <v-card
              v-if="sellLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                <div class="card-header">{{ diffSales }}</div>
                <div class="card-sale">Lifetime Sales Points</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error': cSales == 0 || cSales.includes('-'),
                  }"
                >
                  {{ diffSales }}
                  <span class="awaiting">( available points )</span>
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
          <v-col cols="6" sm="4" md="" lg="">
            <v-card
              v-if="rankLoading"
              class="shadow-sm elevation-0 px-2"
              style="
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                box-shadow: 0 0.5rem 30px rgba(0, 0, 0, 0.15) !important;
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
                <div class="card-header">{{ pRank || "-" }}</div>
                <div class="card-sale">on leaderboard</div>
                <div
                  class="card-success"
                  :class="{
                    'card-error': diffRank === '0' || diffRank.includes('-'),
                  }"
                >
                  {{ diffRank || "-" }}
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
=======
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
//import Calender from "@/components/general/calender.vue";
=======
import Calender from "@/components/general/calender.vue";
// import Layout from "@/components/layout/Layout.vue";
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
import { mapGetters } from "vuex";
export default {
  components: {
    //Calender,
    // Layout,
  },
  data() {
    return {
      dashboardItems: [
        {
          image_color: "round-img-bg-danger",
          image: require("@/assets/images/shopping.png"),
          card_header: "₦900,000.00",
          card_sales: "In sales",
          card_success: "+45,000",
          card_history: "Sales history",
          routes: "sales_history",
        },

        {
          image_color: "round-img-bg-success",
          image: require("@/assets/images/money.svg"),
          card_header: "₦70,000.00",
          card_sales: "In profits",
          card_success: "5,000",
          awaiting: "awaiting settlements",
          card_history: "Settlement history",
          routes: "payment_history",
        },

        {
          image_color: "round-img-bg-primary",
          image: require("@/assets/images/group.svg"),
          card_header: "1001",
          card_sales: "Sales Points",
          card_success: "+10",
          card_history: "Claim reward",
          routes: "reward",
        },

        {
          image_color: "round-img-bg-warning",
          image: require("@/assets/images/cup.svg"),
          card_header: "24th",
          card_sales: "on leaderboard",
          card_success: "-1",
          card_history: "View Leaderboard",
          routes: "leaderboard",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
    }),
  },
<<<<<<< HEAD:src/views/authPages/dashboard/Dashboard.vue
  created() {
    this.$store
      .dispatch("dashboard/getSellerPoint")
      .then((res) => {
        let resObj = {
          difference: res.diff.toString(),
          curentSale: res.current_sales.toString(),
        };
        this.cSales = resObj.curentSale;
        this.diffSales = resObj.difference;
        this.sellLoading = false;
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem("accessToken");
          window.location.href = "/signin";
        }
      });

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
    // .catch((error) => {
    //   if (error.status === 401 || error.status === 403) {
    //     localStorage.removeItem("accessToken");
    //     window.location.href = "/signin";
    //   }
    // });

    this.$store.dispatch("dashboard/getSellerTotalSale").then((res) => {
      let resObj = {
        difference: res.current_sales_label,
        curentSale: res.diff.toString(),
      };
      this.curentSale = resObj.difference;
      this.diffCurrentSales = resObj.curentSale;
      this.currentLoading = false;
    });
    // .catch((error) => {
    //   if (error.status === 401 || error.status === 403) {
    //     localStorage.removeItem("accessToken");
    //     window.location.href = "/signin";
    //   }
    // });

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
=======
  methods: {
    dateValue(value) {
      const startDate = moment(value.startDate).format();
      const endDate = moment(value.endDate).format();
      console.log(startDate);
      console.log(endDate);
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/dashboard/Dashboard.vue
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin-top: -40px !important;
}
.welcome-text {
  font-family: "Product Sans" Medium;
  color: #ffffff;
  font-size: 24px;
}
.welcome-text-sm {
  font-family: "Product Sans Light";
  font-variant: normal;
  letter-spacing: 0.8px;
  font-size: 16px;
  color: #ffffff;
}
.row-properties {
  position: absolute;
  width: 70%;
}
@media (max-width: 500px) {
  .row-properties {
    width: 90%;
  }
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
.ml-percent{
  z-index: 1 !important;
}
.card-header {
  color: #2b2b2b;
  font-size: 17px;
  font-family: "Product Sans" Bold;
  margin: 10px 0px 0px 0px;
  font-weight: bold;
}
.card-sale {
  color: #979797;
  font-family: "Product Sans" Light;
  font-size: 12px;
}
.card-success {
  color: #29db58;
  font-size: 10px;
  font-family: "Product Sans" Bold;
}
.card-error {
  color: #ff3b3b;
  font-size: 10px;
  font-family: "Product Sans" Bold;
}
.card-history {
  color: #5063ca;
  font-family: "Product Sans" Medium;
  font-size: 10px;
}
.awaiting {
  color: #979797;
  font-family: "Product Sans" Light;
  font-size: 8px;
}
</style>