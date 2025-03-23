<!-- src/views/UnauthorizedView.vue -->
<template>
    <div class="unauthorized-view">
      <h1>No autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'UnauthorizedView',
  });
  </script>
  
  <style scoped>
  .unauthorized-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
  
  h1 {
    font-size: 2rem;
    color: #ff4444;
  }
  
  p {
    font-size: 1.2rem;
    margin: 1rem 0;
  }
  
  a {
    color: #42b983;
    text-decoration: none;
    font-weight: bold;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>