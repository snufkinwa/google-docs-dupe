<template>
  <div class="hero">
    <navbar />

    <div class="hero__content">
      <div class="hero__left">
        <div class="hero__product">
          <img src="../assets/docs.png" alt="Docuvy" class="hero__icon" />
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
            <div class="divider"></div>
            <img
              src="../assets/icons/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            />
          </button>
        </div>
      </div>
      <div class="hero__right"></div>
    </div>

    <div class="hero__tabs">
      <button class="hero__tab">Create</button>
      <button class="hero__tab">Collaborate</button>
      <button class="hero__tab">FAQs</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import navbar from "~/components/landing page/navbar.vue";
</script>

<style lang="scss">
* {
  font-family: "Open Sans";
}
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
    width: 40px;
    height: 40px;
  }

  &__product-name {
    font-size: 1.125rem;
    color: #202124;
    font-weight: 500;
  }

  &__title {
    font-size: 3rem;
    line-height: 1.2;
    color: #202124;
    font-weight: 600;
    margin-bottom: 24px;
  }

  &__description {
    font-size: 1.125rem;
    line-height: 1.5;
    color: #5f6368;
    margin-bottom: 32px;
  }

  &__buttons {
    display: flex;
    gap: 16px;
  }

  &__sign-in {
    background: #1a73e8;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 0.975rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #1557b0;
    }
  }

  &__try-free {
    background: transparent;
    color: #1a73e8;
    border: 1px solid #dadce0;
    padding: 0px 6px 0px 18px;
    border-radius: 4px;
    font-size: 0.975rem;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    display: flex;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f8f9fa;
    }
  }

  .divider {
    width: 1px;
    height: 42px;
    background: #dadce0;
  }

  img {
    width: 18px;
    height: 18px;
  }

  &__preview {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  &__tabs {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 32px;
    justify-content: center;
    border: 1px solid #dadce0;
    border-radius: 40px;
  }

  &__tab {
    padding: 16px 8px;
    color: #5f6368;
    font-size: 0.875rem;
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;

    &--active {
      color: #1a73e8;
      font-weight: 500;

      &:after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background: #1a73e8;
        border-radius: 3px 3px 0 0;
      }
    }

    &:hover:not(&--active) {
      color: #202124;
    }
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #dadce0;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__logo {
    height: 32px;
  }

  &__brand {
    font-size: 1.25rem;
    color: #5f6368;
  }

  &__center {
    display: flex;
    gap: 24px;
  }

  &__link {
    color: #5f6368;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      color: #202124;
    }
  }

  &__right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__try-free {
    @extend .hero__try-free;
    padding: 0px 6px 0px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #dadce0;
    color: #5f6368;

    .divider {
      width: 1px;
      height: 42px;
      background: #dadce0;
    }

    img {
      width: 18px;
      height: 18px;
    }
  }

  &__sign-in {
    @extend .hero__sign-in;
    padding: 8px 16px;
  }
}
</style>
