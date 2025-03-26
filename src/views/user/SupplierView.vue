<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Proveedores</h1>

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

    <!-- Tabla de proveedores usando el componente Table -->
    <TableComponent
      :loader="supplierStore.loading"
      :columns="mappedColumns"
      :data="filteredSuppliers"
      id="id_supplier"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="viewSupplier"
      @actionCreate="openCreateModal"
      @actionUpdate="startEdit"
      @actionDanger="removeSupplier"
      @actionRestore="restoreSupplier"
    />

    <!-- Modal de detalles del proveedor -->
    <Dialog 
      v-model:visible="isViewing" 
      modal 
      header="Detalles del Proveedor" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => isViewing = val"
    >
      <div v-if="currentSupplier" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-building text-primary" style="font-size: 1.5rem"></i>
              <span>Información del Proveedor</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold text-lg">{{ currentSupplier.name_supplier }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentSupplier.delete_log_suppliers ? 'Eliminado' : 'Activo'" 
                  :severity="currentSupplier.delete_log_suppliers ? 'danger' : 'success'" 
                  class="text-sm"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Email</span>
                <span class="font-semibold">{{ currentSupplier.mail_supplier }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Teléfono</span>
                <span class="font-semibold">{{ currentSupplier.phone_supplier || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Categoría</span>
                <span class="font-semibold">{{ currentSupplier.name_category_supplier }}</span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm font-medium text-gray-500">Productos Asociados</span>
                <DataTable 
                  :value="currentSupplier.products" 
                  :rows="5" 
                  paginator 
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  :rowsPerPageOptions="[5,10,20]"
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                  class="mt-2"
                >
                  <Column field="name_product" header="Producto"></Column>
                  <Column field="suggested_price" header="Precio Sugerido">
                    <template #body="{data}">
                      ${{ data.suggested_price }}
                    </template>
                  </Column>
                </DataTable>
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
      :header="isEditing ? 'Editar Proveedor' : 'Crear Proveedor'" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => { if (!val) cancelEdit() }"
    >
      <form @submit.prevent="saveEdit()" class="grid grid-cols-2 gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold">Nombre:*</label>
          <InputText 
            v-model="form.name_supplier" 
            id="name" 
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label for="email" class="font-semibold">Email:*</label>
          <InputText 
            v-model="form.mail_supplier" 
            id="email" 
            autocomplete="off"
            :class="{ 'p-invalid': emailError }"
          />
          <small v-if="emailError" class="p-error">
            {{ emailError }}
          </small>
        </div>

        <!-- Teléfono -->
        <div class="flex flex-col gap-2">
          <label for="phone" class="font-semibold">Teléfono:*</label>
          <InputMask
            v-model="form.phone_supplier"
            id="phone"
            mask="9999999999"
            placeholder="1234567890"
            :class="{ 'p-invalid': phoneError }"
          />
          <small v-if="phoneError" class="p-error">
            {{ phoneError }}
          </small>
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-2">
          <label for="category" class="font-semibold">Categoría:*</label>
          <Dropdown 
            v-model="form.id_category_supplier_Id" 
            :options="categorySupplierStore.categoriesSuppliers" 
            optionLabel="name_category_supplier" 
            optionValue="id_category_supplier"
            placeholder="Seleccione una categoría"
            :class="{ 'p-invalid': categoryError }"
          />
          <small v-if="categoryError" class="p-error">
            {{ categoryError }}
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
              <label class="text-sm text-gray-500">Precio Sugerido</label>
              <InputNumber
                v-model="product.suggested_price"
                mode="currency"
                currency="USD"
                locale="en-US"
                class="w-full"
                :class="{ 'p-invalid': !product.suggested_price }"
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
import { useSupplierStore } from '@/stores/supplierStore';
import { useCategorySupplierStore } from '@/stores/categorySupplierStore';
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

const confirm = useConfirm();
const toast = useToast();

// Stores
const supplierStore = useSupplierStore();
const categorySupplierStore = useCategorySupplierStore();
const inventoryStore = useInventoryStore();
const authStore = useAuthStore();

// Estados
const showActive = ref(true);
const isViewing = ref(false);
const isEditing = ref(false);
const isCreating = ref(false);
const loadingSubmit = ref(false);
const currentSupplier = ref<any>(null);
const showFormModal = computed(() => isEditing.value || isCreating.value);

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_supplier', header: 'Nombre', sortable: true },
  { field: 'mail_supplier', header: 'Email', sortable: true },
  { field: 'phone_supplier', header: 'Teléfono', sortable: true },
  { field: 'name_category_supplier', header: 'Categoría', sortable: true }
];

// Formulario para crear/editar
const form = ref({
  id_supplier: null as number | null,
  name_supplier: '',
  mail_supplier: '',
  phone_supplier: null as number | null,
  id_category_supplier_Id: null as number | null,
  products: [] as Array<{ id_inventory_product_Id: number; suggested_price: number }>,
});

// Método para obtener productos disponibles (incluyendo el actualmente seleccionado)
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
  const name = form.value.name_supplier || '';
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  return null;
});

