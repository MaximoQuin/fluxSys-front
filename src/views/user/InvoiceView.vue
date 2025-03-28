<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Facturas</h1>

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

    <!-- Tabla de facturas usando el componente Table -->
    <TableComponent class="h-118"
      :loader="invoiceStore.loading"
      :columns="mappedColumns"
      :data="filteredInvoices"
      id="id_invoice"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="viewInvoice"
      @actionCreate="openCreateModal"
      @actionUpdate="startEdit"
      @actionDanger="removeInvoice"
      @actionRestore="restoreInvoice"
    />

    <!-- Modal de detalles de la factura -->
    <Dialog 
      v-model:visible="isViewing" 
      modal 
      header="Detalles de la Factura" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => isViewing = val"
    >
      <div v-if="currentInvoice" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-file-invoice text-primary" style="font-size: 1.5rem"></i>
              <span>Información de la Factura</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold">{{ currentInvoice.name_invoice }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Orden de Compra</span>
                <span class="font-semibold">{{ currentInvoice.name_purchase_order }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Proveedor</span>
                <span class="font-semibold">{{ currentInvoice.name_supplier }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Departamento</span>
                <span class="font-semibold">{{ currentInvoice.name_department }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentInvoice.delete_log_invoices ? 'Eliminada' : 'Activa'" 
                  :severity="currentInvoice.delete_log_invoices ? 'danger' : 'success'" 
                  class="text-sm"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Precio Total</span>
                <span class="font-semibold">${{ currentInvoice.total_price_invoice }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Cantidad de Productos</span>
                <span class="font-semibold">{{ currentInvoice.amount_items_in_the_invoice }}</span>
              </div>
              
              <!-- Lista desplegable de productos con paginador -->
              <div class="col-span-2">
                <Accordion>
                  <AccordionTab header="Productos Asociados">
                    <DataTable 
                      :value="currentInvoice.products" 
                      class="p-datatable-sm"
                      paginator 
                      :rows="5" 
                      :rowsPerPageOptions="[5, 10, 20]"
                    >
                      <Column field="name_product" header="Producto" sortable></Column>
                      <Column field="quantity" header="Cantidad" sortable></Column>
                      <Column field="unit_price" header="Precio Unitario" sortable>
                        <template #body="{data}">
                          ${{ data.unit_price }}
                        </template>
                      </Column>
                      <Column header="Subtotal" sortable>
                        <template #body="{data}">
                          ${{ (data.quantity * data.unit_price).toFixed(2) }}
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
      :header="isEditing ? 'Editar Factura' : 'Crear Factura'" 
      :style="{ width: '50rem' }"
      :closable="true"
      @update:visible="val => { if (!val) cancelEdit() }"
    >
      <form @submit.prevent="saveEdit()" class="grid grid-cols-2 gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold">Nombre:*</label>
          <InputText 
            v-model="form.name_invoice" 
            id="name" 
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
        </div>

        <!-- Orden de Compra -->
        <div class="flex flex-col gap-2">
          <label for="purchaseOrder" class="font-semibold">Orden de Compra:*</label>
          <Dropdown 
            v-model="form.id_purchase_order_Id" 
            :options="activePurchaseOrders" 
            optionLabel="name_purchase_order" 
            optionValue="id_purchase_order"
            placeholder="Seleccione una orden de compra"
            :class="{ 'p-invalid': purchaseOrderError }"
            v-if="hasActivePurchaseOrders"
          />
          <div v-else class="p-4 border rounded">
            <p class="mb-2">
              No hay órdenes de compra activas
            </p>
            <Button 
              label="Crear Orden" 
              severity="primary" 
              outlined
              @click="redirectToPurchaseOrders"
              class="w-full"
            />
          </div>
          <small v-if="purchaseOrderError" class="p-error">
            {{ purchaseOrderError }}
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
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore';
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
const invoiceStore = useInvoiceStore();
const supplierStore = useSupplierStore();
const purchaseOrderStore = usePurchaseOrderStore();
const inventoryStore = useInventoryStore();
const authStore = useAuthStore();

// Estados
const showActive = ref(true);
const isViewing = ref(false);
const isEditing = ref(false);
const isCreating = ref(false);
const loadingSubmit = ref(false);
const currentInvoice = ref<any>(null);
const showFormModal = computed(() => isEditing.value || isCreating.value);

// Redirecciones
const redirectToPurchaseOrders = () => {
  showFormModal.value = false;
  router.push('/purchase-orders-u');
};

const redirectToSuppliers = () => {
  showFormModal.value = false;
  router.push('/suppliers-u');
};

// Filtro de borrado logico
const activePurchaseOrders = computed(() => {
  return purchaseOrderStore.purchaseOrders.filter(po => !po.delete_log_purchase_orders);
});

const hasActivePurchaseOrders = computed(() => {
  return activePurchaseOrders.value.length > 0;
});

const activeSuppliers = computed(() => {
  return supplierStore.suppliers.filter(sup => !sup.delete_log_suppliers);
});

const hasActiveSuppliers = computed(() => {
  return activeSuppliers.value.length > 0;
});

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_invoice', header: 'Nombre', sortable: true },
  { field: 'name_purchase_order', header: 'Orden de Compra', sortable: true },
  { field: 'name_supplier', header: 'Proveedor', sortable: true },
  { field: 'name_department', header: 'Departamento', sortable: true }
];

// Formulario para crear/editar
const form = ref({
  id_invoice: null as number | null,
  name_invoice: '',
  id_purchase_order_Id: null as number | null,
  id_supplier_Id: null as number | null,
  id_department_Id: authStore.user?.department?.id_department || 0,
  id_company_Id: authStore.user?.company?.id_company || 0,
  products: [] as Array<{ id_inventory_product_Id: number; quantity: number }>,
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
  const name = form.value.name_invoice || '';
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  return null;
});

const purchaseOrderError = computed(() => {
  if (form.value.id_purchase_order_Id === null) return 'La orden de compra es requerida';
  return null;
});

const supplierError = computed(() => {
  if (form.value.id_supplier_Id === null) return 'El proveedor es requerido';
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
  return !nameError.value && !purchaseOrderError.value && 
         !supplierError.value && !productsError.value;
});

// Computed properties
const filteredInvoices = computed(() => {
  return invoiceStore.invoices.filter((invoice) =>
    showActive.value ? !invoice.delete_log_invoices : invoice.delete_log_invoices
  );
});

// Métodos
const viewInvoice = async (id: number) => {
  currentInvoice.value = filteredInvoices.value.find(i => i.id_invoice === id);
  if (currentInvoice.value) {
    isViewing.value = true;
  }
};

const openCreateModal = () => {
  isCreating.value = true;
  isEditing.value = false;
  form.value = {
    id_invoice: null,
    name_invoice: '',
    id_purchase_order_Id: null,
    id_supplier_Id: null,
    id_department_Id: authStore.user?.department?.id_department || 0,
    id_company_Id: authStore.user?.company?.id_company || 0,
    products: [],
  };
};

const startEdit = async (id: number) => {
  await purchaseOrderStore.fetchPurchaseOrders();
  await supplierStore.fetchSuppliers();
  await inventoryStore.fetchInventories();

  const invoice = invoiceStore.invoices.find(i => i.id_invoice === id);
  if (invoice) {
    isEditing.value = true;
    isCreating.value = false;
    
    const purchaseOrder = purchaseOrderStore.purchaseOrders.find(
      po => po.name_purchase_order === invoice.name_purchase_order
    );

    const supplier = supplierStore.suppliers.find(
      sup => sup.name_supplier === invoice.name_supplier
    );

    const products = invoice.products.map((product) => {
      const inventoryProduct = inventoryStore.inventories.find(
        inv => inv.name_product === product.name_product
      );
      return {
        id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0,
        quantity: product.quantity,
      };
    });

    form.value = {
      id_invoice: invoice.id_invoice,
      name_invoice: invoice.name_invoice,
      id_purchase_order_Id: purchaseOrder ? purchaseOrder.id_purchase_order : 0,
      id_supplier_Id: supplier ? supplier.id_supplier : 0,
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
      name_invoice: form.value.name_invoice,
      id_purchase_order_Id: form.value.id_purchase_order_Id,
      id_supplier_Id: form.value.id_supplier_Id,
      id_department_Id: form.value.id_department_Id,
      id_company_Id: form.value.id_company_Id,
      products: form.value.products,
    };

    if (isEditing.value && form.value.id_invoice) {
      await invoiceStore.editInvoice(form.value.id_invoice, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Factura actualizada correctamente', 
        life: 3000 
      });
    } else {
      await invoiceStore.addInvoice(payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Factura creada correctamente', 
        life: 3000 
      });
    }
    
    cancelEdit();
    await invoiceStore.fetchInvoices();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al guardar la factura', 
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
    id_invoice: null,
    name_invoice: '',
    id_purchase_order_Id: null,
    id_supplier_Id: null,
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

const removeInvoice = async (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar esta factura?',
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
        await invoiceStore.removeInvoice(id);
        await invoiceStore.fetchInvoices();
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Factura eliminada correctamente', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar la factura', 
          life: 3000 
        });
      }
    },
    reject: () => {}
  });
};

const restoreInvoice = async (id: number) => {
  try {
    await invoiceStore.restoreDeletedInvoice(id);
    await invoiceStore.fetchInvoices();
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Factura restaurada correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al restaurar la factura', 
      life: 3000 
    });
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await invoiceStore.fetchInvoices();
  await purchaseOrderStore.fetchPurchaseOrders();
  await supplierStore.fetchSuppliers();
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