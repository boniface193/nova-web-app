<template>
  <div
    class="sidebar-container mobile-sidebar"
    :class="{
      'mobile-sidebar--active': drawer == true,
    }"
  >
    <div class="sidebar">
      <div class="sidebar-content">
        <div class="px-7 my-10 d-flex align-end justify-space-between">
          <router-link :to="{ name: 'Home' }">
            <div class="nova-logo d-flex align-center">
              <img src="@/assets/images/primary-logo.png" />
            </div>
          </router-link>
          <v-icon
            color="primary"
            size="32"
            @click="closeDrawer"
            class="close-drawer"
            >mdi-close</v-icon
          >
        </div>

        <!-- routes links -->
        <v-list class="pa-0" nav tile>
          <v-list-item-group mandatory>
            <v-list-item
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
    <div class="overlay" @click="closeDrawer"></div>
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
  data: () => ({
    dialog: false,
    drawer: false,
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
      this.drawer = false;
    },
    openDrawer() {
      this.drawer = true;
    },
    checkScreen() {
      if (window.screen.width <= 1000) {
        this.closeDrawer();
      }
    },
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
.sidebar-container {
  height: 100%;
  z-index: 10;
  min-width: 225px;
  overflow: hidden;
  .sidebar {
    transition: 0.5s ease;
    min-width: 225px;
    width: 225px;
    position: fixed;
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
      .close-drawer {
        display: none;
        cursor: pointer;
      }
    }
  }
}
@media (max-width: 1000px) {
  .mobile-sidebar {
    min-width: auto;
    .sidebar {
      margin-left: -225px;
    }
    &--active {
      position: fixed;
      min-width: 100%;
      .overlay {
        height: 100%;
        width: 100%;
        opacity: 0.46;
        background-color: #212121;
        z-index: -1;
        position: fixed;
        top: 0;
      }
      .sidebar {
        margin-left: 0px;
        &-content {
          .close-drawer {
            display: block !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.v-list--nav .v-list-item,
.v-list--nav .v-list-item:before {
  border-radius: 0px !important;
}
</style>