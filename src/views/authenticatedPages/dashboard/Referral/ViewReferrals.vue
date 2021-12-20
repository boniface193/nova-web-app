<template>
  <div class="view-referrals-container">
    <div class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="referralList.length > 0">
      <!-- number of referrals -->
      <p>
        You have
        <span style="font-weight: 600">{{ totalReferral }}</span> referrals.
      </p>

      <!-- search referrals -->
      <div class="view-referrals-container__search-bar mb-4">
        <!-- search bar -->
        <SearchBar
          placeholder="Search referrals"
          bgColor="#DDEFEF"
          borderColor="transparent"
          @search="setSearchValue"
        />
      </div>

      <div class="view-referrals-container__refer-list">
        <!-- referral list -->
        <div
          class="view-referrals-container__refer-list__item"
          v-for="item, index in referralList"
          :key="index"
        >
          <div class="d-flex">
            <div
              class="view-referrals-container__refer-list__item__profile mr-3"
            >
              <img v-if="item.image" :src="item.image" alt="profile" />
              <v-icon v-else size="80">mdi-account-circle</v-icon>
            </div>

            <div class="mt-2">
              <h3 class="mb-2">{{ item.seller_name }}</h3>
              <p class="mb-0">
                Signed up
                <span class="primary--text">{{ item.signed_up_at }}</span>
              </p>
            </div>
          </div>
          <h3 class="view-referrals-container__refer-list__item__amount">
            &#8358;{{ item.total_reward }}
          </h3>
        </div>
      </div>
      <!-- pagination -->
      <div
        v-if="referralList.length > 5"
        class="d-flex justify-space-between align-center flex-wrap"
      >
        <div class="d-flex justify-space-between align-center flex-wrap">
          <p class="mb-2 mr-5">
            Page {{ referralPageDetails.current_page }} of
            {{ referralPageDetails.last_page }}
          </p>
        </div>
        <div class="referral-earnings-container__pagination mb-2">
          <v-pagination
            v-model="referralPageDetails.current_page"
            :length="referralPageDetails.last_page"
            @input="setCurentPage"
            circle
          ></v-pagination>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <img
        class="text-center my-8"
        src="@/assets/images/EmptyLeaderboard.svg"
        width="30%"
      />
      <div class="text-body-1 text-lg-h5 margin-top">No Referrals</div>
      <div class="d-flex justify-center my-8">
        <v-btn color="primary" class="elevation-0" @click="refreshRequest"
          >Refresh</v-btn
        >
      </div>
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
  </div>
</template>
<script>
import SearchBar from "@/components/primary/SearchBar.vue";
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
import { mapState } from "vuex";
export default {
  name: "RefferalEarnings",
  components: { SearchBar, Modal },
  data() {
    return {
      totalReferral: 0,
      searchByName: "",
      isLoading: true,
      referralList: [],
      dialog: "",
      dialogMessage: "",
      statusImage: "",
    };
  },
  computed: {
    ...mapState({
      referralPageDetails: (state) => state.referral.referralPageDetails,
    }),
  },
  created() {
    this.getReferralList();
    this.getTotalReferral();
  },
  methods: {
    refreshRequest() {
      this.getReferralList();
    },

    getTotalReferral() {
      this.$store
        .dispatch("referral/getTotalReferral")
        .then((res) => {
          this.totalReferral = res.total_referral;
        })
        .catch((error) => {
          if (error.status === 422) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.customer;
          } else if (error.status === 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },

    getReferralList() {
      this.$store
        .dispatch("referral/getReferralList")
        .then((res) => {
          this.isLoading = false;
          this.referralList = res;
        })
        .catch((error) => {
          this.isLoading = false;
          if (error.status === 422) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.customer;
          } else if (error.status === 400) {
            this.statusImage = failedImage;
            this.dialog = true;
            this.dialogMessage = error.data.message;
          }
        });
    },

    setSearchValue(params) {
      this.isLoading = true;
      if (params == "") {
        return (this.isLoading = false);
      } else {
        this.$store.commit("referral/filterByName", params);
        this.$store
          .dispatch("referral/getSearchReferral")
          .then((res) => {
            this.referralList = res;
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.status === 422) {
              this.statusImage = failedImage;
              this.dialog = true;
              this.dialogMessage = error.data.customer;
            } else if (error.status === 400) {
              this.statusImage = failedImage;
              this.dialog = true;
              this.dialogMessage = error.data.message;
            }
          });
      }
    },

    setCurentPage() {
      this.$store.commit(
        "referral/setPage",
        this.referralPageDetails.current_page
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.view-referrals-container {
  width: 50%;
  &__refer-list {
    &__item {
      display: flex;
      justify-content: space-between;
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
      &__amount {
        margin-top: 15px;
      }
    }
  }
}
@media (max-width: 800px) {
  .view-referrals-container {
    width: 100%;
  }
}
</style>