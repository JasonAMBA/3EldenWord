import { createApp } from 'vue'
import App from './App.vue'
import HomePage from './views/HomePage.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path:'/', component: HomePage},
  {path:'/register', component: RegisterPage},
  {path:'/login', component: LoginPage},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App);

app.use(router);
app.mount('#app')