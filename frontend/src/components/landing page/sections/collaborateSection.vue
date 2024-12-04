<script setup>
import { ref } from "vue";

const activeFeature = ref(0);
const features = ref([
  {
    id: 0,
    title: "Meet directly in your documents",
    description: "Collaborate in context by meeting in Docuvy",
    image: "/images/meet-preview.jpg",
    isPremium: true,
  },
  {
    id: 1,
    title: "Control access to your documents",
    description: "Manage who can view and edit your documents.",
    image: "/images/access-control.jpg",
  },
  {
    id: 2,
    title: "Collaborate with your partners and make decisions",
    description: "Work together in real-time with your team.",
    image: "/images/collaboration.jpg",
  },
  {
    id: 3,
    title: "Review changes with flexibility",
    description: "Track and review all document changes.",
    image: "/images/review-changes.jpg",
  },
]);

const setActiveFeature = (index) => {
  activeFeature.value = index;
};
</script>

<template>
  <section class="collaborate-section">
    <div class="container">
      <div class="header">
        <h1>Seamlessly shape ideas together, no matter where you are</h1>
        <p>
          Keep everyone aligned with edits and comments across all your devices.
        </p>
      </div>

      <div class="content">
        <!-- Left side - Feature Images -->
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

        <!-- Right side - Feature Navigation -->
        <div class="feature-nav">
          <div
            v-for="(feature, index) in features"
            :key="feature.id"
            @click="setActiveFeature(index)"
            class="nav-item"
            :class="{ active: activeFeature === index }"
          >
            <div class="title-wrapper">
              <h3>{{ feature.title }}</h3>
              <span v-if="feature.isPremium" class="premium-badge">
                Premium feature
              </span>
            </div>
            <p v-show="activeFeature === index">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.collaborate-section {
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 2.5rem;
      font-weight: 500;
      width: 700px;
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

  .feature-images {
    position: relative;
    height: 500px;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;

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

      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;

        h3 {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .premium-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background-color: #e8f0fe;
          color: #1a73e8;
          border-radius: 999px;
          font-weight: 500;
        }
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
