<template>
  <div class="faq-container">
    <div class="text-center">
      <h1 class="mb-8 secondary-header">Frequently Asked Questions</h1>
    </div>

    <div class="faq-section">
      <div
        class="faq-item"
        v-for="(item, index) in faq"
        :key="index"
        :class="{ 'faq-item--active': activeTabNumber == index }"
        @click="toggleFaqItem(index)"
      >
        <p class="question mb-0">
          {{ item.question }}
          <v-icon style="font-size: 25px" class="primary--text"
            >mdi-chevron-down</v-icon
          >
        </p>
        <p class="answer mb-0 mt-4" v-html="item.answer"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Faq",
  data: function () {
    return {
      activeTabNumber: null,
      faq: [
        {
          question: "Is Kuuzza free?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "How can I become a seller on Kuuzza?",
          answer:
            "Simple visit <a>www.kuzza.com</a> and signup to become a seller.",
        },
        {
          question: "How does Kuuzza work?",
          answer: `Kuzza is a decentralised open inventory platform where anyone can sign up and become a seller
           for free. On the Kuuzza inventory you can select and download any product image, then market it 
           through any channel of choice( e.g whatsapp, Facebook and instagram). Once you have a customer who 
           wants to buy, simply bargain a price with the customer (ensure that you factor in your own profit). 
           Then head to the kuzza inventory, enter the bargained price of the product ,with your customers 
           shipping details . A payment link will be generated that you can share with your customer to make 
           payments. Once the customer makes payment, we ship the item to your customer.`,
        },
        {
          question:
            "Do I need to purchase products before I can sell to my customers?",
          answer: `Using Kuzza is free, you do not have to keep any physical stock and you do not have to buy 
          the product from us before selling it to your customers. simply sell to your customer directly from us 
          at Zero Naira.  We pay you your own profit when your customers makes payment.`,
        },
        {
          question: "When a customer pays for a product, who delivers it?",
          answer: `There is no need for hassle. Our logistic partners will deliver the product to your customer
           on your behalf, you should only focus on selling and making more money.`,
        },
        {
          question: "Who pays the delivery fee associated with the product?",
          answer: `Your customer will pay the delivery fee. This will be added to their product price while checking out.`,
        },
        {
          question: "Where do we deliver to?",
          answer: `For now, our logistics partners will only deliver to your customers within Lagos`,
        },
        {
          question: "How long does it take get paid after I sell a product?",
          answer: `We will pay you 24 hours after your customer has confirmed that they have received their order. 
          However, in the event that they do not confirm the receipt of the order, we will release the funds to you 
          after the returns window of that order has elapsed. This could be between 3- 14 days . It is advisable you 
          chat with your customers to confirm that they received the order  via the payment link shared with them, so 
          as to avoid delay in payment.`,
        },
        {
          question: "Is reselling from Kuuzza profitable?",
          answer:
            "You don't invest any money before you sell on Kuzza. We 100% guarantee profitability once you sell to your customer using Kuzza.",
        },
        {
          question: "What profit margins can I expect?",
          answer: `There is no limit to how much you can earn resselling on Kuzza. The quantity and value of 
          product you sell will determine your profitability`,
        },
        {
          question: "Can I sell everywhere?",
          answer: "You can only sell to your customer within Lagos for now.",
        },
        {
          question: "Can I refund items or get a refund?",
          answer: `This varies from product to product as every inventory owner on our platform has their own 
          return policy. Ensure you check this on the product detail page before you sell.`,
        },
        {
          question:
            "How much does it cost to ship an item to my customers and how long does it take ?",
          answer: `The delivery fee your customer pays will depend on the shipping method they choose while 
          checking out on Kuuzza.<br /><br/>
          
          <span class="primary--text">Express Shipping</span> : This fee varies with the location of your customer. The closer they are to our 
          partner inventory warehouse, the cheaper you pay. Your customer can pay as low as N500 and as high as 
          N2500. If your customer checks out with this shipping method we will deliver to them within 24hours and 
          this could be less. This could be the same day delivery if the order is placed before 2pm that day.
          <br /> <br />

          <span class="primary--text">Standard delivery</span> : This comes at a flat fee of N1200, however, this order will take about 2-3 days for 
          it to be delivered

`,
        },
        // {
        //   question: "How do I contact your support team",
        //   answer: "Yes, no subscription fees, no hidden charges.",
        // },
      ],
    };
  },
  methods: {
    toggleFaqItem(tabNumber) {
      tabNumber == this.activeTabNumber
        ? (this.activeTabNumber = null)
        : (this.activeTabNumber = tabNumber);
    },
  },
};
</script>
<style lang="scss" scoped>
.faq-container {
  padding: 50px 70px 10px 70px;
  background: var(--v-background-base);
  .faq-section {
    width: 800px;
    margin: 0px auto;
    .faq-item {
      background: white;
      padding: 20px 30px;
      box-shadow: 0px 2px 6px #4141411a;
      border-radius: 8px;
      width: 100%;
      margin-bottom: 10px;
      min-height: 65px;
      overflow-y: hidden;
      cursor: pointer;
      .question {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-size: 17px;
        .v-icon {
          transition: 0.5s ease;
        }
      }
      .answer {
        font-size: 14px;
        display: none;
      }
      &--active {
        .answer {
          display: block;
        }
        .question {
          .v-icon {
            transform: rotate(-180deg);
          }
        }
      }
    }
  }
}
@media (max-width: 959px) {
  .faq-container {
    .faq-section {
      width: 100%;
    }
    padding: 15px 20px;
    .secondary-header {
      font-size: 27px;
    }
  }
}
</style>