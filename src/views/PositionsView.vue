<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePositionsStore } from "@/stores/positionsStore";

const positionsStore = usePositionsStore();
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    await positionsStore.fetchPositions();
  } catch (err) {
    error.value = "Error cargando las posiciones.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">📌 Posiciones</h1>

    <!-- Mensaje de carga -->
    <p v-if="loading" class="text-gray-600 text-center">Cargando posiciones...</p>

    <!-- Mensaje de error -->
    <p v-if="error" class="text-red-500 text-center font-semibold">{{ error }}</p>

    <!-- Contenedor de Cards -->
    <div v-if="!loading && !error && positionsStore.positions.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="position in positionsStore.positions"
        :key="position.id_position"
        class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
      >
        <h2 class="text-xl font-semibold text-gray-800">{{ position.name_position }}</h2>
        <p class="text-gray-600">🏢 {{ position.name_company }}</p>

        <div class="mt-4">
          <span
            :class="{
              'bg-green-100 text-green-700 border-green-500': !position.delete_log_position,
              'bg-red-100 text-red-700 border-red-500': position.delete_log_position
            }"
            class="px-3 py-1 border rounded-full text-sm font-semibold"
          >
            {{ position.delete_log_position ? "Inactivo" : "Activo" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <p v-if="!loading && !error && positionsStore.positions.length === 0" class="text-gray-600 text-center mt-4">
      No hay posiciones disponibles.
    </p>
  </div>
</template>
