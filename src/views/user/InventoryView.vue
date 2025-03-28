<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Inventario</h1>

   <!-- Filtros y botones de exportación -->
   <div class="mb-4 flex items-center gap-2">
      <!-- Contenedor de filtros -->
      <div class="flex">
        <button 
          @click="showActiveInventories"
          :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200 text-gray-800': !showActive }"
          class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transition-colors"
        >
          Activos
        </button>
        <button 
          @click="showDeletedInventories"
          :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200 text-gray-800': showActive }"
          class="px-4 py-2 rounded-r shadow-md hover:bg-red-600 hover:text-white active:bg-red-800 transition-colors"
        >
          Eliminados
        </button>
      </div>
      
      <!-- Botones de exportación -->
      <div class="flex gap-2">
        <!-- Botón para generar PDF -->
        <button 
          @click="generatePDF"
          class="px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <i class="pi pi-file-pdf"></i>
          Exportar a PDF
        </button>
        
        <!-- Botón para generar Excel -->
        <button 
          @click="exportToExcel"
          class="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i class="pi pi-file-excel"></i>
          Exportar a Excel
        </button>
      </div>
    </div>

    <!-- Tabla de inventario -->
    <TableComponent class="h-118" :loader="inventoryStore.loading" :columns="mappedColumns" :data="filteredInventories"
      id="id_inventory_product" :flagRestore="showActive" :currentUserId="0" @actionSee="handleSee"
      @actionCreate="handleCreate" @actionUpdate="handleUpdate" @actionDanger="handleRemove"
      @actionRestore="restoreDeletedInventory" />

    <!-- Modal de detalles mejorado -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Producto" :style="{ width: '60rem' }">
      <div v-if="currentProduct" class="flex flex-col gap-6">
        <!-- Tarjeta de Información Básica -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-box" style="font-size: 1.5rem"></i>
              <span>Información Básica</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold">{{ currentProduct.name_product }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Stock</span>
                <span class="font-semibold">
                  {{ currentProduct.stock_product }}
                  <span class="text-sm text-gray-500 ml-1">unidades</span>
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Precio</span>
                <span class="font-semibold">
                  ${{ currentProduct.price_product?.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Categoría</span>
                <span class="font-semibold">{{ currentProduct.name_category_product }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag :value="currentProduct.name_state"
                  :severity="currentProduct.name_state === 'Activo' ? 'success' : 'warning'" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Tipo Movimiento</span>
                <span class="font-semibold">{{ currentProduct.name_movement_type }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Tarjeta de Relaciones -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-link" style="font-size: 1.5rem"></i>
              <span>Relaciones</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Proveedor Principal</span>
                <span class="font-semibold">{{ currentProduct.name_supplier }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Departamento del Producto</span>
                <span class="font-semibold">{{ currentProduct.name_department }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Acordeón de Información Adicional -->
        <Accordion>
          <AccordionTab>
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-truck" style="font-size: 1rem"></i>
                <span>Proveedores asociados ({{ currentProduct.suppliers?.length || 0 }})</span>
              </div>
            </template>
            <DataTable :value="currentProduct.suppliers" :rows="5" paginator>
              <Column field="name_supplier" header="Nombre"></Column>
            </DataTable>
          </AccordionTab>

          <AccordionTab>
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-file" style="font-size: 1rem"></i>
                <span>Facturas asociadas ({{ currentProduct.invoices?.length || 0 }})</span>
              </div>
            </template>
            <DataTable :value="currentProduct.invoices" :rows="5" paginator>
              <Column field="name_invoice" header="Referencia"></Column>
            </DataTable>
          </AccordionTab>

          <AccordionTab>
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-shopping-cart" style="font-size: 1rem"></i>
                <span>Órdenes de compra ({{ currentProduct.purchaseOrders?.length || 0 }})</span>
              </div>
            </template>
            <DataTable :value="currentProduct.purchaseOrders" :rows="5" paginator>
              <Column field="name_purchase_order" header="Referencia"></Column>
            </DataTable>
          </AccordionTab>
        </Accordion>
      </div>
    </Dialog>

    <!-- Modal de editar/crear con validaciones -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Producto' : 'Crear Producto'"
      :style="{ width: '50rem' }">
      <div class="grid grid-cols-2 gap-4">
        <!-- Nombre del Producto -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold">Nombre del producto:*</label>
          <InputText v-model="formProduct.name_product" id="name" autocomplete="off"
            :class="{ 'p-invalid': nameError }" />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
        </div>

        <!-- Stock -->
        <div class="flex flex-col gap-2">
          <label for="stock" class="font-semibold">Stock:*</label>
          <InputNumber v-model="formProduct.stock_product" id="stock" mode="decimal" :min="0" :max="2147483647"
            :class="{ 'p-invalid': stockError }" />
          <small v-if="stockError" class="p-error">
            {{ stockError }}
          </small>
        </div>

        <!-- Precio -->
        <div class="flex flex-col gap-2">
          <label for="price" class="font-semibold">Precio:*</label>
          <InputNumber v-model="formProduct.price_product" id="price" mode="currency" currency="USD" locale="en-US"
            :min="0.01" :class="{ 'p-invalid': priceError }" />
          <small v-if="priceError" class="p-error">
            {{ priceError }}
          </small>
        </div>

        <!-- Categorias de productos -->
        <div class="flex flex-col gap-2">
          <label for="category" class="font-semibold">Categoría:*</label>
          <Dropdown 
            v-model="formProduct.id_category_product_Id" 
            :options="activeCategories" 
            optionLabel="name_category_product" 
            optionValue="id_category_product"
            placeholder="Seleccione una categoría"
            :class="{ 'p-invalid': categoryError }"
            v-if="hasActiveCategories"
          />
          <div v-else class="p-4 border rounded">
            <p class=" mb-2">
              No hay categorías activas
            </p>
            <Button 
              label="Crear Categoría" 
              severity="primary" 
              outlined
              @click="redirectToCategories"
              class="w-full"
            />
          </div>
          <small v-if="categoryError" class="p-error">
            {{ categoryError }}
          </small>
        </div>

        <!-- Estados -->
        <div class="flex flex-col gap-2">
          <label for="state" class="font-semibold">Estado:*</label>
          <Dropdown 
            v-model="formProduct.id_state_Id" 
            :options="activeStates" 
            optionLabel="name_state" 
            optionValue="id_state"
            placeholder="Seleccione un estado"
            :class="{ 'p-invalid': stateError }"
            v-if="hasActiveStates"
          />
          <div v-else class="p-4 border rounded">
            <p class=" mb-2">
              No hay estados activos
            </p>
            <Button 
              label="Crear Estado" 
              severity="primary" 
              outlined
              @click="redirectToStates"
              class="w-full"
            />
          </div>
          <small v-if="stateError" class="p-error">
            {{ stateError }}
          </small>
        </div>

        <!-- Tipo de Movimiento -->
        <div class="flex flex-col gap-2">
          <label for="movement" class="font-semibold">Tipo de Movimiento:*</label>
          <Dropdown 
            v-model="formProduct.id_movement_type_Id" 
            :options="activeMovementTypes" 
            optionLabel="name_movement_type" 
            optionValue="id_movement_type"
            placeholder="Seleccione un tipo"
            :class="{ 'p-invalid': movementError }"
            v-if="hasActiveMovementTypes"
          />
          <div v-else class="p-4 border  rounded">
            <p class=" mb-2">
              No hay tipos de movimiento activos
            </p>
            <Button 
              label="Crear Tipo de Movimiento" 
              severity="primary" 
              outlined
              @click="redirectToMovementTypes"
              class="w-full"
            />
          </div>
          <small v-if="movementError" class="p-error">
            {{ movementError }}
          </small>
        </div>

        <!-- Proveedor -->
        <div class="flex flex-col gap-2">
          <label for="supplier" class="font-semibold">Proveedor Principal:*</label>
          <Dropdown 
            v-model="formProduct.id_supplier_Id" 
            :options="activeSuppliers" 
            optionLabel="name_supplier" 
            optionValue="id_supplier"
            placeholder="Seleccione un proveedor"
            :class="{ 'p-invalid': supplierError }"
            v-if="hasActiveSuppliers"
          />
          <div v-else class="p-4 border  rounded">
            <p class=" mb-2">
              No hay proveedores activos
            </p>
            <Button 
              label="Crear Proveedor" 
              severity="primary" 
              outlined
              @click="redirectToSuppliers"
              class="w-full"
            />
          </div>
          <small v-if="supplierError" class="p-error">
            {{ supplierError }}
          </small>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancelar" severity="danger" @click="visibleForm = false"></Button>
        <Button type="button" label="Guardar" severity="info" :disabled="!isFormValid"
          @click="isEdit ? updateProduct() : createProduct()"></Button>
      </div>
    </Dialog>

    <!-- Modal de confirmación para borrar -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useCategoryProductStore } from '@/stores/categoryProductStore';
import { useStateStore } from '@/stores/stateStore';
import { useMovementTypeStore } from '@/stores/movementTypeStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { useAuthStore } from '@/stores/authStore';
import TableComponent from '@/components/TableComponent.vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import router from '@/router';

const confirm = useConfirm();
const toast = useToast();

// Stores
const inventoryStore = useInventoryStore();
const categoryProductStore = useCategoryProductStore();
const stateStore = useStateStore();
const movementTypeStore = useMovementTypeStore();
const supplierStore = useSupplierStore();
const authStore = useAuthStore();

// Métodos de redirección
const redirectToCategories = () => {
  visibleForm.value = false;
  router.push('/ca-products-u');
};

const redirectToStates = () => {
  visibleForm.value = false;
  router.push('/states-u');
};

const redirectToMovementTypes = () => {
  visibleForm.value = false;
  router.push('/movements-types-u');
};

const redirectToSuppliers = () => {
  visibleForm.value = false;
  router.push('/suppliers-u');
};

// Computed properties para elementos activos
const activeCategories = computed(() => {
  return categoryProductStore.categoriesProducts.filter(cat => !cat.delete_log_category_product);
});

const activeStates = computed(() => {
  return stateStore.states.filter(state => !state.delete_log_state);
});

const activeMovementTypes = computed(() => {
  return movementTypeStore.movementsTypes.filter(mt => !mt.delete_log_movement_type);
});

const activeSuppliers = computed(() => {
  return supplierStore.suppliers.filter(supplier => !supplier.delete_log_suppliers);
});

// Computed properties para verificar si hay activos
const hasActiveCategories = computed(() => {
  return categoryProductStore.categoriesProducts.some(cat => !cat.delete_log_category_product);
});

const hasActiveStates = computed(() => {
  return stateStore.states.some(state => !state.delete_log_state);
});

const hasActiveMovementTypes = computed(() => {
  return movementTypeStore.movementsTypes.some(mt => !mt.delete_log_movement_type);
});

const hasActiveSuppliers = computed(() => {
  return supplierStore.suppliers.some(supplier => !supplier.delete_log_suppliers);
});

// Estados
const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const currentProduct = ref<any>(null);
const editingId = ref<number | null>(null);

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_product', header: 'Nombre' },
  { field: 'stock_product', header: 'Stock' },
  { field: 'price_product', header: 'Precio' },
  { field: 'name_category_product', header: 'Categoría' },
  { field: 'name_state', header: 'Estado' },
  { field: 'name_movement_type', header: 'Tipo Movimiento' },
  { field: 'name_supplier', header: 'Proveedor Principal' }
];

// Formulario para crear/editar
const formProduct = ref({
  name_product: '',
  stock_product: null as number | null,
  price_product: null as number | null,
  id_category_product_Id: null as number | null,
  id_state_Id: null as number | null,
  id_movement_type_Id: null as number | null,
  id_supplier_Id: null as number | null,
  id_department_Id: null as number | null,
  id_company_Id: null as number | null,
  id_user_Id: null as number | null,
});

// Validaciones reactivas
const nameError = computed(() => {
  const name = formProduct.value.name_product || '';
  
  // Primero validar si está vacío
  if (!name.trim()) return 'El nombre es requerido';
  
  // Validación contra caracteres especiales (con cualquier longitud)
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(name)) {
    return 'No se permiten caracteres especiales';
  }
  
  // Luego validar la longitud
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 100) return 'Máximo 100 caracteres';
  
  return null;
});

const stockError = computed(() => {
  if (formProduct.value.stock_product === null) return 'El stock es requerido';
  if (formProduct.value.stock_product < 0) return 'No puede ser negativo';
  if (formProduct.value.stock_product > 2147483647) return 'Valor demasiado grande';
  return null;
});

const priceError = computed(() => {
  if (formProduct.value.price_product === null) return 'El precio es requerido';
  if (formProduct.value.price_product < 0.01) return 'Mínimo $0.01';
  return null;
});

const categoryError = computed(() => {
  if (formProduct.value.id_category_product_Id === null) return 'La categoría es requerida';
  return null;
});

const stateError = computed(() => {
  if (formProduct.value.id_state_Id === null) return 'El estado es requerido';
  return null;
});

const movementError = computed(() => {
  if (formProduct.value.id_movement_type_Id === null) return 'El tipo de movimiento es requerido';
  return null;
});

const supplierError = computed(() => {
  if (formProduct.value.id_supplier_Id === null) return 'El proveedor es requerido';
  return null;
});

const isFormValid = computed(() => {
  return !nameError.value && !stockError.value && !priceError.value && 
         !categoryError.value && !stateError.value && 
         !movementError.value && !supplierError.value;
});

// Computed
const filteredInventories = computed(() => {
  return inventoryStore.inventories.filter(inventory =>
    showActive.value ? !inventory.delete_log_inventory : inventory.delete_log_inventory
  );
});

// Métodos
const showActiveInventories = () => {
  showActive.value = true;
};

const showDeletedInventories = () => {
  showActive.value = false;
};

const handleSee = async (id: number) => {
  await inventoryStore.fetchInventoryById(id);
  currentProduct.value = inventoryStore.currentInventory;
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  resetForm();
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const product = inventoryStore.inventories.find(p => p.id_inventory_product === id);
  if (product) {
    isEdit.value = true;
    editingId.value = id;
    
    // Buscar IDs de relaciones por nombre
    const category = categoryProductStore.categoriesProducts.find(
      cat => cat.name_category_product === product.name_category_product
    );
    const state = stateStore.states.find(
      st => st.name_state === product.name_state
    );
    const movementType = movementTypeStore.movementsTypes.find(
      mt => mt.name_movement_type === product.name_movement_type
    );
    const supplier = supplierStore.suppliers.find(
      sup => sup.name_supplier === product.name_supplier
    );

    formProduct.value = {
      name_product: product.name_product,
      stock_product: product.stock_product,
      price_product: product.price_product,
      id_category_product_Id: category?.id_category_product || null,
      id_state_Id: state?.id_state || null,
      id_movement_type_Id: movementType?.id_movement_type || null,
      id_supplier_Id: supplier?.id_supplier || null,
      id_department_Id: authStore.user?.department?.id_department,
      id_company_Id: authStore.user?.company?.id_company,
      id_user_Id: authStore.user?.id_user,
    };
    
    visibleForm.value = true;
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este producto del inventario?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await inventoryStore.removeInventory(id);
        await inventoryStore.fetchInventories();
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Producto eliminado correctamente', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar el producto', 
          life: 3000 
        });
      }
    },
    reject: () => {}
  });
};

