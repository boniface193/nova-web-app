<template>
  <v-container>
    <div class="mx-3">
      <p class="sub-header">
        You have <span class="font-weight-bold">20</span> orders.
      </p>
      <!-- search filter -->
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
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
=======
      <v-row class="d-flex justify-end">
        <v-col cols="10" lg="5" md="5">
          <Search placeholder="Search orders" @search="getSearchValue" />
        </v-col>
        <v-col cols="2" lg="1" md="1" class="px-0">
          <div class="primary text-center rounded-lg">
            <v-icon color="white" style="padding: 5.3px">mdi-menu</v-icon>
          </div>
        </v-col>
      </v-row>
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue

      <!-- card item -->
      <div v-if="isLoading" class="text-center my-8">
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

      <v-row>
        <v-col sm="4" v-for="orders in ordersItems" :key="orders.id">
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
          <v-card outlined class="rounded-lg pa-5 mb-3" height="100%">
=======
          <!-- if no order -->
          <p v-if="orders.length == 0" class="text-center mt-8">
            No Item Found
          </p>
          <v-card outlined class="rounded-lg pa-5 mb-3">
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
            <step-progress
              :steps="['Processing', 'Shipped', 'Delivered']"
              :current-step="
                orders.isProcessing || orders.isShipped || orders.isDelivered
                  ? 1
                  : 0
              "
              icon-class="fa fa-check"
              :line-thickness="lineThickness"
              active-color="#FFA500"
              :active-thickness="activeThickness"
              :passive-thickness="passiveThickness"
              passive-color="#5E5E5E1A"
            ></step-progress>
            <v-row class="mt-12">
              <v-col cols="5" class="py-0">
                <div class="text-center">
                  <v-progress-circular
                    v-if="loadImage"
                    color="primary"
                    class="text-center"
                    indeterminate
                    size="20"
                    width="2"
                  ></v-progress-circular>
                  <v-img
                    v-if="!loadImage"
                    :src="orders.product_image_url"
                    class="image-bgColor"
                    width="100%"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="7" class="pa-0">
                <div class="order-item-font">
                  Order No:
                  <span class="order-no-blue">
                    <router-link
                      :to="{ name: 'orderDetails', params: { id: orders.id } }"
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
                  <span class="order-no-grey">{{ orders.customer_name }}</span>
                </div>
                <div class="order-item-font">
                  Payment Status:
                  <span class="order-no-grey">{{
                    orders.payment_status_label
                  }}</span>
                </div>
                <div class="order-item-font">
                  Price (NGN):
                  <span class="order-no-grey">{{ orders.subtotal_label }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
    <!-- pagination -->
    <div class="text-center pa-3">
      <!-- <v-pagination
        v-model="getCurrentPage.currentPage"
        :length="pageDetails.last_page"
        @input="setCurentPage"
        circle
        small
        style="font-size: 8px"
      ></v-pagination> -->
    </div>
=======
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
  </v-container>
</template>

<script>
import Search from "@/components/general/SearchBar.vue";
import StepProgress from "vue-step-progress";
import { mapGetters, mapState } from "vuex";

// import the css (OPTIONAL - you can provide your own design)
import "vue-step-progress/dist/main.css";

export default {
  components: {
    Search,
    "step-progress": StepProgress,
  },
  data() {
    return {
      loadImage: true,
      isLoading: true,
      // searchValue: "",
      filterItems: "",
      lineThickness: 1,
      activeThickness: 3,
      passiveThickness: 3,
      mySteps: ["Step 1", "Step 2", "Step 3"],
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
      filterParameters: {
        price: true,
      },
      ordersItems: [],
=======
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
    };
  },

  computed: {
    // to populate items on the table
    ...mapGetters({
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
      order: "orders/orders",
    }),
    ...mapState({
      // page: (state) => state.orders.page,
      // pageDetails: (state) => state.orders.pageDetails,
      // searchOrder: (state) => state.orders.searchOrder,
      // getCurrentPage() {
      //   return {
      //     currentPage: this.pageDetails.current_page,
      //   };
      // },
=======
      ordersItems: "orders/orders",
      searchOrder: "orders/searchOrder",
    }),
    ...mapState({
      searchValue: (state) => state.orders.searchValue,
      pageDetails: (state) => state.orders.pageDetails,
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
    }),
  },
  created() {
    this.$store.dispatch("orders/getOrders").then(() => {
      this.isLoading = false;
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
      this.ordersItems = e;
      e.forEach((i) => {
        if (i.product_image_url) {
          this.loadImage = false;
        }
      });
      if (e.length < 1) {
        this.empty = "No Sales Recorded Yet";
      }
    });

    let ifConnected = window.navigator.onLine;
    if (!ifConnected) {
      this.empty = "please connect to the internet";
    }
=======
    });
    this.$store.dispatch("orders/filterGetOrders");
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
  },

  methods: {
    // search the datatable items
    getSearchValue(params) {
      this.$store.commit("orders/getSearchValue", params);
      this.$store.commit("orders/setSearchOrder", true);
<<<<<<< HEAD:src/views/authPages/orders/Orders.vue
      this.$store.dispatch("orders/searchOrders").then(() => {
        this.isLoading = false;
      });
      this.getOrder();
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
      });
    },
    // filter function
    filterTable(params) {
      this.$store.commit("orders/filterOrders", {
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      });
      this.filterGetOrders();
    },

    // reset the filter and it will affect the table
    resetFilter() {
      this.$store.commit("orders/filterOrders", {
        minPrice: 0,
        maxPrice: 0,
        selectedOptions: [],
      });
      this.filterGetOrders();
    },

    // set current page
    setCurentPage() {
      this.$store.commit("orders/setPage", this.getCurrentPage.currentPage);
      this.$store.commit(
        "orders/setPageDetails",
        this.getCurrentPage.currentPage
      );
      this.filterGetOrders();
      this.getOrder();

      this.getOrder === true ? this.getSearchValue() : "";
=======
      this.$store.dispatch("orders/searchOrders").then((response) => {
        this.isLoading = true;
        if (response) {
          this.isLoading = false;
          if (!response) {
            alert('hello')
          }
        }
        
      });
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/Orders.vue
    },
  }
  // computed: {
  //   filterItem: function () {
  //     return this.ordersItems.filter((blog) => {
  //       return blog.customers_name.match(this.searchValue);
  //     });
  //   },
  // },
};
</script>
<style lang="scss" >
.header {
  color: #2b2b2b;
  font-size: 14px;
  text-align: left;
  margin: 25px 0 15px 0;
  font-family: "Product Sans Regular";
}
.sub-header {
  color: #2b2b2b;
  font-size: 14px;
  font-family: "Product Sans Regular";
}
.image-bgColor {
  background-color: #f3f5ff;
  border-radius: 10px;
}
.order-item-font {
  color: #2b2b2b;
  font-family: "Product Sans Bold" !important;
  font-size: 12px;
}
.order-no-blue {
  color: #029b97;
  font-size: 11px;
  font-family: "Product Sans Bold" !important;
}
.order-no-grey {
  color: #979797;
  font-size: 12px;
  font-family: "Product Sans Regular" !important;
}
.order-no-lighter-grey {
  color: #bebebe;
  font-size: 11px;
  font-family: "Product Sans Regular" !important;
}

div.step-progress__step span {
  color: var(--passiveColor);
  transition: 0.3s ease;
  display: none !important;
  font-size: 50px;
  transform: translateZ(0) scale(1) perspective(1000px);
  font-weight: 900;
  text-align: center;
  opacity: 1;
}

.step-progress__step-label {
  position: absolute;
  top: calc(100% + 25px);
  left: 50%;
  transform: translateX(-50%) perspective(1000px);
  white-space: nowrap;
  font-size: 10px;
  font-weight: normal;
  color: #979797 !important;
  transition: 0.3s ease;
  font-family: "Product Sans Regular";
}

.step-progress__step:after {
  width: 13px;
  height: 13px;
}

.step-progress__bar {
  width: 100%;
  display: flex;
  height: 15px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.position-abs {
  position: absolute !important;
  color: #029b97;
  font-size: 20px !important;
  opacity: 0.5;
}
.search-container {
  width: 400px;
}
@media (max-width: 500px) {
  .search-container {
    width: -webkit-fill-available;
  }
}
</style>

