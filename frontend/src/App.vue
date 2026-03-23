<template>
  <div id="app">
    <RouterView/>
    <ToastNotification/>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import ToastNotification from './components/ToastNotification.vue';

export default {
  name: 'App',
  components: {
    ToastNotification
  },
  setup() {
    const userStore = useUserStore();

    onMounted(() => {
      setInterval(() => {
        if (userStore.isAuthenticated) {
          userStore.refreshToken()
        }
      }, 15 * 60 * 1000);
    })
  }
}
</script>

<style src="./main.css"></style>
