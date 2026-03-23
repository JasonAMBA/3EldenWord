import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from './App.vue'
import HomePage from './views/HomePage.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginPage from './views/LoginPage.vue'
import RegionPage from './views/RegionPage.vue'
import SelectLevelPage from './views/SelectLevelPage.vue'
import LevelPage from './views/LevelPage.vue'
import ProfilePage from './views/ProfilePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/register', component: RegisterPage },
  { path: '/login', component: LoginPage },
  { path: '/regions', component: RegionPage },
  { path: '/region/:id/levels', component: SelectLevelPage },
  { path: '/region/:regionId/level/:bossId', component: LevelPage },
  { path: '/profile', component: ProfilePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');