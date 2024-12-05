<template>
  <div class="hero">
    <navbar />
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
</style>
