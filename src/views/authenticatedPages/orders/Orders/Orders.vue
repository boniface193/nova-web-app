<template>
  <div>
    <div>
      <p class="sub-header">
        You have
        <span class="font-weight-bold">{{
          activeTab == "Inventory" ? ordersItems.length : openSelling.length
        }}</span>
        orders.
      </p>
      <!-- search filter -->
      <div class="d-flex align-center" style="justify-content: flex-end">
        <div class="search-container">
          <Search
            placeholder="Order Number or Product Name"
            bgColor="#DDF8F7"
            borderColor="transparent"
            @search="getSearchValue"
          />
        </div>

        <BasicFilter
          :price="filterParameters.price"
          toolTipText="Filter products"
          headerName="Filter Orders"
          @filterOption="filterTable"
          @resetFilter="resetFilter"
          class="ml-1"
        />
      </div>

      <!-- navbar -->
      <div class="d-flex align-center mb-4 mt-10 move-to-center">
        <div
          class="navigator"
          :class="{ 'navigator--active': activeTab == 'Inventory' }"
          @click="changeTab('Inventory')"
        >
          <p class="mb-0" :class="{ 'white--text': activeTab == 'Inventory' }">
            Inventory
          </p>
        </div>
        <div
          class="navigator"
          :class="{ 'navigator--active': activeTab == 'openSelling' }"
          @click="changeTab('openSelling')"
        >
          <p
            class="mb-0"
            :class="{ 'white--text': activeTab == 'openSelling' }"
          >
            Open Selling
          </p>
        </div>
      </div>

      <div v-show="activeTab == 'Inventory'">
        <div class="mx-3 text-center mt-5" v-show="emptyOrder">
          <div class="text-h4 text-lg-h4">Orders</div>
          <img
            class="text-center my-8"
            src="@/assets/images/orders.svg"
            width="30%"
          />
          <div class="text-body-1 text-lg-h5 margin-top">No orders yet.</div>
          <p class="grey--text text-body-1 mt-3">
            Once you make a sale, you'll find it here.
          </p>
          <div class="d-flex justify-center">
            <v-btn
              :to="{ name: 'InventoryHome' }"
              class="text-capitalize mt-8"
              height="48px"
              depressed
              color="primary"
              >Start Selling</v-btn
            >
          </div>
        </div>

        <!-- card item -->
        <div v-if="isInventoryLoading" class="text-center my-8">
          <!-- this image time loader is calculated by the loader to triger the load time -->
          <v-progress-circular
            color="#029B97"
            class="text-center"
            indeterminate
            size="20"
            width="2"
          ></v-progress-circular>
        </div>
        <!-- loader ends here -->
        <!-- if no order -->
        <p class="text-center mt-8" v-else-if="empty">{{ empty }}</p>
        <div v-else>
          <!-- view only on larger sceen -->
          <table
            class="table text-left table-borderless screen-break-point"
            v-if="!emptyOrder"
          >
            <thead>
              <tr class="tableItem">
                <th v-for="item in tableHeader" :key="item.id" scope="col">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody class="tableItem text-left">
              <tr v-for="orders in ordersItems" :key="orders.id">
                <td>
                  <span>
                    <router-link
                      :to="{
                        name: 'OrderDetails',
                        params: { id: orders.id },
                      }"
                      style="text-decoration: none"
                    >
                      {{ orders.id }}
                    </router-link>
                  </span>
                </td>
                <td>{{ orders.customer.name }}</td>
                <td>{{ orders.subtotal_label }}</td>
                <td>
                  <span
                    >{{ orders.created_at.slice(0, -6) }}
                    <span class="order-no-lighter-grey">{{
                      orders.created_at.slice(10)
                    }}</span></span
                  >
                </td>
                <td>{{ orders.payment_status_label }}</td>
                <td>
                  <v-chip
                    :text-color="
                      orders.delivery_status_label == 'Shipped'
                        ? '#FFA500'
                        : '' || orders.delivery_status_label == 'Processing'
                        ? '#0500FF'
                        : '' || orders.delivery_status_label == 'Delivered'
                        ? '#029B97'
                        : ''
                    "
                    :color="
                      orders.delivery_status_label == 'Shipped'
                        ? '#FFA5000D'
                        : '' || orders.delivery_status_label == 'Processing'
                        ? '#0500FF0D'
                        : '' || orders.delivery_status_label == 'Delivered'
                        ? '#029B970D'
                        : ''
                    "
                    >{{ orders.delivery_status_label }}</v-chip
                  >
                </td>
              </tr>
            </tbody>
          </table>

          <!-- view only on smaller screen -->
          <v-row class="d-block d-sm-none">
            <v-col
              class="col-12 col-lg-4 col-sm-6"
              v-for="orders in ordersItems"
              :key="orders.id"
            >
              <v-card outlined class="rounded-lg py-5 px-8 mb-3" height="100%">
                <v-row>
                  <v-col cols="6">
                    <div class="order-item-font">
                      Order No:
                      <span class="order-no-blue">
                        <router-link
                          :to="{
                            name: 'OrderDetails',
                            params: { id: orders.id },
                          }"
                          style="text-decoration: none"
                        >
                          {{ orders.id }}
                        </router-link>
                      </span>
                    </div>
                    <div class="order-item-font">
                      Time:
                      <span class="order-no-grey"
                        >{{ orders.created_at.slice(0, -6) }}
                        <span class="order-no-lighter-grey">{{
                          orders.created_at.slice(10)
                        }}</span></span
                      >
                    </div>
                    <div class="order-item-font">
                      Customer:
                      <span class="order-no-grey">{{
                        orders.customer.name
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="order-item-font">
                      Payment Status:
                      <span class="order-no-grey">{{
                        orders.payment_status_label
                      }}</span>
                    </div>
                    <div class="order-item-font">
                      Price (NGN):
                      <span class="order-no-grey">{{
                        orders.subtotal_label
                      }}</span>
                    </div>
                    <v-chip
                      class="mt-2"
                      :text-color="
                        orders.delivery_status_label == 'Shipped'
                          ? '#FFA500'
                          : '' || orders.delivery_status_label == 'Processing'
                          ? '#0500FF'
                          : '' || orders.delivery_status_label == 'Delivered'
                          ? '#029B97'
                          : ''
                      "
                      :color="
                        orders.delivery_status_label == 'Shipped'
                          ? '#FFA5000D'
                          : '' || orders.delivery_status_label == 'Processing'
                          ? '#0500FF0D'
                          : '' || orders.delivery_status_label == 'Delivered'
                          ? '#029B970D'
                          : ''
                      "
                      >{{ orders.delivery_status_label }}</v-chip
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <!-- Inventorry pagination -->
          <div
            class="d-flex justify-space-between align-center flex-wrap mt-6"
            v-if="ordersItems.length >= 6 && !isInventoryLoading && !empty"
          >
            <div class="d-flex justify-space-between align-center flex-wrap">
              <p class="mb-2 mr-5">
                Page {{ pageDetails.current_page }} of
                {{ pageDetails.last_page }}
              </p>
            </div>
            <div class="pagination mb-2">
              <v-pagination
                v-model="pageDetails.current_page"
                :length="pageDetails.last_page"
                @input="setCurentPage"
                circle
              >
              </v-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- open selling -->
      <div v-show="activeTab == 'openSelling'">
        <div class="mx-3 text-center my-5" v-show="emptyOpenSelling">
          <div class="text-h4 text-lg-h4">Orders</div>
          <img
            class="text-center my-8"
            src="@/assets/images/orders.svg"
            width="30%"
          />
          <div class="text-body-1 text-lg-h5 margin-top">No orders yet.</div>
          <p class="grey--text text-body-1 mt-3">
            Once you make a sale, you'll find it here.
          </p>
          <div class="d-flex justify-center">
            <v-btn
              :to="{ path: 'open-selling' }"
              class="text-capitalize mt-8"
              height="48px"
              depressed
              color="primary"
              >Start Selling</v-btn
            >
          </div>
        </div>

        <!-- card item -->
        <div v-if="isOpenSellingLoading" class="text-center my-8">
          <!-- this image time loader is calculated by the loader to triger the load time -->
          <v-progress-circular
            color="#029B97"
            class="text-center"
            indeterminate
            size="20"
            width="2"
          ></v-progress-circular>
        </div>

        <p class="text-center mt-8" v-else-if="empty">{{ empty }}</p>
        <div v-else>
          <!-- view only on larger sceen -->
          <table
            class="table text-left table-borderless screen-break-point"
            v-show="!emptyOpenSelling"
          >
            <thead>
              <tr class="tableItem">
                <th v-for="item in tableHeader" :key="item.id" scope="col">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody class="tableItem text-left">
              <tr v-for="orders in openSelling" :key="orders.id">
                <td>
                  <span>
                    <router-link
                      :to="{
                        name: 'OpenOrderDetails',
                        params: { id: orders.id },
                      }"
                      style="text-decoration: none"
                    >
                      {{ orders.id }}
                    </router-link>
                  </span>
                </td>
                <td>{{ orders.customer.name }}</td>
                <td>{{ orders.subtotal_label }}</td>
                <td>
                  <span
                    >{{ orders.created_at.slice(0, -6) }}
                    <span class="order-no-lighter-grey">{{
                      orders.created_at.slice(10)
                    }}</span></span
                  >
                </td>
                <td>{{ orders.payment_status_label }}</td>
                <td>
                  <v-chip
                    :text-color="
                      orders.delivery_status_label == 'Shipped'
                        ? '#FFA500'
                        : '' || orders.delivery_status_label == 'Processing'
                        ? '#0500FF'
                        : '' || orders.delivery_status_label == 'Delivered'
                        ? '#029B97'
                        : ''
                    "
                    :color="
                      orders.delivery_status_label == 'Shipped'
                        ? '#FFA5000D'
                        : '' || orders.delivery_status_label == 'Processing'
                        ? '#0500FF0D'
                        : '' || orders.delivery_status_label == 'Delivered'
                        ? '#029B970D'
                        : ''
                    "
                    >{{ orders.delivery_status_label }}</v-chip
                  >
                </td>
              </tr>
            </tbody>
          </table>

          <v-row class="d-block d-sm-none">
            <v-col
              class="col-12 col-lg-4 col-sm-6"
              v-for="orders in openSelling"
              :key="orders.id"
            >
              <v-card outlined class="rounded-lg py-5 px-8 mb-3" height="100%">
                <v-row>
                  <v-col cols="6">
                    <div class="order-item-font">
                      Order No:
                      <span class="order-no-blue">
                        <router-link
                          :to="{
                            name: 'OpenOrderDetails',
                            params: { id: orders.id },
                          }"
                          style="text-decoration: none"
                        >
                          {{ orders.id }}
                        </router-link>
                      </span>
                    </div>
                    <div class="order-item-font">
                      Time:
                      <span class="order-no-grey"
                        >{{ orders.created_at.slice(0, -6) }}
                        <span class="order-no-lighter-grey">{{
                          orders.created_at.slice(10)
                        }}</span></span
                      >
                    </div>
                    <div class="order-item-font">
                      Customer:
                      <span class="order-no-grey">{{
                        orders.customer.name
                      }}</span>
                    </div>
                  </v-col>

                  <v-col cols="6">
                    <div class="order-item-font">
                      Payment Status:
                      <span class="order-no-grey">{{
                        orders.payment_status_label
                      }}</span>
                    </div>
                    <div class="order-item-font">
                      Price (NGN):
                      <span class="order-no-grey">{{
                        orders.total_product_price_label
                      }}</span>
                    </div>

                    <v-chip
                      class="mt-2"
                      :text-color="
                        orders.delivery_status_label == 'Shipped'
                          ? '#FFA500'
                          : '' || orders.delivery_status_label == 'Processing'
                          ? '#0500FF'
                          : '' || orders.delivery_status_label == 'Delivered'
                          ? '#029B97'
                          : ''
                      "
                      :color="
                        orders.delivery_status_label == 'Shipped'
                          ? '#FFA5000D'
                          : '' || orders.delivery_status_label == 'Processing'
                          ? '#0500FF0D'
                          : '' || orders.delivery_status_label == 'Delivered'
                          ? '#029B970D'
                          : ''
                      "
                      >{{ orders.delivery_status_label }}</v-chip
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- pagination -->
          <div
            class="d-flex justify-space-between align-center flex-wrap mt-6"
            v-if="openSelling.length >= 6 && !isOpenSellingLoading && !empty"
          >
            <div class="d-flex justify-space-between align-center flex-wrap">
              <p class="mb-2 mr-5">
                Page {{ setPageDetailsForOpenSelling.current_page }} of
                {{ setPageDetailsForOpenSelling.last_page }}
              </p>
            </div>
            <div class="pagination mb-2">
              <v-pagination
                v-model="setPageDetailsForOpenSelling.current_page"
                :length="setPageDetailsForOpenSelling.last_page"
                @input="setCurentPage"
                circle
              ></v-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasicFilter from "@/components/secondary/BasicFilter.vue";
