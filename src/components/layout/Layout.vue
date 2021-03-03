<template>
  <div style="margin: auto; max-width: 1800px">
    <v-card elevation="0">
      <!-- User dashboard layout -->
      <!-- navbar -->
      <!-- <v-card elevation="0"> -->
      <v-app-bar
        elevation="0"
        app
        dark
        color="primary"
        v-if="this.$route.path == '/dashboard'"
        class="elevation-1 rounded-0 border-0 px-2 pt-3"
        width="100%"
      >
        <v-app-bar-nav-icon v-if="!drawer" @click.stop="drawer = !drawer">
          <v-icon size="19"> mdi-segment</v-icon>
        </v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <div class="d-flex">
          <v-img src="@/assets/images/bell.svg" width="11px"></v-img>
        </div>
      </v-app-bar>
      <!-- <div
      class="d-flex rounded-0"
      style="background-color: #5064cc; border-color: #5064cc"
    >
      <div v-if="!drawer" @click.stop="drawer = !drawer">
        <v-icon size="19" color="#000"> mdi-segment</v-icon>
      </div>
      <v-spacer></v-spacer>
      <div class="">
        <v-img src="@/assets/images/bell.svg" width="11px"></v-img>
      </div>
    </div> -->
      <!-- <slot :toggle="drawer"></slot> -->

      <!-- drawer icon for other pages -->
      <div
        :class="{ 'd-none': this.drawer }"
        v-if="
          this.$route.name === 'Orders' ||
          this.$route.name === 'ProfilePage' ||
          this.$route.name === 'InventoryHome'
        "
        class="mt-3 ml-3"
      >
        <v-container>
          <v-icon
            class="float-left mt-6 mr-5"
            size="20"
            v-if="!drawer"
            @click.stop="drawer = !drawer"
          >
            mdi-segment</v-icon
          >

          <div class="header">
            N<img src="@/assets/images/fire.svg" width="15px" height="15px" />VA
          </div>
        </v-container>
      </div>

      <div v-else></div>
      <!-- this to add space between layout and nav when drawer is true -->
      <div
        :class="{ 'my-12': this.drawer }"
        v-if="
          this.$route.name === 'Orders' ||
          this.$route.name === 'ProfilePage' ||
          this.$route.name === 'InventoryHome'
        "
      ></div>

      <!-- drawer -->
      <v-navigation-drawer
        class="border-0"
        app
        color="white"
        width="250"
        v-model="drawer"
      >
        <v-container class="mx-5 my-10 d-flex">
          <div class="d-flex nova-logo">
            N<span
              ><v-img
                src="@/assets/images/fire.svg"
                width="20px"
                class="mx-1"
              ></v-img></span
            >VA
          </div>
          <v-spacer></v-spacer>
          <v-icon color="primary" size="32" class="mr-6" @click="closeDrawer"
            >mdi-close</v-icon
          >
        </v-container>
        <v-list class="pa-0" nav tile>
          <v-list-item-group mandatory>
            <v-list-item
              class="rounded-0"
              v-for="item in items"
              :key="item.key"
              link
              router
              :to="item.routes"
            >
              <v-list-item-content class="mx-5">
                <v-list-item-title
                  class="text-size-md"
                  :class="{ activeColor: item.routes }"
                >
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
          <div class="grey--text text-size-md" @click="logout">
            <v-icon class="mx-4 primary--text mb-2" size="25">mdi-logout</v-icon> Log
            Out
          </div>
        </div>
      </v-navigation-drawer>
    </v-card>
    <!-- modal for dialog messages -->
    <modal :dialog="dialog" width="120">
      <div class="text-center dialog white">Loging Out...</div>
    </modal>
  </div>
</template>

<script>
import modal from "@/components/modal.vue";
export default {
  // props: ['drawer'],
  components: {
    modal,
  },
  data: () => ({
    drawer: false,
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
  created() {
    if (this.$store.getters["settings/profile"].name === "") {
      this.$store.dispatch("settings/getUserProfile");
    }

    this.largerScreen();
  },
  methods: {
    closeDrawer() {
      this.drawer = false;
    },

    largerScreen() {
      if (window.screen.width >= 1024) {
        this.drawer = true;
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
@import url("https://fonts.googleapis.com/css2?family=Kumbh&family=Montserrat&family=Poppins&family=Roboto&family=Product+Sans&display=swap");

.nova-logo {
  text-align: left;
  font-family: "Product Sans";
  line-height: 25px;
  font-size: 29px;
  font-weight: normal;
  font-variant: normal;
  font-style: normal;
  letter-spacing: 3px;
  color: #060607;
}

.v-list-item--link::before {
  background-color: transparent;
  z-index: 1;
}

.text-size-md {
  font-family: "Product Sans";
  color: #646464;
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: lighter;
  cursor: pointer;
}

.position-absolute {
  position: absolute;
}

.v-btn:before {
  background-color: transparent;
}

.v-application--wrap {
  background-color: #2e2e2e33 !important;
}
</style>