const restoreDeletedInventory = async (id: number) => {
  try {
    await inventoryStore.restoreDeletedInventory(id);
    await inventoryStore.fetchInventories();
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Producto restaurado correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al restaurar el producto', 
      life: 3000 
    });
  }
};

const createProduct = async () => {
  if (!isFormValid.value) return;
  
  try {
    const user = authStore.user;
    const data = {
      ...formProduct.value,
      id_department_Id: user?.department?.id_department,
      id_company_Id: user?.company?.id_company,
      id_user_Id: user?.id_user,
    };

    await inventoryStore.addInventory(data);
    resetForm();
    await inventoryStore.fetchInventories();
    visibleForm.value = false;
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Producto creado correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al crear el producto', 
      life: 3000 
    });
  }
};

const updateProduct = async () => {
  if (!isFormValid.value || !editingId.value) return;
  
  try {
    const user = authStore.user;
    const nameUser = user?.name_user || '';
    const nameDepartment = user?.department?.name_department || '';

    await inventoryStore.editInventory(
      editingId.value,
      formProduct.value,
      nameUser,
      nameDepartment
    );
    
    resetForm();
    await inventoryStore.fetchInventories();
    visibleForm.value = false;
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Producto actualizado correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al actualizar el producto', 
      life: 3000 
    });
  }
};

