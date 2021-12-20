<template>
  <div class="mp-16">
    <div>
      <!-- title section  -->
      <div
        class="d-flex align-center justify-center mb-8"
        style="position: relative"
      >
        <router-link :to="{ path: '/dashboard' }" style="text-decoration: none">
          <span class="back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </router-link>
        <h3 class="align-self-center">Rewards</h3>
      </div>

      <div class="reward-content" v-show="!isLoading">
        <!-- card section -->
        <div class="reward-container">
          <div class="reward-card">
            <img src="@/assets/images/reward.svg" alt="" />
            <div class="card-text px-8 py-6">
              <h2 class="card-name white--text">Reward Debit Balance</h2>

              <p
                class="white--text point-text"
                style="position: absolute; bottom: 45%"
              >
                {{ rewards.data.total_points }} Points
              </p>
              <p class="white--text" style="position: absolute; bottom: 5%">
                {{ userInfo.name }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <!-- navbar -->
          <div class="d-flex align-center mb-4">
            <div
              class="navigator"
              :class="{ 'navigator--active': activeTab == 'Redeem' }"
              @click="changeTab('Redeem')"
            >
              <p class="mb-0" :class="{ 'white--text': activeTab == 'Redeem' }">
                Redeem
              </p>
            </div>
            <div
              class="navigator"
              :class="{ 'navigator--active': activeTab == 'History' }"
              @click="changeTab('History')"
            >
              <p
                class="mb-0"
                :class="{ 'white--text': activeTab == 'History' }"
              >
                History
              </p>
            </div>
          </div>

          <!-- redeem content -->
          <div v-show="activeTab == 'Redeem'">
            <div
              class="d-flex justify-space-between mb-4"
              v-for="items in rewards.data.rewards"
              :key="items.id"
            >
              <div class="d-flex">
                <div class="airtime-container">
                  <img src="@/assets/images/airtime.jpeg" alt="" />
                </div>
                <span class="ml-3"
                  >{{ items.title }} <br />
                  <span class="points">{{ items.points }} pts</span>
                </span>
              </div>

              <p
                @click="filterById(items.key)"
                style="cursor: pointer"
                class="redeem-btn mt-1 mb-0"
                :class="{ 'primary--text': items.is_redeemable }"
              >
                Redeem
              </p>
            </div>
          </div>
          <!-- history content -->
          <div v-show="activeTab == 'History'">
            <div v-show="rewardHistory.length > 0">
              <div v-for="items in rewardHistory" :key="items.id">
                <div class="history-card pa-3 mb-3">
                  <div class="order-item-font mb-1">
                    Reward Type:
                    <span class="order-no-grey mx-1">
                      {{ items.airtime_amount }}</span
                    >
                  </div>
                  <div class="order-item-font mb-1">
                    Points
                    <span class="order-no-grey mx-1">{{
                      items.deducted_point
                    }}</span>
                  </div>
                  <div class="order-item-font mb-1">
                    Phone Number:
                    <span class="order-no-grey mx-1">{{
                      items.phone_number
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-8" v-show="rewardHistory.length == 0">
              <p>No reward history available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- loader -->
      <div class="text-center pt-10 pb-5" v-show="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <Modal :dialog="this.dialog" width="300">
        <v-card class="rounded-lg">
          <v-icon
            style="cursor: pointer"
            @click.native="closeModal"
            class="float-right mr-3 mt-3"
            color="primary"
            >mdi-close</v-icon
          >
          <div class="pt-9" v-if="filteredArray.is_redeemable">
            <div class="d-flex justify-center">
              <span>
                <v-img
                  src="@/assets/images/airtime.jpeg"
                  height="54px"
                  width="55px"
                  class="rounded-pill"
                ></v-img>
              </span>
            </div>
            <span class="d-flex justify-center mt-8 body-text">
              Do you which to redeem your reward?
            </span>
            <div class="d-flex justify-center mt-3 pb-5">
              <v-btn
                depressed
                class="mx-3"
                dark
                color="primary"
                @click="redeemOffer(filteredArray.key)"
                >Yes</v-btn
              >
              <v-btn depressed dark color="#52F1EC" @click.native="closeModal">
                No</v-btn
              >
            </div>
          </div>

          <!-- if not redemable -->
          <div
            class="pt-9 px-8 text-center"
            v-show="filteredArray.is_redeemable == false"
          >
            <span class="mt-8 body-text">
              You need
              <span class="primary--text">{{ filteredArray.points_left }}</span>
              more points to claim this reward, sell more to earn more
            </span>
            <div class="d-flex justify-center mt-3 pb-5">
              <v-btn
                depressed
                class="mx-3"
                dark
                color="primary"
                :to="{ name: 'InventoryHome' }"
                >Continue Selling</v-btn
              >
            </div>
          </div>
        </v-card>
      </Modal>

      <Modal :dialog="Showdialog" width="300">
        <v-card class="rounded-lg">
          <div v-show="successful == true" class="pt-9 px-8 text-center">
            <span class="mt-8 body-text">
              {{ alert }}
            </span>
            <div class="d-flex justify-center mt-3 pb-5">
              <v-btn
                depressed
                class="mx-3"
                dark
                color="primary"
                @click.native="closeNredirect"
                >Ok</v-btn
              >
            </div>
          </div>
        </v-card>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/secondary/Modal.vue";
import { mapGetters, mapState } from "vuex";
export default {
  name: "orderDetails",
  components: {
    Modal,
  },
  data() {
    return {
      tab: null,
      dialog: false,
      Showdialog: false,
      filteredArray: {},
      rewardHistory: [],
      isLoading: false,
      alert: "",
      successful: false,
      activeTab: "Redeem",
    };
  },
  computed: {
    ...mapGetters({
      rewards: "reward/getRewards",
      userInfo: "settings/profile",
    }),
    ...mapState({
      page: (state) => state.reward.page,
      pageDetails: (state) => state.reward.pageDetails,
      getCurrentPage() {
        return {
          currentPage: this.pageDetails.current_page,
        };
      },
    }),
  },
  created() {
    this.isLoading = true;
    this.$store.dispatch("reward/getReward").then(() => {
      this.$store.dispatch("reward/getHistory").then((response) => {
        this.rewardHistory = response.data.data;
        this.isLoading = false;
      });
    });
  },

  methods: {
    closeModal() {
      this.dialog = false;
    },
    openModal() {
      this.dialog = true;
    },
    changeTab(tabName) {
      this.activeTab = tabName;
    },
    filterById(id) {
      this.filteredArray = Object.values(this.rewards.data.rewards).find(
        (item) => item.key == id
      );
      this.openModal();
    },
    redeemOffer(params) {
      this.$store.commit("reward/setRedeemAirtime", params);
      this.$store
        .dispatch("reward/redeemReward")
        .then((res) => {
          this.alert = res.message;
          this.successful = true;
          this.Showdialog = true;
        })
        .catch((err) => {
          this.alert = err.message;
        });
    },

    closeNredirect() {
      location.href = "/dashboard";
    },

    // set current page
    setCurentPage() {
      this.$store.commit("reward/setPage", this.getCurrentPage.currentPage);
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  left: 0px;
  top: 0px;
}
.reward-content {
  width: 42%;
  margin: auto;
  .reward-container {
    width: 100%;
    position: relative;
    .reward-card {
      width: 100%;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
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
    }
  }
  .navigator {
    width: 50%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: var(--v-background-base);
      border-color: var(--v-background-base);
      color: var(--v-primary-base);
    }
    &--active {
      background: var(--v-primary-base) !important;
      border-color: var(--v-primary-base) !important;
    }
  }
  .airtime-container {
    width: 50px;
    img {
      width: 100%;
    }
  }
  .redeem-btn {
    font-size: 14px;
    cursor: pointer;
    &:hover {
      color: var(--v-background-base) !important;
    }
  }
  .history-card {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
  }
}
@media (max-width: 1150px) {
  .reward-content {
    width: 55%;
  }
}
@media (max-width: 700px) {
  .reward-content {
    width: 100%;
  }
}
@media (max-width: 400px) {
  .card-name {
    font-size: 20px !important;
  }
  .point-text {
    bottom: 40% !important;
  }
}
</style>