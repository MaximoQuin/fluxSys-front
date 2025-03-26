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
};
</script>

<template>
  <nav class="bg-white dark:bg-gray-900 flex relative justify-between items-center px-8 h-20 mb-2 rounded-lg shadow-sm">
    <div class="flex mr-4 items-center">
      <div class="block relative">
        <Button type="button" icon="pi pi-bars" class="hidden md:inline-block p-2 hover:bg-gray-200 rounded-full" text
          severity="secondary" @click="toggleSidebar" />
      </div>
    </div>

    <div class="flex-initial">
      <div class="flex justify-end items-center relative">
        <Dialog v-model:visible="profile" modal header="Perfil de Usuario" :style="{ width: '40rem' }">
          <div class="flex flex-column align-items-center gap-3 mb-5">
            <Avatar :label="user?.name_user?.split(' ').map(n => n[0]).join('')" class="text-4xl" size="xlarge"
              shape="circle" style="background-color: var(--primary-color); color: white; width: 80px; height: 80px;" />
            <div class="text-center">
              <h2 class="text-2xl font-bold mb-1">{{ user?.name_user }}</h2>
              <Tag :value="user?.role?.name_role" severity="info" class="text-sm" />
            </div>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="p-3 border-round border-1 surface-border">
                <div class="text-500 font-medium mb-2">Información Personal</div>
                <div class="flex align-items-center mb-3">
                  <i class="pi pi-envelope mr-2 text-500"></i>
                  <span>{{ user?.mail_user }}</span>
                </div>
                <div class="flex align-items-center mb-3">
                  <i class="pi pi-phone mr-2 text-500"></i>
                  <span>{{ user?.phone_user || 'No especificado' }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="p-3 border-round border-1 surface-border">
                <div class="text-500 font-medium mb-2">Información Laboral</div>
                <div class="flex align-items-center mb-3">
                  <i class="pi pi-building mr-2 text-500"></i>
                  <span>{{ user?.company?.name_company }}</span>
                </div>
                <div class="flex align-items-center mb-3">
                  <i class="pi pi-users mr-2 text-500"></i>
                  <span>{{ user?.department?.name_department }}</span>
                </div>
                <div class="flex align-items-center">
                  <i class="pi pi-briefcase mr-2 text-500"></i>
                  <span>{{ user?.position?.name_position }}</span>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <Button label="Cerrar" icon="pi pi-times" @click="profile = false" text />
          </template>
        </Dialog>

        <div class="block">
          <div class="inline relative">
            <Button type="button" class="flex gap-3 items-center p-3 border-round-xl hover:shadow-2" @click="toggle"
              aria-haspopup="true" aria-controls="overlay_menu" text>
              <Avatar :label="user?.name_user?.split(' ').map(n => n[0]).join('')" shape="circle"
                class="text-black dark:text-white" style="background-color: var(--primary-color);" />
              <i class="pi pi-chevron-down"></i>
            </Button>
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.p-dialog .p-dialog-header {
  border-bottom: 1px solid #e5e7eb;
}

.p-dialog .p-dialog-content {
  padding: 2rem;
}

.p-avatar {
  font-weight: 600;
}

nav {
  transition: all 0.3s ease;
}
</style>