const resetForm = () => {
  formProduct.value = {
    name_product: '',
    stock_product: null,
    price_product: null,
    id_category_product_Id: null,
    id_state_Id: null,
    id_movement_type_Id: null,
    id_supplier_Id: null,
    id_department_Id: null,
    id_company_Id: null,
    id_user_Id: null,
  };
  editingId.value = null;
};

// Función para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Función para determinar color de estado
const getStatusSeverity = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'completado': return 'success';
    case 'pendiente': return 'warning';
    case 'cancelado': return 'danger';
    default: return 'info';
  }
};

const generatePDF = () => {
  // Crear documento PDF
  const doc = new jsPDF();
  
  // Título del documento
  doc.setFontSize(18);
  doc.text(`Reporte de Inventario - ${showActive.value ? 'Activos' : 'Eliminados'}`, 14, 15);
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Configurar tabla
  const headers = mappedColumns.map(col => col.header);
  const data = filteredInventories.value.map(item => [
    item.name_product,
    item.stock_product,
    `$${item.price_product?.toFixed(2)}`,
    item.name_category_product,
    item.name_state,
    item.name_movement_type,
    item.name_supplier
  ]);
  
  // Agregar tabla al PDF (usando autoTable directamente)
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 15 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 40 }
    }
  });
  
  // Guardar el PDF
  doc.save(`inventario_${showActive.value ? 'activos' : 'eliminados'}_${new Date().toISOString().slice(0,10)}.pdf`);
};

