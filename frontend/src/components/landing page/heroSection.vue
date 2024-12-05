<template>
  <div class="hero">
    <div class="hero__content">
      <div class="hero__left">
        <div class="hero__product">
          <img src="/images/DOCUVY.svg" alt="Docuvy" class="hero__icon" />
          <h2 class="hero__product-name">Docuvy</h2>
        </div>
        <h1 class="hero__title">Online, collaborative documents</h1>
        <p class="hero__description">
          AI-powered documents to help you and your team create and collaborate
          on content.
        </p>
        <div class="hero__buttons">
          <SignInButton
            mode="modal"
            class="hero__sign-in"
            force-redirect-url="/document"
          />
          <button class="hero__try-free">
            Try Docs for work
            <span class="divider"></span>
            <img
              src="../../assets/icons/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            />
          </button>
        </div>
      </div>
      <div class="hero__right">
        <img src="/images/HeroSection_Right.png" class="image-right" />
      </div>
    </div>
    <HeroTabs @tab-change="handleTabChange" class="hero__tabs" />

    <div class="hero__sections">
      <section
        v-for="section in sections"
        :key="section.id"
        :id="section.id"
        class="hero__section"
      >
        <component :is="section.component" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HeroTabs from "./heroTabs.vue";
import createSection from "./sections/createSection.vue";
import collaborateSection from "./sections/collaborateSection.vue";
import FAQSection from "./sections/FAQSection.vue";

const currentSection = ref("create");

const sections = [
  { id: "create", component: createSection },
  { id: "collaborate", component: collaborateSection },
  { id: "faqs", component: FAQSection },
];

const handleTabChange = (sectionId) => {
  currentSection.value = sectionId;
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/_shared" as shared;

.hero {
  min-height: 100vh;
  background-color: #fff;

  &__content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }

  &__left {
    padding-right: 48px;
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__icon {
    width: 50px;
    height: 50px;
  }

  &__product-name {
    font-size: 1.125rem;
    color: shared.$color-text;
    font-weight: 500;
  }

  &__title {
    font-size: 3rem;
    line-height: 1.2;
    color: shared.$color-text;
    font-weight: 600;
    margin-bottom: 24px;
  }

  &__description {
    font-size: 1.125rem;
    line-height: 1.5;
    color: shared.$color-text-secondary;
    margin-bottom: 32px;
  }

  &__buttons {
    display: flex;
    gap: 16px;
  }

  &__sign-in {
    @include shared.button-primary;
  }

  &__try-free {
    @include shared.button-secondary;
    color: shared.$color-primary;
    font-weight: 500;
  }

  .image-right {
    width: 500px;
    height: auto;
  }

  &__tabs {
    position: sticky;
    top: 5em;
    z-index: 10;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.06);
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
  }

  &__sections {
    margin-top: 48px;
  }

  &__section {
    min-height: 500px;
    scroll-margin-top: 100px;
  }
}
</style>
