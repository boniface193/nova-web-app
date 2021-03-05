<template>
  <div class="dashboard-pages-container">
    <Sidebar :drawer="drawer" @closeDrawer="closeDrawer" />
    <div class="page-content" :class="{ 'add-margin': drawer }">
      <div
        class="page-content-header px-5"
        v-if="
          !drawer &&
          (this.$route.path == '/dashboard' ||
            this.$route.name == 'InventoryHome' ||
            this.$route.path == '/settings' ||
            this.$route.path == '/orders')
        "
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon
            size="19"
            :class="{ 'white--text': this.$route.path == '/dashboard' }"
          >
            mdi-segment</v-icon
          >
        </v-app-bar-nav-icon>
        <div
          class="nova-logo d-flex baseline"
          v-if="this.$route.path !== '/dashboard'"
        >
          <img src="@/assets/images/primary-logo.png" />
        </div>
      </div>
      <div class="pt-sm-10 pt-16" style="height: 100%">
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
  display: flex;
  position: absolute;
  width: 100%;
  .page-content {
    width: -webkit-fill-available;
    transition: 0.5s ease;
    &-header {
      position: absolute;
      display: flex;
      align-items: flex-end;
      .nova-logo {
        width: 70px;
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