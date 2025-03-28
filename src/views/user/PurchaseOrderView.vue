<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Órdenes de Compra</h1>

    <!-- Filtros para mostrar activos/eliminados -->
    <div class="mb-4">
      <button
        @click="showActive = true"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200 text-gray-800': !showActive }"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transiton-colors"
      >
        Activos
      </button>
      <button
        @click="showActive = false"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200 text-gray-800': showActive }"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600 hover:text-white active:bg-red-800 transition-colors"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de órdenes de compra usando el componente Table -->
    <TableComponent class="h-118"
      :loader="purchaseOrderStore.loading"
      :columns="mappedColumns"
      :data="filteredPurchaseOrders"
      id="id_purchase_order"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="viewOrder"
      @actionCreate="openCreateModal"
      @actionUpdate="startEdit"
      @actionDanger="removeOrder"
      @actionRestore="restoreOrder"
    />

    <!-- Modal de detalles de la orden de compra -->
    <Dialog 
      v-model:visible="isViewing" 
      modal 
      header="Detalles de la Orden de Compra" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => isViewing = val"
    >
      <div v-if="currentOrder" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-shopping-cart text-primary" style="font-size: 1.5rem"></i>
              <span>Información de la Orden</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold">{{ currentOrder.name_purchase_order }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Usuario</span>
                <span class="font-semibold">{{ currentOrder.name_user }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Proveedor</span>
                <span class="font-semibold">{{ currentOrder.name_supplier }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Categoría</span>
                <span class="font-semibold">{{ currentOrder.name_category_purchase_order }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentOrder.name_state" 
                  :severity="getStateSeverity(currentOrder.name_state)" 
                  class="text-sm"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Tipo de Movimiento</span>
                <span class="font-semibold">{{ currentOrder.name_movement_type }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Precio Total</span>
                <span class="font-semibold">${{ currentOrder.total_price_products }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Cantidad de Productos</span>
                <span class="font-semibold">{{ currentOrder.amount_items_in_the_order }}</span>
              </div>
              
              <!-- Lista desplegable de productos con paginador -->
              <div class="col-span-2">
                <Accordion>
                  <AccordionTab header="Productos Asociados">
                    <DataTable 
                      :value="currentOrder.products" 
                      class="p-datatable-sm"
                      paginator 
                      :rows="5" 
                      :rowsPerPageOptions="[5, 10, 20]"
                    >
                      <Column field="name_product" header="Producto" sortable></Column>
                      <Column field="quantity" header="Cantidad" sortable></Column>
                      <Column field="price" header="Precio Unitario" sortable>
                        <template #body="{data}">
                          ${{ data.price }}
                        </template>
                      </Column>
                      <Column header="Subtotal" sortable>
                        <template #body="{data}">
                          ${{ (data.quantity * data.price).toFixed(2) }}
                        </template>
                      </Column>
                    </DataTable>
                  </AccordionTab>
                </Accordion>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </Dialog>

    <!-- Modal de editar/crear -->
    <Dialog 
      v-model:visible="showFormModal"
      modal 
      :header="isEditing ? 'Editar Orden de Compra' : 'Crear Orden de Compra'" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => { if (!val) cancelEdit() }"
    >
      <form @submit.prevent="saveEdit()" class="grid grid-cols-2 gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold">Nombre:*</label>
          <InputText 
            v-model="form.name_purchase_order" 
            id="name" 
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-2">
          <label for="category" class="font-semibold">Categoría:*</label>
          <Dropdown 
            v-model="form.id_category_purchase_order_Id" 
            :options="activeCategories" 
            optionLabel="name_category_purchase_order" 
            optionValue="id_category_purchase_order"
            placeholder="Seleccione una categoría"
            :class="{ 'p-invalid': categoryError }"
            v-if="hasActiveCategories"
          />
          <div v-else class="p-4 border rounded">
            <p class="mb-2">
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

        <!-- Proveedor -->
        <div class="flex flex-col gap-2">
          <label for="supplier" class="font-semibold">Proveedor:*</label>
          <Dropdown 
            v-model="form.id_supplier_Id" 
            :options="activeSuppliers" 
            optionLabel="name_supplier" 
            optionValue="id_supplier"
            placeholder="Seleccione un proveedor"
            :class="{ 'p-invalid': supplierError }"
            v-if="hasActiveSuppliers"
          />
          <div v-else class="p-4 border rounded">
            <p class="mb-2">
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

        <!-- Estado -->
        <div class="flex flex-col gap-2">
          <label for="state" class="font-semibold">Estado:*</label>
          <Dropdown 
            v-model="form.id_state_Id" 
            :options="activeStates" 
            optionLabel="name_state" 
            optionValue="id_state"
            placeholder="Seleccione un estado"
            :class="{ 'p-invalid': stateError }"
            v-if="hasActiveStates"
          />
          <div v-else class="p-4 border rounded">
            <p class="mb-2">
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
          <label for="movementType" class="font-semibold">Tipo de Movimiento:*</label>
          <Dropdown 
            v-model="form.id_movement_type_Id" 
            :options="activeMovementTypes" 
            optionLabel="name_movement_type" 
            optionValue="id_movement_type"
            placeholder="Seleccione un tipo de movimiento"
            :class="{ 'p-invalid': movementTypeError }"
            v-if="hasActiveMovementTypes"
          />
          <div v-else class="p-4 border rounded">
            <p class="mb-2">
              No hay tipos de movimiento activos
            </p>
            <Button 
              label="Crear Tipo" 
              severity="primary" 
              outlined
              @click="redirectToMovementTypes"
              class="w-full"
            />
          </div>
          <small v-if="movementTypeError" class="p-error">
            {{ movementTypeError }}
          </small>
        </div>

        <!-- Productos Asociados -->
        <div class="col-span-2">
          <label class="font-semibold">Productos Asociados:</label>
          <div v-for="(product, index) in form.products" :key="index" class="flex gap-2 mb-2 items-end">
            <div class="flex-1">
              <label class="text-sm text-gray-500">Producto</label>
              <Dropdown
                v-model="product.id_inventory_product_Id"
                :options="getAvailableProducts(index)"
                optionLabel="name_product"
                optionValue="id_inventory_product"
                placeholder="Seleccione un producto"
                class="w-full"
                :class="{ 'p-invalid': !product.id_inventory_product_Id }"
              />
            </div>
            <div class="flex-1">
              <label class="text-sm text-gray-500">Cantidad</label>
              <InputNumber
                v-model="product.quantity"
                mode="decimal"
                :min="1"
                class="w-full"
                :class="{ 'p-invalid': !product.quantity || product.quantity <= 0 }"
              />
            </div>
            <Button
              type="button"
              @click="removeProduct(index)"
              icon="pi pi-times"
              severity="danger"
              text
              rounded
            />
          </div>
          <Button
            type="button"
            @click="addProduct"
            icon="pi pi-plus"
            label="Añadir Producto"
            class="p-button-text"
            :disabled="getAvailableProducts().length === 0"
          />
          <small v-if="getAvailableProducts().length === 0" class="text-sm text-gray-500">
            No hay más productos disponibles para agregar
          </small>
        </div>

        <div class="col-span-2 flex justify-end gap-2 mt-4">
          <Button 
            type="button" 
            label="Cancelar" 
            severity="secondary" 
            outlined
            @click="cancelEdit"
          />
          <Button 
            type="submit" 
            label="Guardar" 
            severity="primary"
            :disabled="!isFormValid"
            :loading="loadingSubmit"
          />
        </div>
      </form>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { useCategoryPurchaseOrderStore } from '@/stores/categoryPurchaseOrderStore';
import { useStateStore } from '@/stores/stateStore';
import { useMovementTypeStore } from '@/stores/movementTypeStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useAuthStore } from '@/stores/authStore';
import TableComponent from '@/components/TableComponent.vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import router from '@/router';

const confirm = useConfirm();
const toast = useToast();

// Stores
const purchaseOrderStore = usePurchaseOrderStore();
const supplierStore = useSupplierStore();
const categoryPurchaseOrderStore = useCategoryPurchaseOrderStore();
const stateStore = useStateStore();
const movementTypeStore = useMovementTypeStore();
const inventoryStore = useInventoryStore();
const authStore = useAuthStore();

// Estados
const showActive = ref(true);
const isViewing = ref(false);
const isEditing = ref(false);
const isCreating = ref(false);
const loadingSubmit = ref(false);
const currentOrder = ref<any>(null);
const showFormModal = computed(() => isEditing.value || isCreating.value);

// Redirecciones
const redirectToCategories = () => {
  showFormModal.value = false;
  router.push('/ca-purchase-orders-u');
};

const redirectToSuppliers = () => {
  showFormModal.value = false;
  router.push('/suppliers-u');
};

const redirectToStates = () => {
  showFormModal.value = false;
  router.push('/states-u');
};

const redirectToMovementTypes = () => {
  showFormModal.value = false;
  router.push('/movements-types-u');
};

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_purchase_order', header: 'Nombre', sortable: true },
  { field: 'name_user', header: 'Usuario', sortable: true },
  { field: 'name_supplier', header: 'Proveedor', sortable: true },
  { field: 'name_category_purchase_order', header: 'Categoría', sortable: true },
  { field: 'name_state', header: 'Estado', sortable: true },
  { field: 'name_movement_type', header: 'Tipo de Movimiento', sortable: true }
];

// Formulario para crear/editar
const form = ref({
  id_purchase_order: null as number | null,
  name_purchase_order: '',
  id_category_purchase_order_Id: null as number | null,
  id_supplier_Id: null as number | null,
  id_state_Id: null as number | null,
  id_movement_type_Id: null as number | null,
  id_user_Id: authStore.user?.id_user || 0,
  id_department_Id: authStore.user?.department?.id_department || 0,
  id_company_Id: authStore.user?.company?.id_company || 0,
  products: [] as Array<{ id_inventory_product_Id: number; quantity: number }>,
});

// Categorias y opciones filtradas por borrado logico
const activeCategories = computed(() => {
  return categoryPurchaseOrderStore.categoriesPurchaseOrders.filter(cat => !cat.delete_log_category_purchase_order);
});

const hasActiveCategories = computed(() => {
  return activeCategories.value.length > 0;
});

// Proveedores activos
const activeSuppliers = computed(() => {
  return supplierStore.suppliers.filter(sup => !sup.delete_log_suppliers);
});

const hasActiveSuppliers = computed(() => {
  return activeSuppliers.value.length > 0;
});

// Estados activos
const activeStates = computed(() => {
  return stateStore.states.filter(state => !state.delete_log_state);
});

const hasActiveStates = computed(() => {
  return activeStates.value.length > 0;
});

// Tipos de movimiento activos
const activeMovementTypes = computed(() => {
  return movementTypeStore.movementsTypes.filter(mt => !mt.delete_log_movement_type);
});

const hasActiveMovementTypes = computed(() => {
  return activeMovementTypes.value.length > 0;
});

// Método para obtener productos disponibles
const getAvailableProducts = (currentIndex: number | null = null) => {
  const selectedProductIds = form.value.products
    .filter((_, index) => index !== currentIndex)
    .map(p => p.id_inventory_product_Id);
  
  return inventoryStore.inventories.filter(
    product => !selectedProductIds.includes(product.id_inventory_product)
  );
};

// Validaciones
const nameError = computed(() => {
  const name = form.value.name_purchase_order || '';
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  return null;
});

const categoryError = computed(() => {
  if (form.value.id_category_purchase_order_Id === null) return 'La categoría es requerida';
  return null;
});

const supplierError = computed(() => {
  if (form.value.id_supplier_Id === null) return 'El proveedor es requerido';
  return null;
});

const stateError = computed(() => {
  if (form.value.id_state_Id === null) return 'El estado es requerido';
  return null;
});

const movementTypeError = computed(() => {
  if (form.value.id_movement_type_Id === null) return 'El tipo de movimiento es requerido';
  return null;
});

const productsError = computed(() => {
  //if (form.value.products.length === 0) return 'Debe agregar al menos un producto';
  
  const hasEmptyProducts = form.value.products.some(
    p => !p.id_inventory_product_Id || p.id_inventory_product_Id === 0 || !p.quantity || p.quantity <= 0
  );
  
  if (hasEmptyProducts) return 'Todos los productos deben estar completos';
  
  return null;
});

const isFormValid = computed(() => {
  return !nameError.value && !categoryError.value && !supplierError.value && 
         !stateError.value && !movementTypeError.value && !productsError.value;
});

// Computed properties
const filteredPurchaseOrders = computed(() => {
  return purchaseOrderStore.purchaseOrders.filter((order) =>
    showActive.value ? !order.delete_log_purchase_orders : order.delete_log_purchase_orders
  );
});

// Métodos
const getStateSeverity = (state: string) => {
  switch(state.toLowerCase()) {
    case 'activo': return 'success';
    case 'pendiente': return 'warning';
    case 'cancelado': return 'danger';
    default: return 'info';
  }
};

const viewOrder = async (id: number) => {
  currentOrder.value = filteredPurchaseOrders.value.find(o => o.id_purchase_order === id);
  if (currentOrder.value) {
    isViewing.value = true;
  }
};

const openCreateModal = () => {
  isCreating.value = true;
  isEditing.value = false;
  form.value = {
    id_purchase_order: null,
    name_purchase_order: '',
    id_category_purchase_order_Id: null,
    id_supplier_Id: null,
    id_state_Id: null,
    id_movement_type_Id: null,
    id_user_Id: authStore.user?.id_user || 0,
    id_department_Id: authStore.user?.department?.id_department || 0,
    id_company_Id: authStore.user?.company?.id_company || 0,
    products: [],
  };
};

const startEdit = async (id: number) => {
  await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
  await supplierStore.fetchSuppliers();
  await stateStore.fetchStates();
  await movementTypeStore.fetchMovementsTypes();
  await inventoryStore.fetchInventories();

  const order = purchaseOrderStore.purchaseOrders.find(o => o.id_purchase_order === id);
  if (order) {
    isEditing.value = true;
    isCreating.value = false;
    
    const category = categoryPurchaseOrderStore.categoriesPurchaseOrders.find(
      cat => cat.name_category_purchase_order === order.name_category_purchase_order
    );

    const supplier = supplierStore.suppliers.find(
      sup => sup.name_supplier === order.name_supplier
    );

    const state = stateStore.states.find(
      st => st.name_state === order.name_state
    );

    const movementType = movementTypeStore.movementsTypes.find(
      mt => mt.name_movement_type === order.name_movement_type
    );

    const products = order.products.map((product) => {
      const inventoryProduct = inventoryStore.inventories.find(
        inv => inv.name_product === product.name_product
      );
      return {
        id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0,
        quantity: product.quantity,
      };
    });

    form.value = {
      id_purchase_order: order.id_purchase_order,
      name_purchase_order: order.name_purchase_order,
      id_category_purchase_order_Id: category ? category.id_category_purchase_order : 0,
      id_supplier_Id: supplier ? supplier.id_supplier : 0,
      id_state_Id: state ? state.id_state : 0,
      id_movement_type_Id: movementType ? movementType.id_movement_type : 0,
      id_user_Id: authStore.user?.id_user || 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
      id_company_Id: authStore.user?.company?.id_company || 0,
      products: products,
    };
  }
};

const saveEdit = async () => {
  if (!isFormValid.value) return;
  
  loadingSubmit.value = true;
  try {
    const payload = {
      name_purchase_order: form.value.name_purchase_order,
      id_category_purchase_order_Id: form.value.id_category_purchase_order_Id,
      id_supplier_Id: form.value.id_supplier_Id,
      id_state_Id: form.value.id_state_Id,
      id_movement_type_Id: form.value.id_movement_type_Id,
      id_user_Id: form.value.id_user_Id,
      id_department_Id: form.value.id_department_Id,
      id_company_Id: form.value.id_company_Id,
      products: form.value.products,
    };

    if (isEditing.value && form.value.id_purchase_order) {
      await purchaseOrderStore.editPurchaseOrder(form.value.id_purchase_order, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Orden de compra actualizada correctamente', 
        life: 3000 
      });
    } else {
      await purchaseOrderStore.addPurchaseOrder(payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Orden de compra creada correctamente', 
        life: 3000 
      });
    }
    
    cancelEdit();
    await purchaseOrderStore.fetchPurchaseOrders();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al guardar la orden de compra', 
      life: 3000 
    });
  } finally {
    loadingSubmit.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  isCreating.value = false;
  form.value = {
    id_purchase_order: null,
    name_purchase_order: '',
    id_category_purchase_order_Id: null,
    id_supplier_Id: null,
    id_state_Id: null,
    id_movement_type_Id: null,
    id_user_Id: authStore.user?.id_user || 0,
    id_department_Id: authStore.user?.department?.id_department || 0,
    id_company_Id: authStore.user?.company?.id_company || 0,
    products: [],
  };
};

const addProduct = () => {
  const available = getAvailableProducts();
  if (available.length > 0) {
    form.value.products.push({ 
      id_inventory_product_Id: available[0].id_inventory_product,
      quantity: 1 
    });
  }
};

const removeProduct = (index: number) => {
  form.value.products.splice(index, 1);
};

const removeOrder = async (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar esta orden de compra?',
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
        await purchaseOrderStore.removePurchaseOrder(id);
        await purchaseOrderStore.fetchPurchaseOrders();
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Orden de compra eliminada correctamente', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar la orden de compra', 
          life: 3000 
        });
      }
    },
    reject: () => {}
  });
};

const restoreOrder = async (id: number) => {
  try {
    await purchaseOrderStore.restoreDeletedPurchaseOrder(id);
    await purchaseOrderStore.fetchPurchaseOrders();
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Orden de compra restaurada correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al restaurar la orden de compra', 
      life: 3000 
    });
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await purchaseOrderStore.fetchPurchaseOrders();
  await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
  await supplierStore.fetchSuppliers();
  await stateStore.fetchStates();
  await movementTypeStore.fetchMovementsTypes();
  await inventoryStore.fetchInventories();
});
</script>

<style scoped>
.p-card {
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.p-card-title {
  font-size: 1.1rem;
  color: var(--primary-color);
}

/* Estilos para campos inválidos */
.p-invalid {
  border-color: var(--red-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>