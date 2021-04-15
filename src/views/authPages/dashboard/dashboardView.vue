<template>
  <div class="dashboard-pages-container">
    <Sidebar ref="sidebar" />
    <div class="page-content pt-3 pt-md-5 px-5 px-md-7 mt-5">
      <!-- header on mobile -->
      <div
        class="page-content--header mb-7"
        :class="{
          'mb-7': this.$route.path !== '/dashboard',
          'page-content--header--dashboard': this.$route.path == '/dashboard',
        }"
        v-if="
          this.$route.path == '/dashboard' ||
          this.$route.name == 'InventoryHome' ||
          this.$route.name == 'ProfilePage' ||
          this.$route.path == '/orders'
        "
      >
        <div class="d-flex align-center">
          <v-icon
            size="35"
            :class="{ 'white--text': this.$route.path == '/dashboard' }"
            style="margin-top: -15px; margin-left: -5px"
            @click="openDrawer()"
          >
            mdi-text-short</v-icon
          >
          <!-- logo -->
          <div class="nova-logo">
            <img
              class="mx-4"
              v-show="this.$route.path !== '/dashboard'"
              src="@/assets/images/primary-logo.png"
            />
          </div>
        </div>
      </div>
      <div class="pb-16">
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
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile");
    }
  },
  methods: {
    openDrawer() {
      this.$refs.sidebar.openDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-pages-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  .page-content {
    width: -webkit-fill-available;
    transition: 0.5s ease;
    position: relative;
    &--header {
      display: none;
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
}
@media (max-width: 1000px) {
  .dashboard-pages-container {
    .page-content {
      &--header {
        display: block;
        &--dashboard {
          background: var(--v-primary-base);
          position: fixed;
          z-index: 2;
        }
      }
    }
  }
}
</style>