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
        <p class="answer mb-0 mt-4">
          {{ item.answer }}
        </p>
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
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "How does Kuuzza work?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question:
            "Do I need to purchase products before I can sell to my customers?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question:
            "Do I have to pay for a product before I can resell to my customers?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "When a customer pays for a product, who delivers it?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "Who pays the delivery fee associated with the product?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "Where do we deliver to?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question:
            "How long does it take to get paid after reselling a product?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "Is reselling from Kuuzza profitable?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "What profit margins can I expect?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "Can I sell everywhere?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "Can I refund items or get a refund?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question:
            "What are the fees associated with profit withdrawal on Kuuzza?",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
        {
          question: "How do I contact your support team",
          answer: "Yes, no subscription fees, no hidden charges.",
        },
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
        .answer{
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