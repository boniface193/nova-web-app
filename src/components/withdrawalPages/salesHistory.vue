<template>
  <v-container>
    <div class="mx-5">
      <div class="chOder my-9">
        <router-link :to="{ path: '/dashboard' }">
          <v-icon class="float-left">mdi-chevron-left</v-icon>
        </router-link>
        <div v-if="!Search" class="d-flex ">
          <h5 class="text-center mx-auto">Sales History</h5>
          <v-icon style="cursor: pointer" @click="toggleSearch">mdi-magnify</v-icon>
        </div>
        <div class="mx-10 d-flex justify-center" @mouseout="toggleOnLeave">
          <Search placeholder="Search history" class="mx-lg-md-17"  v-if="Search"/>
        </div>
      </div>

      <v-row>
        <v-col sm="4" md="6" v-for="items in salesHistory" :key="items.id">
          <v-card outlined class="rounded-lg py-3">
            <v-row>
              <v-col cols="5">
                <div class="text-center">
                  <v-img
                    :src="items.image"
                    class="mx-3 my-5 image-bgColor"
                    width="90%"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="7" class="pr-5 pl-1 my-lg-3 my-md-3">
                <div class="order-item-font mt-2">
                  Item:
                  <span class="order-no-grey"> {{items.itemName}} </span>
                </div>
                <div class="order-item-font mt-1">
                  Time:
                  <span class="order-no-grey"
                    >{{items.date}}
                    <span class="order-no-lighter-grey">{{items.time}}</span></span
                  >
                </div>
                <div class="order-item-font mt-1">
                  Customer:
                  <span class="order-no-grey">{{items.customers_name}}</span>
                </div>
                <div class="order-item-font mt-1">
                  Amount (NGN):
                  <span class="order-no-grey">{{items.price}}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Search from "@/components/general/SearchBar.vue";
export default {
  name: "orderDetails",
  components: {
    Search,
  },
  data(){
    return {
      Search: false,
      salesHistory: [
        {image: require("../../assets/images/laptop.png"), itemName: "Infinix Hot 10", date: "5 Jul 2020", time: "8:58AM", customers_name: "Tony Nwachukwu",  price: "5000.00"},
        {image: require("../../assets/images/laptop.png"), itemName: "Infinix Hot 10", date: "5 Jul 2020", time: "8:58AM", customers_name: "Tony Nwachukwu",  price: "5000.00"},
        {image: require("../../assets/images/laptop.png"), itemName: "Infinix Hot 10", date: "5 Jul 2020", time: "8:58AM", customers_name: "Tony Nwachukwu", price: "5000.00"},
        {image: require("../../assets/images/laptop.png"), itemName: "Infinix Hot 10", date: "5 Jul 2020", time: "8:58AM", customers_name: "Tony Nwachukwu", price: "5000.00"},
      ]
    }
  },
  methods: {
    toggleSearch(){
      this.Search = true
    },
    toggleOnLeave(){
      this.Search = false
    }
  }
};
</script>

<style lang="scss" scoped>
.chOder {
  color: #2b2b2b;
  font-size: 20px;
  margin: 30px 0 20px 0px;
  font-family: "Product Sans Medium";
}
.w-25 {
  width: 25% !important;
}
.mx-lg-md-17{
  @media (min-width: 1024px ) {
    width: 50%;
  }
}
</style>