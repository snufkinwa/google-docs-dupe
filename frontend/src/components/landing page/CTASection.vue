<template>
  <div class="cta-wrapper">
    <div class="cta">
      <div class="cta__container">
        <!-- Google Docs-style Icon -->
        <div class="cta__icon">
          <img src="../../assets/DOCUVY.svg" alt="Docuvy Icon" />
        </div>

        <!-- Main CTA Content -->
        <div class="cta__content">
          <h2 class="cta__title">
            Create, collaborate, and refine<br />
            your content with Docuvy
          </h2>

          <div class="cta__actions">
            <SignInButton
              mode="modal"
              class="cta__sign-in"
              force-redirect-url="/document"
            >
              Sign in
            </SignInButton>

            <button class="cta__try-button">
              Try Docs for work
              <div class="divider"></div>
              <img
                src="../../assets/icons/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/_shared" as shared;

.cta-wrapper {
  padding: 64px 24px;
  background: white;
}

.cta {
  background: #f8f9fa;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;

  &__container {
    max-width: 650px;
    margin: 0 auto;
    text-align: center;
  }

  &__icon {
    margin-bottom: 24px;

    img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }

  &__title {
    font-size: 2.25rem;
    line-height: 1.3;
    color: #202124;
    font-weight: 400;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 360px;
  }

  &__sign-in {
    @include shared.button-primary;
    width: 54%;
    justify-content: center;
    padding: 12px 24px;
    font-size: 1rem;
  }

  &__try-button {
    @include shared.button-secondary;
    color: shared.$color-primary;
    font-weight: 500;

    .divider {
      width: 1px;
      height: 50px;
      background-color: shared.$color-border;
    }
  }

  &__dropdown-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
