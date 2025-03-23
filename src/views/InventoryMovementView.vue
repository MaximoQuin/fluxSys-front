<!-- src/views/InventoryMovementView.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Movimientos de Inventario</h1>

    <!-- Tabla de movimientos de inventario -->
    <table class="min-w-full bg-black">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Cantidad Modificada</th>
          <th class="py-2 px-4 border-b">Producto</th>
          <th class="py-2 px-4 border-b">Categoría</th>
          <th class="py-2 px-4 border-b">Departamento</th>
          <th class="py-2 px-4 border-b">Proveedor</th>
          <th class="py-2 px-4 border-b">Tipo de Movimiento</th>
          <th class="py-2 px-4 border-b">Módulo</th>
          <th class="py-2 px-4 border-b">Empresa</th>
          <th class="py-2 px-4 border-b">Usuario</th>
          <th class="py-2 px-4 border-b">Fecha de Inserción</th>
          <th class="py-2 px-4 border-b">Fecha de Actualización</th>
          <th class="py-2 px-4 border-b">Fecha de Eliminación</th>
          <th class="py-2 px-4 border-b">Fecha de Restauración</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="movement in inventoryMovements"
          :key="movement.id_inventory_movement"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">{{ movement.id_inventory_movement }}</td>
          <td class="py-2 px-4 border-b">{{ movement.amount_modify }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_product }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_category_product }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_department }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_supplier }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_movement_type }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_module }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_company }}</td>
          <td class="py-2 px-4 border-b">{{ movement.name_user }}</td>
          <td class="py-2 px-4 border-b">{{ movement.date_insert }}</td>
          <td class="py-2 px-4 border-b">{{ movement.date_update }}</td>
          <td class="py-2 px-4 border-b">{{ movement.date_delete }}</td>
          <td class="py-2 px-4 border-b">{{ movement.date_restore }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <div v-if="loading" class="mt-4">
      Cargando...
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useInventoryMovementStore } from '@/stores/inventoryMovementStore';

const inventoryMovementStore = useInventoryMovementStore();
const { inventoryMovements, loading, fetchInventoryMovements } = inventoryMovementStore;

onMounted(() => {
  fetchInventoryMovements();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>