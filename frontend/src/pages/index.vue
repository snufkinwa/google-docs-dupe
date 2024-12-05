<template>
  <div class="main-wrapper">
    <div class="nav-bar">
      <navbar />
    </div>
    <HeroSection />
    <CTASection />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import HeroSection from "~/components/landing page/heroSection.vue";
import navbar from "~/components/landing page/navbar.vue";
import Footer from "~/components/landing page/footer.vue";
import CTASection from "~/components/landing page/CTASection.vue";
</script>

<style lang="scss">
* {
  font-family: "Noto Sans";
}

.main-wrapper {
  min-height: 100vh;
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
