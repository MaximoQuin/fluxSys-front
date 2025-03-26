<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center" :style="{ backgroundImage: 'url(/background.jpg)' }">
    <!-- Toast para mostrar mensajes de error -->
    <Toast position="top-right" />
    
    <!-- Dialog draggable -->
    <Dialog 
      v-model:visible="visible" 
      :draggable="true" 
      :modal="false"
      :closable="false"
      :style="{ width: '28rem', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }"
      contentClass="border border-white/10 rounded-2xl shadow-2xl p-0"
      position="center"
      class="p-0"
    >
      <template #header>
        <!-- Header vacío para que no muestre la barra de título por defecto -->
      </template>
      
      <div class="p-8">
        <div class="text-center mb-8">
          <Avatar icon="pi pi-user" size="xlarge" class="bg-orange-500/20 text-orange-500 border-2 border-orange-500/50 mb-4" shape="circle" />
          <h1 class="text-4xl font-bold text-center text-white mb-2">Inicia Sesión</h1>
          <p class="text-gray-300">Ingresa tus credenciales para continuar</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo de correo electrónico -->
          <div class="space-y-2">
            <span class="p-float-label">
              <InputText 
                v-model="email"
                type="email" 
                placeholder="Tu correo" 
                required
                class="w-full bg-transparent border-b border-gray-400 text-white focus:border-orange-500"
                :class="{ 'p-invalid': email && !isEmailValid }"
              />
              <label class="text-gray-300">Correo electrónico</label>
            </span>
            <!-- Mensaje de error para correo electrónico inválido -->
            <br>
            <small v-if="email && !isEmailValid" class="p-error">
              Ingresa una dirección de correo electrónico válida.
            </small>
          </div>

          <!-- Campo de contraseña -->
          <div class="space-y-2">
            <span class="p-float-label">
              <Password 
                v-model="password"
                placeholder="********" 
                required
                class="w-full bg-transparent border-b border-gray-400 text-white"
                inputClass="w-full bg-transparent text-white"
                :feedback="false"
                toggleMask
              />
              <label class="text-gray-300">Contraseña</label>
            </span>
          </div>

          <!-- Botón de inicio de sesión -->
          <Button 
            type="submit" 
            label="Sign In" 
            icon="pi pi-sign-in"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
            :loading="loading"
          />
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';

// Toast para mostrar mensajes
const toast = useToast();

// Variables reactivas
const email = ref('');
const password = ref('');
const remember = ref(false);
const loading = ref(false);
const loginError = ref('');
const visible = ref(true); // Para controlar la visibilidad del Dialog
const authStore = useAuthStore();
const router = useRouter();

// Validación del correo electrónico
const isEmailValid = computed(() => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email.value);
});

// Función para manejar el inicio de sesión
const handleLogin = async () => {
  // Limpiar el mensaje de error
  loginError.value = '';
  loading.value = true;

  // Validar el correo electrónico antes de continuar
  if (!isEmailValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ingresa una dirección de correo electrónico válida.',
      life: 5000
    });
    loading.value = false;
    return;
  }

  try {
    // Intentar iniciar sesión
    await authStore.login(email.value, password.value);
    // Redirigir al usuario a la página principal
    router.push('/');
  } catch (error) {
    // Manejar errores específicos
    let errorMessage = "Credenciales incorrectas. Inténtalo de nuevo.";
    
    if (error.response && error.response.data.message === "El usuario no está disponible.") {
      errorMessage = "Tu cuenta no existe o se encuentra fuera de servicio.";
    }
    
    // Mostrar mensaje de error con Toast
    toast.add({
      severity: 'error',
      summary: 'Error de inicio de sesión',
      detail: errorMessage,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Mostrar el diálogo al montar el componente
onMounted(() => {
  visible.value = true;
});
</script>

<style scoped>
/* Estilos personalizados */
:deep(.p-password input) {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #9ca3af;
  border-radius: 0;
  color: white;
  padding-left: 2rem;
}

:deep(.p-inputtext) {
  background: transparent;
  border: none;
  border-bottom: 1px solid #9ca3af;
  border-radius: 0;
  color: white;
  padding-left: 2rem;
  width: 100%;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: none;
  border-color: #f97316;
}

:deep(.p-dialog .p-dialog-header) {
  padding: 0;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0;
}

:deep(.p-dialog) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:deep(.p-button) {
  transition: all 0.3s ease;
}

:deep(.p-button:enabled:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

/* Estilos para el toast */
:deep(.p-toast) {
  opacity: 0.9;
}

:deep(.p-toast .p-toast-message) {
  margin: 0 0 1rem 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
</style>