const emailError = computed(() => {
  const email = form.value.mail_supplier || '';
  if (!email.trim()) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Formato de email inválido';
  return null;
});

const phoneError = computed(() => {
  const phone = form.value.phone_supplier?.toString() || '';
  if (!phone) return 'El teléfono es requerido';
  if (!/^\d{10}$/.test(phone)) return 'Debe tener 10 dígitos';
  return null;
});

const categoryError = computed(() => {
  if (form.value.id_category_supplier_Id === null) return 'La categoría es requerida';
  return null;
});

const productsError = computed(() => {
  //Eliminacion de validacion los productos son opcionales
  //if (form.value.products.length === 0) return 'Debe agregar al menos un producto';
  
  // Verificar que todos los productos tengan un producto seleccionado
  const hasEmptyProducts = form.value.products.some(
    p => !p.id_inventory_product_Id || p.id_inventory_product_Id === 0
  );
  
  if (hasEmptyProducts) return 'Todos los productos deben estar seleccionados';
  
  return null;
});

const isFormValid = computed(() => {
  return !nameError.value && !emailError.value && !phoneError.value && 
         !categoryError.value && !productsError.value;
});

// Computed properties
const filteredSuppliers = computed(() => {
  return supplierStore.suppliers.filter((supplier) =>
    showActive.value ? !supplier.delete_log_suppliers : supplier.delete_log_suppliers
  );
});

// Métodos
const viewSupplier = async (id: number) => {
  currentSupplier.value = filteredSuppliers.value.find(s => s.id_supplier === id);
  if (currentSupplier.value) {
    isViewing.value = true;
  }
};

const openCreateModal = () => {
  isCreating.value = true;
  isEditing.value = false;
  form.value = {
    id_supplier: null,
    name_supplier: '',
    mail_supplier: '',
    phone_supplier: null,
    id_category_supplier_Id: null,
    products: [],
  };
};

const startEdit = async (id: number) => {
  // Recargar categorías y productos si no están cargados
  await categorySupplierStore.fetchCategoriesSuppliers();
  await inventoryStore.fetchInventories();

  const supplier = supplierStore.suppliers.find(s => s.id_supplier === id);
  if (supplier) {
    isEditing.value = true;
    isCreating.value = false;
    
    // Buscar el ID de la categoría por su nombre
    const category = categorySupplierStore.categoriesSuppliers.find(
      cat => cat.name_category_supplier === supplier.name_category_supplier
    );

    // Mapear los productos para obtener sus IDs
    const products = supplier.products.map((product) => {
      const inventoryProduct = inventoryStore.inventories.find(
        inv => inv.name_product === product.name_product
      );
      return {
        id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0,
        suggested_price: product.suggested_price,
      };
    });

    form.value = {
      id_supplier: supplier.id_supplier,
      name_supplier: supplier.name_supplier,
      mail_supplier: supplier.mail_supplier,
      phone_supplier: supplier.phone_supplier,
      id_category_supplier_Id: category ? category.id_category_supplier : 0,
      products: products,
    };
  }
};

const saveEdit = async () => {
  if (!isFormValid.value) return;
  
  loadingSubmit.value = true;
  try {
    const id_company = authStore.user?.company?.id_company || 0;
    const payload = {
      ...form.value,
      id_company_Id: id_company,
    };

    if (isEditing.value && form.value.id_supplier) {
      await supplierStore.editSupplier(form.value.id_supplier, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Proveedor actualizado correctamente', 
        life: 3000 
      });
    } else {
      await supplierStore.addSupplier(payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Proveedor creado correctamente', 
        life: 3000 
      });
    }
    
    cancelEdit();
    await supplierStore.fetchSuppliers();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al guardar el proveedor', 
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
    id_supplier: null,
    name_supplier: '',
    mail_supplier: '',
    phone_supplier: null,
    id_category_supplier_Id: null,
    products: [],
  };
};

const addProduct = () => {
  const available = getAvailableProducts();
  if (available.length > 0) {
    form.value.products.push({ 
      id_inventory_product_Id: available[0].id_inventory_product,
      suggested_price: 0 
    });
  }
};

const removeProduct = (index: number) => {
  form.value.products.splice(index, 1);
};

const removeSupplier = async (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este proveedor?',
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
        await supplierStore.removeSupplier(id);
        await supplierStore.fetchSuppliers();
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Proveedor eliminado correctamente', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar el proveedor', 
          life: 3000 
        });
      }
    },
    reject: () => {}
  });
};

const restoreSupplier = async (id: number) => {
  try {
    await supplierStore.restoreDeletedSupplier(id);
    await supplierStore.fetchSuppliers();
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Proveedor restaurado correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al restaurar el proveedor', 
      life: 3000 
    });
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await supplierStore.fetchSuppliers();
  await categorySupplierStore.fetchCategoriesSuppliers();
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