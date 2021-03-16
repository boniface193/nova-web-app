<template>
  <div>
    <v-container>
      <div class="mx-5">
        <div class="chOder" style="margin: 0">
          <router-link :to="{ path: '/dashboard' }">
            <v-icon class="float-left">mdi-chevron-left</v-icon>
          </router-link>
          <div v-if="!Search" class="d-flex">
            <h5 class="text-center mx-auto">Leaderboard</h5>
            <v-icon style="cursor: pointer" @click="toggleSearch"
              >mdi-magnify</v-icon
            >
          </div>
          <div class="mx-10 d-flex justify-center" @mouseout="toggleOnLeave">
            <Search
              placeholder="Search history"
              class="mx-lg-md-17"
              v-if="Search"
              @search="getSearchValue"
            />
          </div>
        </div>

        <div
          class="lenghtOfUser text-center mt-8"
          v-for="items in leaderboard"
          :key="items.seller_id"
        >
          <div v-if="userInfo.id == items.seller_id">
            You’re {{ items.rank
            }}<span v-if="items.rank == 1">st</span
            ><span v-else-if="items.rank == 2">nd</span>
            <span v-else-if="items.rank == 3">rd</span>
            <span v-else>th</span> on the Leaderboard!
          </div>
        </div>
        <!-- no data -->
         
        <div class="text-center pt-10 pb-5" v-if="leaderboard.length < 1">
          <p class="mb-0 secondary--text" style="font-size: 20px">
            Opps! No leaders found.
          </p>
        </div>

        <div v-if="isLoading" class="text-center my-8">
          <!-- this image time loader is calculated by the loader to triger the load time -->
          <v-progress-circular
            color="primary"
            class="text-center"
            indeterminate
            size="20"
            width="2"
          ></v-progress-circular>
        </div>
        <!-- loader ends here -->
        <v-row class="d-flex justify-center">
          <v-col lg="6">
            <v-row class="mt-5" v-show="leaderboard.length >= 1">
              <v-col cols="2" lg="3"><h5>Rank</h5></v-col>
              <v-col cols="8" lg="6"><h5>Name</h5></v-col>
              <v-col cols="2" lg="3"><h5>Points</h5></v-col>
            </v-row>

            <v-row
              class="leader-text my-2"
              v-for="items in leaderboard"
              :key="items.seller_id"
              :class="{ active: userInfo.id === items.seller_id }"
            >
              <v-col cols="2" lg="3"
                >{{ items.rank }}
              </v-col>
              <v-col cols="8" lg="6">
                <div
                  class="d-flex"
                  style="cursor: pointer"
                  @click="filterById(items.seller_id)"
                >
                  <span
                    class="primary--text"
                    style="text-decoration: underline"
                    >{{ items.seller_name }}</span
                  >
                </div>
              </v-col>
              <v-col cols="2" lg="3">{{ items.total_points }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- pagination -->
    <div class="text-center elevation-8 pa-3" v-if="leaderboard.length >= 10">
      <!-- <v-pagination
        v-model="getCurrentPage.currentPage"
        @input="setCurentPage"
        circle
        small
        style="font-size: 8px"
      ></v-pagination> -->
      <!--  v-if="leaderboard.data.length >= 10" -->
    </div>

    <!-- modal -->
    <div class="mx-3">
      <Modal class="overlay" :dialog="this.dialog" width="250">
        <div>
          <v-card class="rounded-lg">
            <v-icon
              style="cursor: pointer"
              @click.native="closeModal"
              class="float-right mr-3 mt-3"
              color="primary"
              >mdi-close</v-icon
            >
            <div class="pt-9">
              <span class="d-flex justify-center mt-2 body-text">
                {{ filteredArray.seller_name }}
              </span>
              <span class="d-flex justify-center title-text">
                Sales Representative
              </span>
              <div class="pt-3">
                <v-divider light></v-divider>
              </div>
              <v-list-item>
                <v-list-item-content class="pt-1" align="center">
                  <v-list-item-title
                    ><span class="primary--text larger-text"
                      >{{ filteredArray.rank
                      }}<span
                        v-if="filteredArray.rank == 1"
                        >st</span
                      ><span
                        v-else-if="
                          filteredArray.rank == 2
                        "
                        >nd</span
                      ><span
                        v-else-if="
                          filteredArray.rank == 3
                        "
                        >rd</span
                      ><span v-else>th</span>
                    </span>
                    <br />
                    <span class="title-text">In-store</span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-divider vertical> </v-divider>
                <v-list-item-content class="pt-1" align="center">
                  <v-list-item-title
                    ><span class="primary--text larger-text">
                      {{ filteredArray.total_points }}
                    </span>
                    <br />
                    <span class="title-text">Total Points</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <div>
                <v-divider light></v-divider>
              </div>
              <div class="d-flex justify-center mt-3 pb-5">
                <span class="primary--text larger-text"
                  >N{{ filteredArray.total_order_value }}
                </span>
                <span class="title-text mx-2">in sales</span>
              </div>
            </div>
          </v-card>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Search from "@/components/general/SearchBar.vue";
import Modal from "@/components/modal.vue";
import { mapGetters, mapState } from "vuex";
export default {
  name: "orderDetails",
  components: {
    Search,
    Modal,
  },
  data() {
    return {
      dialog: false,
      Search: false,
      isLoading: true,
      // userProfile: {},
      filteredArray: {},
      leaderboard: [],
      userInfo: [],
    };
  },

  computed: {
    ...mapGetters({
      getLeaderboard: "leaderboard/leaderboard",
      userInformation: "settings/profile",
    }),
    ...mapState({
      // page: (state) => state.leaderboard.page,
      // pageDetails: (state) => state.leaderboard.pageDetails,
      // getCurrentPage() {
      //   return {
      //     currentPage: this.pageDetails.current_page,
      //   };
      // },
    }),
  },

  created() {
    
    if (this.userInfo.id === undefined) {
      this.$store.dispatch("settings/getUserProfile").then((res) => {
      let userData = res.data.data;
      this.userInfo = userData;
    });
    }else{
      this.userInfo = this.userInformation
    }

    this.$store.dispatch("leaderboard/getLeaderboard").then((res) => {
      this.leaderboard = res;
      this.isLoading = false;
    });
  },

  methods: {
    toggleSearch() {
      this.Search = true;
    },
    toggleOnLeave() {
      this.Search = false;
    },
    closeModal() {
      this.dialog = false;
    },
    openModal() {
      this.dialog = true;
    },

    filterById(id) {
      this.filteredArray = this.leaderboard.find(
        (item) => item.seller_id === id
      );
      this.openModal();
    },

    // search the datatable items
    getSearchValue(params) {
      this.$store.commit("leaderboard/setSearchValue", params);
      this.$store.commit("leaderboard/setSearchLeaderBoard", true);
      this.$store.dispatch("leaderboard/searchLeaderBoard").then(() => {
        // this.leaderboard = this.getLeaderboard
        // this.isLoading = true;
      });
      // this.getOrders();
    },

    // returns searched values to the table
    // getOrders() {
    //   this.$store.dispatch("leaderboard/searchLeaderBoard").then(() => {
    //     this.isLoading = false;
    //   });
    // },

    // set current page
    // setCurentPage() {
    //   this.$store.commit(
    //     "leaderboard/setPage",
    //     this.getCurrentPage.currentPage
    //   );
    //   this.getOrders === true ? this.getSearchValue() : "";
    // },
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
.lenghtOfUser {
  color: #979797;
  font-family: "Product Sans";
  font-size: 16px;
}
.leader-text {
  font-family: "Product Sans Light";
  color: #2b2b2b;
  font-size: 14px;
}
.active {
  border-left: 4px solid #029b97;
  color: #029b97;
  font-family: "Product Sans Medium";
  font-size: 14px;
  background-color: #5065cc1c;
}
.body-text {
  color: #2b2b2b;
  font-family: "Product Sans Bold";
  font-size: 14px;
}
.title-text {
  color: #979797;
  font-family: "Product Sans Light";
  font-size: 14px;
  opacity: 0.9;
}
.larger-text {
  font-family: "Product Sans Bold";
  font-size: 14px;
  opacity: 0.9;
}
.overlay {
  filter: blur(8px);
  -webkit-filter: blur(8px);
}
.mx-lg-md-17 {
  @media (min-width: 1024px) {
    width: 50%;
  }
}
</style>