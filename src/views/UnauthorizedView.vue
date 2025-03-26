<template>
  <div class="dark-error-container">
    <!-- Efecto de constelación -->
    <div class="stars-container">
      <div v-for="i in 120" :key="i" class="star" :style="starStyle(i)"></div>
    </div>

    <!-- Contenido principal -->
    <div class="dark-error-content">
      <div class="dark-error-card p-p-6 p-shadow-24 animated fadeInUp">
        <!-- Icono animado -->
        <div class="icon-container">
          <i class="pi pi-shield" style="font-size: 5rem; color: #4fc3f7"></i>
          <div class="pulse-effect"></div>
        </div>
        
        <!-- Título y mensaje -->
        <h1 class="p-text-center p-mt-4 gradient-text">
          Acceso Restringido
        </h1>
        
        <p class="p-text-center p-mt-3 subtitle">
          Lo sentimos, pero no tienes los permisos necesarios<br>
          para acceder a esta sección protegida.
        </p>

        <p class="p-text-center p-mt-2 hint-text">
          <i class="pi pi-info-circle p-mr-2"></i>
          Contacta al administrador si necesitas acceso
        </p>
        
        <br>
        <br>

        <!-- Botón de acción - Centrado y cuadrado -->
        <div class="button-container p-mt-5">
          <Button 
            label="VOLVER AL INICIO" 
            icon="pi pi-arrow-left" 
            class="square-button"
            @click="redirectHome" />
        </div>
      </div>
      
      <!-- Efecto de borde luminoso -->
      <div class="edge-glow"></div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();
const toastShown = ref(false);

const redirectHome = () => {
  if (!toastShown.value) {
    toast.add({
      severity: 'info',
      summary: 'Redirección',
      detail: 'Volviendo al inicio...',
      life: 1000,
      styleClass: 'glowing-toast'
    });
    toastShown.value = true;
  }
  
  setTimeout(() => {
    router.push('/');
  }, 1000);
};

const starStyle = (index: number) => {
  const size = Math.random() * 2 + 1;
  const duration = Math.random() * 10 + 5;
  const delay = Math.random() * 5;
  const opacity = Math.random() * 0.7 + 0.3;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: opacity
  };
};
</script>

<style scoped>
.dark-error-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #ffffff;
}

.dark-error-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
}

.dark-error-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* Contenedor del botón centrado */
.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Estilo del botón cuadrado */
.square-button {
  border-radius: 8px !important;
  padding: 1rem 2rem !important;
  background: linear-gradient(135deg, #4fc3f7 0%, #7b4ff7 100%) !important;
  border: none !important;
  box-shadow: 0 0 15px rgba(123, 79, 247, 0.5) !important;
  transition: all 0.3s ease !important;
  font-weight: bold !important;
  letter-spacing: 1px !important;
}

.square-button:hover {
  box-shadow: 0 0 25px rgba(123, 79, 247, 0.8) !important;
  transform: translateY(-2px) !important;
}

/* Efecto de constelación */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Efectos especiales */
.icon-container {
  position: relative;
  display: inline-block;
}

.pulse-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(79, 195, 247, 0.4);
  animation: pulse 3s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.7; }
  70% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
}

.gradient-text {
  background: linear-gradient(90deg, #4fc3f7, #7b4ff7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.6;
}

.hint-text {
  color: #64748b;
  font-size: 0.9rem;
}

.edge-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.fadeInUp {
  animation-name: fadeInUp;
}

/* Toast personalizado */
:deep(.glowing-toast) {
  background: rgba(15, 23, 42, 0.9) !important;
  border: 1px solid rgba(79, 195, 247, 0.3) !important;
  backdrop-filter: blur(10px) !important;
  color: white !important;
}

@media (max-width: 640px) {
  .dark-error-card {
    padding: 2rem 1.5rem;
  }
  
  h1 {
    font-size: 1.8rem !important;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .square-button {
    padding: 0.8rem 1.5rem !important;
    font-size: 0.9rem !important;
  }
}
</style>