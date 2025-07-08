<template>
  <div id="app">
    <RouterView/>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';


export default {
  name: 'App',
  setup() {
    const userStore  = useUserStore();

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
