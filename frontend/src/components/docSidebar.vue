<script setup>
import { ref, watch, onMounted } from "vue";
const menuItems = [
  {
    icon: "heroicons:document",
    name: "Documents",
    active: true,
  },
  {
    icon: "heroicons:table-cells",
    name: "Spreadsheets",
  },
  {
    icon: "heroicons:presentation-chart-line",
    name: "Presentations",
  },
  {
    icon: "heroicons:clipboard-document-check",
    name: "Forms",
  },
];
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <aside class="side-menu" v-show="isVisible">
    <nav>
      <a
        v-for="item in menuItems"
        :key="item.name"
        :class="['menu-item', { active: item.active }]"
        href="#"
      >
        <Icon :name="item.icon" />
        <span>{{ item.name }}</span>
      </a>

      <div class="divider"></div>

      <button class="menu-item">
        <Icon name="ic:baseline-settings" />
        <span>Settings</span>
      </button>

      <button class="menu-item">
        <Icon name="ic:sharp-help-outline" />
        <span>Help</span>
      </button>

      <a href="#" class="menu-item">
        <Icon name="ic:baseline-folder" />
        <span>Storage</span>
      </a>
    </nav>

    <footer>
      <a href="#">Terms</a>
      <span>·</span>
      <a href="#">Privacy</a>
    </footer>
  </aside>
</template>

<style lang="scss">
.side-menu {
  position: fixed;
  left: 0;
  top: 63px;
  width: 260px;
  height: calc(100vh - 67px);
  background: white;
  border-right: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;

  .brand {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;

    .logo {
      height: 24px;
    }

    span {
      font-size: 20px;
      color: #374151;
    }
  }

  nav {
    flex: 1;
    padding: 8px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-radius: 8px;
    width: 100%;
    text-align: left;
    text-decoration: none;
    color: #374151;

    &:hover {
      background: #f3f4f6;
    }

    span {
      font-size: 14px;
    }

    &.active {
      background: #eff6ff;
      color: #2563eb;

      span {
        color: #2563eb;
      }
    }
  }

  .divider {
    height: 1px;
    background: #e5e7eb;
    margin: 8px 0;
  }

  footer {
    padding: 16px;
    font-size: 12px;
    color: #6b7280;
    display: flex;
    gap: 8px;

    a {
      text-decoration: none;
      color: inherit;

      &:hover {
        color: #2563eb;
      }
    }
  }
}
</style>