import Search from "@/components/primary/SearchBar.vue";
import { mapState } from "vuex";

export default {
  components: {
    Search,
    BasicFilter,
  },
  data() {
    return {
      activeTab: "Inventory",
      emptyOrder: false,
      emptyOpenSelling: false,
      loadImage: true,
      isInventoryLoading: true,
      isOpenSellingLoading: true,
      empty: "",
      deliveryStatus: "",
      date: "",
      time: "",
      filterParameters: {
        price: true,
      },
      ordersItems: [],
      openSelling: [],
      tableHeader: [
        "Order No",
        "Customer",
        "Amount (₦)",
        "Date & Time",
        "Status",
        "Tracking",
      ],
    };
  },

  computed: {
    // to populate items on the table
    ...mapState({
      page: (state) => state.orders.page,
      openSellingPage: (state) => state.orders.openSellingPage,
      pageDetails: (state) => state.orders.pageDetails,
      setPageDetailsForOpenSelling: (state) =>
        state.orders.PageDetailsForOpenSelling,
      searchValue: (state) => state.order.searchValue,
      searchOrder: (state) => state.orders.searchOrder,
    }),
  },
  created() {
    this.getInventoryOrder();
    this.getOpenOrder();

    let ifConnected = window.navigator.onLine;
    if (!ifConnected) {
      this.empty = "please connect to the internet";
    }
  },

  methods: {
    changeTab(tabName) {
      this.activeTab = tabName;
    },
    // Inventory Order
    getInventoryOrder() {
      this.$store.dispatch("orders/getOrders").then((e) => {
        this.isInventoryLoading = false;
        this.ordersItems = e;
        e.forEach((i) => {
          if (i.product_image_url) {
            this.loadImage = false;
          }
        });
        if (e.length < 1) {
          this.emptyOrder = true;
        }
      });
    },
    getOpenOrder() {
      this.$store.dispatch("orders/getOpensellingDetails").then((e) => {
        this.isOpenSellingLoading = false;
        this.openSelling = e;
        e.forEach((i) => {
          if (i.product_image_url) {
            this.loadImage = false;
          }
        });
        if (e.length < 1) {
          this.emptyOpenSelling = true;
        }
      });
    },
    // search the datatable items
    getSearchValue(params) {
      this.isInventoryLoading = true;
      this.isOpenSellingLoading = true;
      this.empty = "";
      if (this.activeTab == "Inventory") {
        this.$store.commit("orders/getSearchValue", params);
        this.$store.commit("orders/setSearchOrder", true);
        this.$store.dispatch("orders/searchOrders").then((res) => {
          if (res.data.data.length === 0) {
            this.isInventoryLoading = false;
            this.empty = "No order found";
          } else {
            this.empty = "";
            this.isInventoryLoading = false;
          }
        });
        this.getOrder();
      } else {
        this.$store.commit("orders/getSearchValue", params);
        this.$store.commit("orders/setSearchOrder", true);
        this.$store.dispatch("orders/getOpensellingDetails").then((res) => {
          if (res.length < 1) {
            this.isOpenSellingLoading = false;
            this.empty = "No order found";
          } else {
            this.isOpenSellingLoading = false;
            this.empty = "";
          }
          this.openSelling = res;
        });
      }
    },

    getOrder() {
      this.$store.dispatch("orders/searchOrders").then((e) => {
        this.ordersItems = e.data.data;
      });
    },

    // page here
    filterGetOrders() {
      this.$store.dispatch("orders/filterGetOrders").then((e) => {
        this.ordersItems = e.data.data;
        this.isInventoryLoading = true;
        setTimeout(() => {
          if (e.data.data.length === 0) {
            this.isInventoryLoading = false;
            this.empty = "No search matched";
          } else {
            this.empty = "";
            this.isInventoryLoading = false;
          }
        }, 1000);
      });
    },
    // filter function
    filterTable(params) {
      if (this.activeTab == "Inventory") {
        this.$store.commit("orders/filterOrders", {
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        });
        this.filterGetOrders();
      } else {
        this.$store.commit("orders/filterOrders", {
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        });
        this.$store.dispatch("orders/getOpensellingDetails").then((res) => {
          this.isOpenSellingLoading = true;
          this.empty = "";
          setTimeout(() => {
            if (res.length < 1) {
              this.isOpenSellingLoading = false;
              this.empty = "No order found";
            } else {
              this.isOpenSellingLoading = false;
              this.empty = "";
            }
          }, 1000);
          this.openSelling = res;
        });
      }
    },

    // reset the filter and it will affect the table
    resetFilter() {
      if (this.activeTab == "Inventory") {
        this.$store.commit("orders/filterOrders", {
          minPrice: 0,
          maxPrice: 0,
          selectedOptions: [],
        });
        this.filterGetOrders();
      } else {
        this.$store.commit("orders/filterOrders", {
          minPrice: 0,
          maxPrice: 0,
          selectedOptions: [],
        });
        this.$store.dispatch("orders/getOpensellingDetails").then((res) => {
          this.isOpenSellingLoading = true;
          this.empty = "";
          setTimeout(() => {
            if (res.length < 1) {
              this.isOpenSellingLoading = false;
              this.empty = "No order found";
            } else {
              this.isOpenSellingLoading = false;
              this.empty = "";
            }
          }, 1000);
          this.openSelling = res;
        });
      }
    },

    // set current page
    setCurentPage(params) {
      if (this.activeTab == "Inventory") {
        this.$store.commit("orders/setPage", params);
        this.$store.commit("orders/setPageDetails", params);
        this.searchOrder === true ? "" : this.getInventoryOrder();
      } else {
        this.$store.commit("orders/setOpenSellingPage", params);
        this.$store.commit("orders/setPageDetailsForOpenSelling", params);
        this.searchOrder === true ? "" : this.getOpenOrder();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Orders.scss";
</style>

