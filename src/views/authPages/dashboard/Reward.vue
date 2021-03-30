<template>
  <v-container>
    <div class="mx-4 max-width">
      <div class="chOder" style="margin: 0 0 20px 0">
        <router-link :to="{ path: '/dashboard' }">
          <v-icon class="float-left">mdi-chevron-left</v-icon>
        </router-link>
        <h5 class="text-center mx-auto">Rewards</h5>
      </div>

      <v-row>
        <v-col offset-lg="3" offset-md="3" offset-sm="3">
          <!-- card -->
          <div
            class="center"
            v-for="items in rewards.data"
            :key="items.id"
            v-show="showing"
          >
            <div class="overlay pa-8">
              <div class="card-title text-left">Reward Debit Balance</div>
              <div class="card-point mt-7 text-left">
                {{ items.total_points }} Points
              </div>
              <div class="card-name mt-3 text-left text-capitalized">
                {{ items.seller_name }}
              </div>
            </div>
            <div class="mb-8 pr-4 w-100">
              <v-img src="@/assets/images/reward.svg"></v-img>
            </div>
          </div>

          <v-row class="my-8" v-if="isLoading">
            <v-col offset-lg="3" offset-md="3" offset-sm="3" class="offset-xs">
              <!-- this image time loader is calculated by the loader to triger the load time -->
              <v-img
                src="@/assets/images/reward.svg"
                width="5px"
                height="5px"
                @load="onLoad"
              ></v-img>
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
              <!-- loader ends here -->
            </v-col>
          </v-row>
          <!-- loader ends here -->

          <v-row>
            <v-col lg="7" xl="7" md="8" sm="7">
              <v-tabs
                height="40"
                class="rounded-lg"
                style="border: 1px solid #bebebe"
                v-model="tab"
                centered
              >
                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#tab-1" class="text-format"> Redeem </v-tab>

                <v-tab href="#tab-2" class="text-format"> History </v-tab>
              </v-tabs>
            </v-col>
          </v-row>

          <v-tabs-items v-model="tab" class="my-3">
            <v-tab-item transition="false" id="tab-1" value="tab-1">
              <v-row
                class="leader-text my-2"
                v-for="items in rewards.rewards"
                :key="items.id"
                :class="{ active: items.isRedeemable }"
              >
                <v-col cols="9" xl="6" lg="6" md="7" sm="6">
                  <div class="d-flex" style="cursor: pointer">
                    <span class="mr-3"
                      ><v-img
                        src="@/assets/images/airtime.jpeg"
                        height="47px"
                        width="44px"
                        class="rounded-lg"
                      >
                      </v-img
                    ></span>
                    <span
                      >{{ items.title }} <br />
                      <span class="points">{{ items.points }} pts</span></span
                    >
                  </div>
                </v-col>
                <v-col
                  @click="filterById(items.key)"
                  lg="3"
                  md="3"
                  sm="2"
                  xl="3"
                  cols="2"
                  style="cursor: pointer"
                  class="redeem mt-1 offset-425"
                  :class="{ 'primary--text': items.isRedeemable }"
                  >Redeem</v-col
                >
              </v-row>
            </v-tab-item>
            <!-- history -->
            <v-tab-item transition="false" id="tab-2" value="tab-2">
              <!-- loader ends here -->
              <v-row>
                <v-col
                  cols="12"
                  lg="7"
                  md="8"
                  sm="7"
                  v-for="items in rewardHistory"
                  :key="items.id"
                >
                  <v-card outlined class="rounded-lg py-3 px-8">
                    <div class="order-item-font mt-1">
                      Reward Type:
                      <span class="order-no-grey mx-1">
                        {{ items.airtime_amount }}</span
                      >
                    </div>
                    <div class="order-item-font mt-1">
                      Points
                      <span class="order-no-grey mx-1">{{
                        items.deducted_point
                      }}</span>
                    </div>
                    <div class="order-item-font mt-1">
                      Phone Number:
                      <span class="order-no-grey mx-1">{{
                        items.phone_number
                      }}</span>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <Modal :dialog="this.dialog" width="300">
        <v-card class="rounded-lg">
          <v-icon
            style="cursor: pointer"
            @click.native="closeModal"
            class="float-right mr-3 mt-3"
            color="primary"
            >mdi-close</v-icon
          >
          <div class="pt-9" v-if="filteredArray.isRedeemable">
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
            v-show="filteredArray.isRedeemable == false"
          >
            <span class="mt-8 body-text">
              You need
              <span class="primary--text">{{ filteredArray.point_left }}</span>
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
  </v-container>
</template>

