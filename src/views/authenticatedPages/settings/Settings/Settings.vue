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
            <img src="@/assets/icons/privacy-and -security.svg" alt="" />
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
            <img src="@/assets/icons/Accounts.svg" alt="" />
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
          <img src="@/assets/icons/log-out.svg" alt="" />
        </div>
        <p class="mb-0 error--text">Log Out</p>
      </div>
    </div>
    <!-- Modal for dialog messages -->
    <Modal :dialog="dialog" width="120">
      <div class="text-center dialog white">Loging Out...</div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
import { mapGetters } from "vuex";
export default {
  name: "ProfilePage",
  data: function () {
    return {
      dialog: false,
    };
  },
  components: { Modal },
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
        .catch((error) => {
          this.dialog = false;
          if (error.status == 401 || error.status == 422) {
            this.$router.push({
              name: "Signin",
            });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Settings.scss";
</style>