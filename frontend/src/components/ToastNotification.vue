<template>
  <Transition name="toast">
    <div v-if="toastStore.visible" class="toast" :class="`toast--${toastStore.type}`">
      <p class="toast-message">{{ toastStore.message }}</p>
    </div>
  </Transition>
</template>

<script>
import { useToastStore } from '@/stores/toastStore';

export default {
  name: 'ToastNotification',
  computed: {
    toastStore() {
      return useToastStore();
    }
  }
}
</script>

<style>
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9999;
  min-width: 280px;
  max-width: 480px;
  text-align: center;
}

.toast--success {
  border-color: #C19D53;
  box-shadow: 0 0 16px rgba(193, 157, 83, 0.4);
}

.toast--error {
  border-color: #FF0202;
  box-shadow: 0 0 16px rgba(255, 2, 2, 0.4);
}

.toast--info {
  border-color: #0084ff;
  box-shadow: 0 0 16px rgba(0, 132, 255, 0.4);
}

.toast-message {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  margin: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>
