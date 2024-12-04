<template>
  <div class="hero__tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="hero__tab"
      :class="{ 'hero__tab--active': activeTab === tab.id }"
      @click="scrollToSection(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("create");

const tabs = [
  { id: "create", label: "Create" },
  { id: "collaborate", label: "Collaborate" },
  { id: "faqs", label: "FAQs" },
];

const emit = defineEmits(["tab-change"]);

const scrollToSection = (sectionId) => {
  activeTab.value = sectionId;
  emit("tab-change", sectionId);

  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<style lang="scss" scoped>
.hero__tabs {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 32px;
  justify-content: center;
  border: 1px solid #dadce0;
  border-radius: 40px;
}

.hero__tab {
  padding: 16px 8px;
  color: #5f6368;
  font-size: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

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
</style>