<script>
import Modal from "@/components/modal.vue";
import { mapGetters } from "vuex";
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
      rewardHistory: {},
      isLoading: true,
      alert: "",
      successful: false,
      image: true,
      showing: false,
    };
  },
  computed: {
    ...mapGetters({ rewards: "reward/getRewards" }),
  },
  created() {
    this.$store.dispatch("reward/getReward").then(() => {
      this.isLoading = false;
    });
    this.$store.dispatch("reward/getHistory").then((e) => {
      this.rewardHistory = e;
      this.isLoading = false;
    });
    this.setimeout();
  },

  methods: {
    closeModal() {
      this.dialog = false;
    },
    openModal() {
      this.dialog = true;
    },
    filterById(id) {
      this.filteredArray = Object.values(this.rewards.rewards).find(
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
    onLoad() {
      this.isLoading ? (this.isLoading = false) : (this.isLoading = true);
    },

    setimeout() {
      // setTimeout(() => {
        this.showing = true;
      // }, 500);
    },
    closeNredirect(){
      location.href = "/dashboard";
    }
  },
};
</script>

<style lang="scss" scoped>
.chOder {
  color: #2b2b2b;
  font-size: 20px;
  margin: 30px 0 20px 0px;
  font-family: "Product Sans Medium";
}
.w-25 {
  width: 25% !important;
}
.points {
  color: #979797;
  font-size: 10px;
  font-family: "Product Sans Medium";
}
.redeem {
  font-family: "Product Sans";
  font-size: 10px;
  color: #979797;
}

.overlay {
  position: absolute;
  z-index: 1;
  color: #fff;
}

.card-title {
  font-family: "Product Sans Light";
  font-size: 12px;
}

.card-point {
  font-family: "Product Sans Medium";
  font-size: 18px;
}

.card-name {
  font-family: "Product Sans Light";
  font-size: 14px;
}

.v-tab--active {
  color: #fff !important;
  background-color: #029b97;
  margin: 0px;
}
.v-application--is-ltr
  .v-tabs--centered
  > .v-tabs-bar
  .v-tabs-bar__content
  > :first-child:not(.v-tabs-slider-wrapper),
.v-application--is-ltr
  .v-tabs--centered
  > .v-tabs-bar
  .v-tabs-slider-wrapper
  + *,
.v-application--is-ltr
  .v-tabs--fixed-tabs
  > .v-tabs-bar
  .v-tabs-bar__content
  > :first-child:not(.v-tabs-slider-wrapper),
.v-application--is-ltr
  .v-tabs--fixed-tabs
  > .v-tabs-bar
  .v-tabs-slider-wrapper
  + *,
.v-application--is-rtl
  .v-tabs--centered
  > .v-tabs-bar
  .v-tabs-bar__content
  > :last-child,
.v-application--is-rtl
  .v-tabs--fixed-tabs
  > .v-tabs-bar
  .v-tabs-bar__content
  > :last-child {
  margin: 0 10% 0 0;
  padding: 0px 20%;
  border-radius: 6px !important;
}
a.text-format.v-tab.v-tab--active {
  margin: 0 0 0 0px !important;
  padding: 0px 25%;
  border-radius: 6px !important;
}

div.v-tabs-slider {
  height: 0;
  width: 0;
  display: none;
}
.text-format {
  font-size: 12px;
  text-transform: capitalize !important;
}

@media (min-width: 1024px) {
  .w-100 {
    width: 427px;
  }

  .card-title {
    font-family: "Product Sans Light";
    font-size: 25px;
    margin-bottom: 48px;
  }

  .card-point {
    font-family: "Product Sans Medium";
    font-size: 18px;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .card-name {
    font-family: "Product Sans Light";
    letter-spacing: 1.5px;
    font-size: 14px;
  }
  a.text-format.v-tab {
    margin: 0 10%;
  }
}

@media (max-width: 1439px) and (min-width: 1365px) {
  .w-100 {
    width: 460px;
  }

  .card-title {
    font-family: "Product Sans Light";
    font-size: 25px;
    margin-bottom: 60px;
  }

  .card-point {
    font-family: "Product Sans Medium";
    font-size: 22px;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .card-name {
    font-family: "Product Sans Light";
    font-size: 17px;
  }
  a.text-format.v-tab {
    margin: 0 15%;
  }
}

@media (max-width: 1449px) and (min-width: 1440px) {
  .w-100 {
    width: 500px;
  }
}
@media (max-width: 1800px) and (min-width: 1450px) {
  .center {
    margin-left: 5%;
    // width: 500px;
  }
}
@media (max-width: 1900px) and (min-width: 1801px) {
  .center {
    margin-left: 5%;
  }
}
@media (max-width: 2560px) and (min-width: 1901px) {
  .center {
    margin-left: 15%;
  }
}

@media (max-width: 768px) {
  .w-100 {
    width: 317px;
  }

  .card-title {
    font-family: "Product Sans Light";
    font-size: 12px;
  }

  .card-point {
    font-family: "Product Sans Medium";
    font-size: 18px;
  }

  .card-name {
    font-family: "Product Sans Light";
    font-size: 14px;
  }
}
@media (max-width: 425px) {
  .offset-xs {
    margin-left: 50%;
  }
  .w-100 {
    width: 385px;
  }
  .offset-425 {
    margin-left: 7%;
  }

  .card-title {
    font-family: "Product Sans Light";
    font-size: 12px;
    margin: 10px 0 40px 0;
  }

  .card-point {
    font-family: "Product Sans Medium";
    font-size: 18px;
  }

  .card-name {
    font-family: "Product Sans Light";
    font-size: 14px;
  }
}

@media (max-width: 375px) {
  .w-100 {
    width: 340px;
  }
  .card-title {
    font-family: "Product Sans Light";
    font-size: 12px;
    margin: 5px 0 20px 0;
  }
}

@media (max-width: 320px) {
  .w-100 {
    width: 280px;
  }
  .card-title {
    font-family: "Product Sans Light";
    font-size: 12px;
    margin: -5px 0 -10px 0;
  }
  .offset-425 {
    margin-left: 0%;
  }
}
</style>