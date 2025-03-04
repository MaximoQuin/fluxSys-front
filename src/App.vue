<script setup lang="ts">
import AppTopbar from './layout/AppTopbar.vue'
import AppSidebar from './layout/AppSidebar.vue'
import { RouterView } from 'vue-router'
import AppFooter from './layout/AppFooter.vue'

import { ref } from 'vue'

const isSidebarActive = ref(true);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};
</script>

<template>
  <div>
    <div class="flex w-full">
      <div class="w-fit">
        <AppSidebar :isSidebarActive="isSidebarActive"></AppSidebar>
      </div>
      <div class="w-full">
        <AppTopbar @toggle-sidebar="toggleSidebar"></AppTopbar>
        <RouterView />
        <AppFooter></AppFooter>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
