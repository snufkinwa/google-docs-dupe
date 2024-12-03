<template>
  <footer class="footer">
    <div class="footer__content">
      <div
        v-for="section in sections"
        :key="section.title"
        class="footer__section"
      >
        <h3>{{ section.title }}</h3>
        <a v-for="link in section.links" :key="link.text" :href="link.url">{{
          link.text
        }}</a>
      </div>
    </div>
    <div class="footer__social">
      <a
        v-for="social in socials"
        :key="social.name"
        :href="social.url"
        class="footer__social-link"
        :aria-label="social.name"
      >
        <Icon :name="social.icon" class="footer__social-icon" />
      </a>
    </div>
    <div class="footer__bottom">
      <p>&copy; {{ new Date().getFullYear() }} Docuvy. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const sections = [
  {
    title: "Product",
    links: [
      { text: "Features", url: "#" },
      { text: "Security", url: "#" },
      { text: "Enterprise", url: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Documentation", url: "#" },
      { text: "API", url: "#" },
      { text: "Guides", url: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", url: "#" },
      { text: "Blog", url: "#" },
      { text: "Careers", url: "#" },
    ],
  },
];

const socials = [
  { name: "X/Twitter", icon: "heroicons:x-mark", url: "#" },
  { name: "YouTube", icon: "heroicons:play", url: "#" },
  { name: "LinkedIn", icon: "heroicons:linkedin", url: "#" },
  { name: "Instagram", icon: "heroicons:camera", url: "#" },
  { name: "Facebook", icon: "heroicons:facebook", url: "#" },
  { name: "TikTok", icon: "heroicons:musical-note", url: "#" },
];
</script>

<style lang="scss" scoped>
@import "../assets/styles/shared";

.footer {
  background: #fff;
  border-top: 1px solid $color-border;
  padding: 48px 24px 24px;

  &__content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 48px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
      font-size: 1rem;
      color: $color-text;
      font-weight: 500;
      margin-bottom: 8px;
    }

    a {
      color: $color-text-secondary;
      text-decoration: none;
      font-size: 0.875rem;

      &:hover {
        color: $color-text;
      }
    }
  }

  &__social {
    max-width: 1200px;
    margin: 48px auto 0;
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  &__social-link {
    color: $color-text-secondary;
    transition: color 0.2s;

    &:hover {
      color: $color-text;
    }
  }

  &__social-icon {
    width: 24px;
    height: 24px;
  }

  &__bottom {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid $color-border;
    text-align: center;
    color: $color-text-secondary;
    font-size: 0.875rem;
  }
}
</style>