// Nuevo método para exportar a Excel
const exportToExcel = () => {
  // Crear contenido CSV
  const headers = mappedColumns.map(col => `"${col.header}"`).join(',');
  const rows = filteredInventories.value.map(item => 
    `"${item.name_product}",${item.stock_product},${item.price_product},"${item.name_category_product}","${item.name_state}","${item.name_movement_type}","${item.name_supplier}"`
  ).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  
  // Crear archivo y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `inventario_${showActive.value ? 'activos' : 'eliminados'}_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// Cargar datos iniciales
onMounted(() => {
  inventoryStore.fetchInventories();
  supplierStore.fetchSuppliers();
  categoryProductStore.fetchCategoriesProducts();
  stateStore.fetchStates();
  movementTypeStore.fetchMovementsTypes();
});
</script>

<style scoped>
/* Estilos personalizados para las tarjetas */
.p-card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.p-card-title {
  font-size: 1.1rem;
  color: var(--primary-color);
}

/* Mejor espaciado en acordeones */
.p-accordion-content {
  padding: 1rem !important;
}

/* Estilo para los campos inválidos */
.p-invalid {
  border-color: var(--red-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Estilo para los contenedores de "no hay elementos" */
.border-gray-600 {
  background-color: #2d3748;
}

/* Estilo para los botones de redirección */
.w-full {
  transition: all 0.3s ease;
}

.w-full:hover {
  transform: translateY(-2px);
}
</style>