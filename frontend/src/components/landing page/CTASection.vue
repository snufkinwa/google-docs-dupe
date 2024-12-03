<template>
  <!-- Final CTA -->
  <div class="cta">
    <img src="../../assets/DOCUVY.svg" />
    <h2 class="cta__title">Ready to get started?</h2>
    <SignInButton
      mode="modal"
      class="cta__button"
      force-redirect-url="/document"
    >
      Sign up now
    </SignInButton>
  </div>
</template>
<style lang="scss">
.cta {
  text-align: center;
  padding: 80px 24px;
  background: #f8f9fa;
  align-items: center;
  display: flex;
  justify-content: center;

  &__title {
    font-size: 2.5rem;
    color: #202124;
    margin-bottom: 32px;
    font-weight: 400;
  }

  &__button {
    @extend .hero__sign-in;
    padding: 16px 32px;
    font-size: 1.125rem;
  }
  .img {
    width: 56px;
    height: auto;
  }
}
</style>
