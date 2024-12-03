<template>
  <div class="hero">
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
              src="../../assets/icons/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            />
          </button>
        </div>
      </div>
      <div class="hero__right"></div>
    </div>
    <HeroTabs />
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/styles/shared";

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
    color: $color-text;
    font-weight: 500;
  }

  &__title {
    font-size: 3rem;
    line-height: 1.2;
    color: $color-text;
    font-weight: 600;
    margin-bottom: 24px;
  }

  &__description {
    font-size: 1.125rem;
    line-height: 1.5;
    color: $color-text-secondary;
    margin-bottom: 32px;
  }

  &__buttons {
    display: flex;
    gap: 16px;
  }

  &__sign-in {
    @include button-primary;
  }

  &__try-free {
    @include button-secondary;
    color: $color-primary;
  }
}
</style>
