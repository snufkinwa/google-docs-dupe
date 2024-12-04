<script setup>
import { ref } from "vue";

const activeFeature = ref(0);
const features = ref([
  {
    id: 0,
    title: "Get a jumpstart on your document with smart canvas",
    description:
      "Instantly build formatted emails, calendar invites, review trackers, meeting notes, and more in Docuvy when you type '@.'",
    image: "/images/smart-canvas.jpg",
  },
  {
    id: 1,
    title: "Easily populate your document with rich details",
    description:
      "Add smart chips, tables, and formatting with simple keyboard shortcuts.",
    image: "/images/rich-details.jpg",
  },
  {
    id: 2,
    title: "Remove page breaks and write without limits",
    description:
      "Focus on your content without worrying about page formatting.",
    image: "/images/no-breaks.jpg",
  },
  {
    id: 3,
    title: "Stay organized with document tabs",
    description: "Keep your work organized and easily accessible.",
    image: "/images/document-tabs.jpg",
  },
]);

const setActiveFeature = (index) => {
  activeFeature.value = index;
};
</script>

<template>
  <section class="create-section">
    <div class="container">
      <div class="header">
        <h1>Create better documents faster</h1>
        <p>
          Transform your ideas into professional-looking content with
          ready-to-use templates and tools.
        </p>
      </div>

      <div class="content">
        <!-- Left side - Feature Navigation -->
        <div class="feature-nav">
          <div
            v-for="(feature, index) in features"
            :key="feature.id"
            @click="setActiveFeature(index)"
            class="nav-item"
            :class="{ active: activeFeature === index }"
          >
            <h3>{{ feature.title }}</h3>
            <p v-show="activeFeature === index">
              {{ feature.description }}
            </p>
          </div>
        </div>

        <!-- Right side - Feature Images -->
        <div class="feature-images">
          <TransitionGroup name="fade">
            <div
              v-for="feature in features"
              :key="feature.id"
              v-show="activeFeature === feature.id"
              class="image-container"
            >
              <div class="image-placeholder"></div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.create-section {
  background-color: white;
  padding: 4rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    text-align: center;
    margin-bottom: 4rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.125rem;
      color: #666;
      max-width: 800px;
      margin: 0 auto;
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .feature-nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;

    .nav-item {
      padding: 1.5rem 1.5rem 1.5rem 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      border-left: 4px solid transparent;

      &::before {
        content: "";
        position: absolute;
        left: -4px;
        top: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(to bottom, #4285f4, #34a853);
        transform: scaleY(0);
        transition: transform 0.3s ease;
        transform-origin: top;
      }

      &.active {
        background-color: transparent;

        &::before {
          transform: scaleY(1);
        }

        p {
          display: block;
        }
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #202124;
      }

      p {
        color: #5f6368;
        display: none;
      }

      &:hover:not(.active) {
        background-color: transparent;
        h3 {
          color: #1a73e8;
        }
      }
    }
  }

  .feature-images {
    position: relative;
    height: 500px;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    order: 2; // Ensures images stay on the right

    .image-container {
      position: absolute;
      inset: 0;
      padding: 1.5rem;

      .image-placeholder {
        width: 100%;
        height: 100%;
        background-color: #e5e5e5;
        border-radius: 4px;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
