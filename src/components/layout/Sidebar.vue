<template>
  <div
    class="sidebar-container mobile-sidebar"
    :class="{
      'hide-sidebar': drawer == false,
      'hide-mobile-sidebar': drawer == false,
    }"
  >
    <div class="sidebar">
      <div class="sidebar-content">
        <v-container
          class="px-5 my-10 d-flex align-center justify-space-between"
        >
          <div class="nova-logo d-flex align-center">
            <img src="@/assets/images/primary-logo.png" />
          </div>

          <v-icon
            color="primary"
            size="32"
            @click="closeDrawer"
            style="cursor: pointer"
            >mdi-close</v-icon
          >
        </v-container>

        <!-- routes links -->
        <v-list class="pa-0" nav tile>
          <v-list-item-group mandatory>
            <v-list-item
              class="rounded-0"
              v-for="item in items"
              :key="item.key"
              link
              router
              :to="item.routes"
              :class="{ activeColor: $route.path === item.routes }"
              @click="checkScreen"
            >
              <v-list-item-content class="mx-5">
                <v-list-item-title class="text-size-md">
                  <v-img
                    v-if="!item.icons"
                    :src="item.icon"
                    width="22px"
                    class="float-left"
                  ></v-img>
                  <v-icon
                    v-if="item.icons"
                    class="float-left primary--text"
                    size="25"
                    >{{ item.icon }}</v-icon
                  >
                  <div class="ml-11 pt-1 grey--text">
                    {{ item.title }}
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div class="ml-3 my-5">
          <div
            class="grey--text text-size-md"
            @click="logout"
            style="cursor: pointer"
          >
            <v-icon class="mx-4 primary--text mb-2" size="25"
              >mdi-logout</v-icon
            >
            Log Out
          </div>
        </div>
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
export default {
  name: "Sidebar",
  components: { modal },
  props: ["drawer"],
  data: () => ({
    dialog: false,
    items: [
      {
        title: "Inventory",
        icon: "mdi-cart",
        icons: true,
        routes: "/inventory",
      },
      {
        title: "Dashboard",
        icon: "mdi-border-all",
        icons: true,
        routes: "/dashboard",
      },
      {
        title: "Orders",
        icon: "mdi-shopping",
        icons: true,
        routes: "/orders",
      },
      {
        title: "Settings",
        icon: "mdi-cog",
        icons: true,
        routes: "/settings",
      },
    ],
  }),
  methods: {
    closeDrawer() {
      this.$emit("closeDrawer");
    },
    checkScreen() {
      if (window.screen.width < 1260) {
        this.closeDrawer();
      }
    },
    logout() {
      this.$store.commit("reset");
      this.$store.commit("onboarding/removeToken");
      this.dialog = true;
      setTimeout(() => {
        this.$router.push({
          name: "Signin",
        });
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar-container {
  min-width: 250px;
  width: 250px;
  height: 100%;
  overflow: hidden;
  transition: 0.5s ease;
  z-index: 10;
  position: fixed;

  .sidebar {
    min-width: 250px;
    width: 250px;
    height: 100vh;
    top: 0px;
    max-height: calc(100% - 0px);
    background: white;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    z-index: 11;
    .sidebar-content {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .nova-logo {
        width: 100px;
        img {
          width: 100%;
        }
      }
    }
  }
}
.hide-sidebar {
  margin-left: -250px;
}
@media (max-width: 1260px) {
  .mobile-sidebar {
    margin-left: 0px;
    min-width: 100%;
    width: 100%;
    position: fixed;
    &::before {
      opacity: 0.46;
      background-color: #212121;
      position: absolute;
      width: 100%;
      z-index: -1;
      height: 100%;
      content: "";
    }
  }
  .hide-mobile-sidebar {
    margin-left: -250px;
    min-width: 250px;
    width: 250px;
  }
}
</style>