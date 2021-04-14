<template>
  <v-container>
    <div class="mx-5">
      <div class="chOder" style="margin-top: 0px">
        <router-link :to="{ path: '/orders' }">
          <v-icon class="float-left">mdi-chevron-left</v-icon>
        </router-link>
        <h5 class="text-center">Order Details</h5>
      </div>

      <v-row>
        <v-col sm="4" md="12">
          <v-card outlined class="rounded-lg">
            <v-row>
              <v-col cols="5">
                <div class="text-center">
                  <v-img
                    :src="orderDetails.product_image_url"
                    class="mx-3 my-3 image-bgColor"
                    width="70%"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="7" class="pr-5 pl-1 my-lg-3 my-md-3">
                <div class="order-item-font mt-2">
                  Product Name:
                  <span class="order-no-grey">
                    {{ orderDetails.product_name }}
                  </span>
                </div>
                <div
                  class="order-item-font mt-1"
                  v-for="(variant, index) in orderDetails.variants"
                  :key="index"
                >
                  {{ variant.name }}:
                  <span class="order-no-grey">{{ variant.value }}</span>
                </div>
                <div class="order-item-font mt-1">
                  Time:
                  <span class="order-no-grey"
<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
                    >{{ date }}
                    <span class="order-no-lighter-grey">{{ time }}</span></span
=======
                    >{{ orderDetails.created_at.slice(0, -6) }}
                    <span class="order-no-lighter-grey">{{
                      orderDetails.created_at.slice(10)
                    }}</span></span
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
                  >
                </div>
                <div class="order-item-font mt-1">
                  Customer:
<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
                  <span class="order-no-grey">{{ customerName }}</span>
=======
                  <span class="order-no-grey">{{
                    orderDetails.customer_name
                  }}</span>
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
        <v-col sm="4" md="8" offset-md="2">
          <v-card outlined class="rounded-lg px-5">
            <div class="order-item-font my-2">Shipping and Billing Address</div>
            <div class="order-no-grey mb-3">
              {{ address }}<br />
=======
        <v-col sm="4" md="12">
          <v-card outlined class="rounded-lg px-5">
            <div class="order-item-font my-2">Shipping and Billing Address</div>
            <div class="order-no-grey mb-3">
              32 Oran Street, Wuse zone 1, Abuja<br />
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
              <span>900281</span><br />
              <span>Abuja</span><br />
              <span>Nigeria</span><br />
              <div class="mt-2">
                <span
                  ><v-icon size="10" color="primary" class="mr-2"
                    >mdi-phone-outline</v-icon
                  >{{ orderDetails.phone }}</span
                ><br />
                <span
                  ><v-icon size="10" color="primary" class="mr-2"
                    >mdi-email-outline</v-icon
                  >{{ orderDetails.email }}</span
                >
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col sm="4" md="12">
          <v-card outlined class="rounded-lg px-5">
            <div class="order-item-font my-2">
              Payment Status:
              <span class="order-no-blue ml-2">
                {{ orderDetails.payment_status_label }}</span
              >
            </div>

            <div class="order-no-grey my-2">
              Subtotal
              <div class="d-flex justify-space-between">
                <span class="order-no-lighter-grey">
                  {{ orderDetails.total_items }} {{ orderDetails.product_name }}
                </span>
                <div class="">NGN{{ orderDetails.subtotal_label }}</div>
              </div>
            </div>

            <div class="order-no-grey my-2">
              Shipping
              <div class="d-flex justify-space-between">
<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
                <span class="order-no-lighter-grey">
                  {{ orderDetails.delivery_method }}
                </span>
                <div class="">NGN{{ orderDetails.delivery_fee_label }}</div>
=======
                <span class="order-no-lighter-grey"> Standard Shipping </span>
                <div class="">NGN3,000.00</div>
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
              </div>
            </div>

            <div class="d-flex justify-space-between my-3">
              <span class="order-no-blue"> Total Paid</span>
<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
              <div class="order-no-grey">
                NGN{{ orderDetails.total_price_label }}
              </div>
=======
              <div class="order-no-grey">NGN3,000.00</div>
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
            </div>
          </v-card>
        </v-col>

        <v-col sm="4" md="12">
          <v-card outlined class="rounded-lg px-5">
            <div class="order-item-font my-2">
              Delivery Status:
              <span class="order-no-blue ml-2 mr-10">{{
                orderDetails.delivery_status_label
              }}</span>
            </div>

            <div class="d-flex mt-3 mb-8">
              <div class="order-no-grey">
                {{ orderDetails.delivery_location.address }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col sm="4" md="12">
          <v-card outlined class="rounded-lg px-5">
            <div class="order-item-font my-2">
              Point Earned:
              <span class="order-no-blue ml-2 mr-10">
                {{ orderDetails.total_points }}</span
              >
            </div>

            <div class="order-item-font my-2 mb-8">
              Commission:
              <span class="order-no-blue ml-2 mr-10">
                NGN{{ orderDetails.seller_profit }}</span
              >
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "orderDetails",
  data() {
    return {
      orderDetails: {},
    };
  },
  created() {
    this.$store
      .dispatch("orders/getOrdersDetail", { id: this.$route.params.id })
      .then((response) => {
<<<<<<< HEAD:src/views/authPages/orders/orderDetails.vue
        let data = response.data.data;
        this.orderDetails = data;
        this.date = data.created_at.slice(0, -6);
        this.time = data.created_at.slice(10);
        this.customerName = data.customer.name;
        this.address = data.delivery_location.address;
        this.phone = data.customer.phone;
        this.email = data.customer.email;
=======
        this.orderDetails = response.data.data;
      })
      .catch((e) => {
        console.log(e);
>>>>>>> ade9d3cccff46f2645dae3ce5549a0bbae573ac3:src/views/orders/orderDetails.vue
      });
  },
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
</style>