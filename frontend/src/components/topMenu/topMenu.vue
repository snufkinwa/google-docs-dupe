<template>
  <div class="top-menu">
    <div class="title-section">
      <img src="/images/DOCUVY.svg" alt="Logo" class="logo" />
      <div class="title-menu">
        <input v-model="documentTitle" class="document-title" type="text" />
        <div class="menu-bar">
          <button v-for="item in menuItems" :key="item">{{ item }}</button>
        </div>
      </div>
    </div>
    <div class="right-section">
      <button class="request-access">Request edit access</button>
      <Icon name="material-symbols:comment-outline" size="24" />
      <button class="share-button">
        <Icon name="material-symbols:public" size="16" class="icon" />
        Share
        <span class="divider"></span>
        <Icon name="material-symbols:arrow-drop-down" size="16" class="icon" />
      </button>
      <SignedOut>
        <SignInButton v-slot="props" as-child>
          <button v-bind="props" class="sign-in">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const documentTitle = ref("Untitled document");
const menuItems = ["File", "Edit", "View", "Insert", "Format", "Tools", "Help"];
</script>

<style lang="scss" scoped>
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 8px;
  height: 68px;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 4px;
  }
}

.title-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .document-title {
    font-size: 18px;
    border: none;
    background-color: #fbfbfb;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 2px;
    outline: none;

    &:hover,
    &:focus {
      background-color: #f1f3f4;
      border: 1px #001d35 solid;
    }
  }
}

.menu-bar {
  display: flex;
  gap: 4px;

  button {
    padding: 4px 8px;
    border: none;
    background: none;
    font-size: 14px;
    color: #5f6368;
    border-radius: 4px;

    &:hover {
      background-color: #f1f3f4;
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding-right: 8px;
}

.request-access {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f8f9fa;
  color: #1a73e8;
  border: 1px solid #dadce0;
  border-radius: 100px;
  padding: 8px 24px;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 36px;

  &:hover {
    background-color: #f1f3f4;
  }
}

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #c2e7ff;
  color: #001d35;
  border: none;
  padding: 0 14px;
  border-radius: 20px;
  font-weight: 500;
  height: 36px;

  .icon {
    display: flex;
    color: #001d35;
  }

  .divider {
    width: 1px;
    height: 35px;
    background-color: white;
    margin: 0 6px;
  }

  &:hover {
    background-color: #b3d7ee;
  }

  &:active {
    background-color: #a5c8e0;
  }
}

.sign-in {
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  text-align: inherit;
  font: inherit;
  border-radius: 0;
  appearance: none;
}
</style>
