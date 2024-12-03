<template>
  <div id="faqs" class="faq">
    <h2 class="faq__title">Curious about Docuvy?</h2>
    <div class="faq__list">
      <details
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq__item"
        :open="openIndex === index"
        @toggle="toggleFAQ(index)"
      >
        <summary>{{ faq.question }}</summary>
        <p v-html="faq.answer"></p>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const openIndex = ref(null);

const toggleFAQ = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqs = [
  {
    question: "How was this site built?",
    answer:
      "This site was built using Nuxt 3, featuring modern web technologies including Vue.js and SCSS for styling. It implements Clerk for authentication and uses a Rust backend for data management.",
  },
  {
    question: "What technologies are used?",
    answer:
      "Frontend: Nuxt 3, Vue.js, SCSS<br>Backend: Rust<br>Authentication: Clerk<br>Database: MongoDB",
  },
  {
    question: "Is this open source?",
    answer:
      "Yes, this project is open source and available on GitHub. You can contribute to its development or use it as a reference for your own projects.",
  },
];
</script>

<style lang="scss" scoped>
@import "../assets/styles/shared";

.faq {
  padding: 80px 24px;
  max-width: 800px;
  margin: 0 auto;

  &__title {
    font-size: 2.5rem;
    color: $color-text;
    text-align: center;
    margin-bottom: 48px;
    font-weight: 400;
  }

  &__list {
    display: grid;
    gap: 16px;
  }

  &__item {
    border: 1px solid $color-border;
    border-radius: 8px;
    overflow: hidden;

    summary {
      padding: 24px;
      cursor: pointer;
      font-weight: 500;
      color: $color-text;
      position: relative;
      list-style: none;

      &::-webkit-details-marker {
        display: none;
      }

      &:after {
        content: "+";
        position: absolute;
        right: 24px;
        transition: transform 0.2s;
      }
    }

    &[open] summary:after {
      content: "-";
    }

    p {
      padding: 0 24px 24px;
      color: $color-text-secondary;
      line-height: 1.5;
    }
  }
}
</style>
