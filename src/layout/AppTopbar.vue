<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

import { computed, ref } from "vue";
// import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

// const confirm = useConfirm();
const toast = useToast();

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const profile = ref(false);

const menu = ref();
const items = ref([
  {
    // label: 'Opciones',
    items: [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => {
          profile.value = true;
        }
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          handleLogout();
        }
      }
    ]
  }
]);

// const isOpen = ref(false);

const handleLogout = async () => {
  // confirm.require({
  //   message: '¿Estás seguro de cerrar sesión?',
  //   header: 'Confirmar cierre de sesión',
  //   icon: 'pi pi-exclamation-triangle',
  //   acceptLabel: 'Salir',
  //   rejectLabel: 'Cancelar',
  //   accept: async () => {
  try {
    await authStore.logout();
    router.push('/login');
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Sesión cerrada correctamente',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al cerrar sesión',
      life: 3000
    });
  }
  // }
  // });
};


const emit = defineEmits<{
  (event: 'toggle-sidebar'): void;
}>();

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const toggle = (event) => {
  menu.value.toggle(event);
  // isOpen.value = !isOpen.value;
};

// const activeClass = computed(() => (isOpen.value ? 'active-true' : 'active-false'));

</script>

<template>
  <!-- component -->
  <nav class=" bg-white dark:bg-gray-900 flex relative justify-between items-center px-8 h-20 mb-2 rounded-lg">
    <div class="flex mr-4 items-center">
      <div class="block relative">
        <button type="button" class="hidden md:inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
          @click="toggleSidebar" style="cursor: pointer;">
          <div class="flex items-center h-5">
            <i class="pi pi-bars text-gray-900 dark:text-white"></i>
          </div>
        </button>
      </div>
    </div>

    <!-- login -->
    <div class="flex-initial">
      <div class="flex justify-end items-center relative">

        <!-- <div class="flex mr-4 items-center">
          <div class="block relative">
            <button type="button" class="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
              style="cursor: pointer;">
              <div class="flex items-center h-5">
                <div class="_xpkakx">
                  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation"
                    focusable="false" style="display: block; height: 16px; width: 16px; fill: currentcolor;">
                    <path
                      d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.615-1.208-1.036-2.875-1.162-4.686l-.022-.39zm1.188-6.576-.115.046a6.257 6.257 0 0 0 -3.823 5.03h2.75c.085-1.83.471-3.54 1.059-4.81zm2.262-.424c-.702.002-1.784 2.512-1.947 5.5h3.904c-.156-2.903-1.178-5.343-1.892-5.494l-.065-.007zm2.28.432.023.05c.643 1.288 1.069 3.084 1.157 5.018h2.748a6.275 6.275 0 0 0 -3.929-5.068z">
                    </path>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div> -->

        <Dialog v-model:visible="profile" modal header="Perfil" :style="{ width: '30rem' }">
          <div>
            <!-- <h2 class="text-2xl font-semibold mb-6">Información del Usuario</h2> -->

            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Nombre:</p>
                <p class="text-lg font-medium">{{ user?.name_user }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Correo Electrónico:</p>
                <p class="text-lg font-medium">{{ user?.mail_user }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Teléfono:</p>
                <p class="text-lg font-medium">{{ user?.phone_user }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Empresa:</p>
                <p class="text-lg font-medium">{{ user?.company?.name_company }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Departamento:</p>
                <p class="text-lg font-medium">{{ user?.department?.name_department }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Puesto:</p>
                <p class="text-lg font-medium">{{ user?.position?.name_position }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Rol:</p>
                <p class="text-lg font-medium">{{ user?.role?.name_role }}</p>
              </div>
            </div>
          </div>

        </Dialog>

        <div class="block">
          <div class="inline relative">

            <button type="button" class="flex gap-3 items-center relative border rounded-full hover:shadow-lg px-3"
              style="cursor: pointer;" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
              <!-- <i class="pi pi-bars active" :class="activeClass"></i> -->
              <i class="pi pi-bars active"></i>

              <div class="block flex-grow-0 flex-shrink-0 h-10 w-6">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation"
                  focusable="false" style="display: block; height: 100%; width: 100%; fill: currentcolor;">
                  <path
                    d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z">
                  </path>
                </svg>
              </div>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          </div>
        </div>
      </div>
    </div>
    <!-- end login -->
  </nav>
</template>

<style>
.active {
  width: 100%;
  overflow: hidden;
  transition: max-width 0.4s ease-in-out;
}

.active-true {
  max-width: 16px;
}

.active-false {
  max-width: 0px;
}
</style>
