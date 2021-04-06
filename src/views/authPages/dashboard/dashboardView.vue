<template>
  <div class="dashboard-pages-container">
    <Sidebar :drawer="drawer" @closeDrawer="closeDrawer" />
    <div class="page-content" :class="{ 'add-margin': drawer }">
      <div
        class="page-content-header px-2 px-md-7"
        v-if="
          !drawer &&
          (this.$route.path == '/dashboard' ||
            this.$route.name == 'InventoryHome' ||
            this.$route.name == 'ProfilePage' ||
            this.$route.path == '/orders')
        "
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon
            size="25"
            :class="{ 'white--text': this.$route.path == '/dashboard' }"
          >
            mdi-segment</v-icon
          >
        </v-app-bar-nav-icon>
        <div
          class="nova-logo"
          v-show="this.$route.path !== '/dashboard'"
        >
          <img src="@/assets/images/primary-logo.png" />
        </div>
      </div>
      <div class="pt-10" style="height: 100%">
          
      <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/layout/Sidebar.vue";
export default {
  components: {
    Sidebar,
  },
  data: function () {
    return {
      drawer: true,
    };
  },
  created() {
    if (window.screen.width >= 1260) {
      this.drawer = true;
    } else {
      this.drawer = false;
    }
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile");
    }
  },
  methods: {
    closeDrawer() {
      this.drawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-pages-container {
  position: absolute;
  width: 100%;
  height: 100%;
  .page-content {
    width: -webkit-fill-available;
    transition: 0.5s ease;
    &-header {
      position: absolute;
      display: flex;
      align-items: flex-end;
      top: 20px;
      .nova-logo {
        width: 100px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
        }
      }
    }
  }
  .add-margin {
    margin-left: 250px;
  }
  @media (max-width: 1260px) {
    .add-margin {
      margin-left: 0px;
    }
  }
}
</style>