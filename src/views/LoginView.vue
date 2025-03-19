<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center" :style="{ backgroundImage: 'url(/background.jpg)' }">
    <div class="w-full max-w-md p-8 bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg backdrop-blur-lg">
      <h1 class="text-4xl font-bold text-center text-white mb-8">Inicia Sesión</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-300 text-sm font-medium">Correo electrónico</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-400">
              <i class="fas fa-envelope"></i>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Tu correo"
              required
              class="peer w-full pl-10 py-2 bg-transparent border-b border-gray-400 text-white focus:outline-none focus:border-orange-500 invalid:border-red-500 invalid:text-red-600"
              :class="{ 'invalid:border-red-500': !isEmailValid }"
            />
          </div>
          <p v-if="email && !isEmailValid" class="text-sm text-red-500 mt-2">
            Ingresa una dirección de correo electrónico válida.
          </p>
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-medium">Contraseña</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-400">
              <i class="fas fa-key"></i>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="********"
              required
              class="w-full pl-10 py-2 bg-transparent border-b border-gray-400 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Sign In
        </button>

        <!-- Mensaje de error de credenciales incorrectas -->
        <p v-if="loginError" class="text-sm text-red-500 mt-2 text-center">
          Credenciales incorrectas. Inténtalo de nuevo.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loginError = ref(false); 
const authStore = useAuthStore();
const router = useRouter();

const isEmailValid = computed(() => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email.value);
});

const handleLogin = async () => {
  if (!isEmailValid.value) {
    loginError.value = false;
    return;
  }

  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (error) {
    loginError.value = true; 
  }
};
</script>
