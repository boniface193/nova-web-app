<template>
  <div class="profilePage-container">
    <div class="profile-section pt-3">
      <div
        class="d-flex justify-space-between py-3"
        style="border-bottom: 1px solid #979797"
      >
        <div class="profile-body">
          <div class="profile-image">
            <img src="@/assets/images/user-profile.svg" alt="" />
          </div>
          <div>
            <h4>{{ userInfo.name }}</h4>

            <router-link
              :to="{ name: 'Profile' }"
              style="text-decoration: none"
            >
              <p style="font-size: 14px; color: #979797">Edit Profile</p>
            </router-link>
          </div>
        </div>
        <router-link
          :to="{ name: 'Profile' }"
          style="text-decoration: none"
          class="d-flex align-center"
        >
          <v-icon color="#979797">mdi-chevron-right</v-icon>
        </router-link>
      </div>
      <!-- privacy section -->
      <div class="privacy-body py-5">
        <div class="d-flex align-center">
          <div class="logo">
            <img src="@/assets/images/privacy-and -security.svg" alt="" />
          </div>
          <router-link :to="{ name: 'Privacy' }" style="text-decoration: none">
            <p class="mb-0 ash-color">Privacy & Security</p>
          </router-link>
        </div>
        <router-link
          :to="{ name: 'Privacy' }"
          style="text-decoration: none"
          class="d-flex align-center"
        >
          <v-icon color="#979797">mdi-chevron-right</v-icon>
        </router-link>
      </div>
      <!-- bank section -->
      <div class="privacy-body py-5">
        <div class="d-flex align-center">
          <div class="logo">
            <img src="@/assets/images/Accounts.svg" alt="" />
          </div>
          <router-link
            :to="{ name: 'AddBankDetails' }"
            style="text-decoration: none"
          >
            <p class="mb-0 ash-color">Bank Accounts</p>
          </router-link>
        </div>
        <router-link
          :to="{ name: 'AddBankDetails' }"
          style="text-decoration: none"
          class="d-flex align-center"
        >
          <v-icon color="#979797">mdi-chevron-right</v-icon>
        </router-link>
      </div>
      <!-- logout section -->
      <div
        class="d-flex align-center py-5"
        style="width: 100px; cursor: pointer"
        @click="logout"
      >
        <div class="logout-logo">
          <img src="@/assets/images/log-out.svg" alt="" />
        </div>
        <p class="mb-0 error--text">Log Out</p>
      </div>
    </div>
    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="120">
      <div class="text-center dialog white">Loging Out...</div>
    </modal>
  </div>
</template>
<script>
import modal from "@/components/modal.vue";
import { mapGetters } from "vuex";
export default {
  name: "ProfilePage",
  data: function () {
    return {
      dialog: false,
    };
  },
  components: { modal },
  computed: {
    ...mapGetters({
      userInfo: "settings/profile",
    }),
  },
  methods: {
    // logout
    logout() {
      this.dialog = true;
      this.$store
        .dispatch("onboarding/logout")
        .then(() => {
          this.dialog = false;
          this.$router.push({
            name: "Signin",
          });
        })
        .catch(() => (this.dialog = false));
    },
  },
};
</script>
<style lang="scss" scoped>
.profilePage-container {
  width: 70%;
  .profile-section {
    padding: 10px;
    .profile-body {
      display: flex;
      align-items: center;
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
    }
  }
  .privacy-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #979797;
    .logo {
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
  }
  .logout-logo {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .ash-color {
    color: #979797;
  }
}
@media (max-width: 950px) {
  .profilePage-container {
    width: 100%;
  }
}
</style>