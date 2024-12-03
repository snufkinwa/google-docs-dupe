<template>
  <nav class="nav">
    <div class="nav__left">
      <span class="nav__brand">Docuvy Workspace</span>
    </div>
    <div class="nav__center">
      <a href="#" class="nav__link" v-for="link in links" :key="link">{{
        link
      }}</a>
    </div>
    <div class="nav__right">
      <button class="nav__try-free">
        Try Docs for work
        <div class="divider"></div>
        <img
          src="../../assets/icons/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
        />
      </button>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode="modal"
          class="nav__sign-in"
          force-redirect-url="/document"
        />
      </SignedOut>
    </div>
  </nav>
</template>

<script setup>
const links = ["Solutions", "Products", "AI", "Pricing"];
</script>

<style lang="scss" scoped>
@import "../assets/styles/shared";

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid $color-border;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__brand {
    font-size: 1.2rem;
    color: $color-text-secondary;
  }

  &__center {
    display: flex;
    gap: 24px;
  }

  &__link {
    color: $color-text-secondary;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      color: $color-text;
    }
  }

  &__right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__try-free {
    @include button-secondary;
    color: $color-text-secondary;
  }

  &__sign-in {
    @include button-primary;
    padding: 8px 16px;
  }
}
</style>
