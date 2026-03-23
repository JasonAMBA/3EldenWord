<template>
  <main class="container background-homepage">
    <figure class="picture">
      <img class="border shadow custom img-picture" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-picture.png" alt="">
    </figure>

    <section class="content">
      <nav class="menu-nav">
        <div class="pointer icon-wrapper-region" @click="toggleMenu">
          <MenuIcon/>
        </div>
      </nav>
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span class="text-bold-gold">Word</span> - The Boss Challenge</h1>
        <h1 v-if="userStore.isAuthenticated" class="cinzel-title text-gold">Bonjour {{ userStore.username }}</h1>
      </header>
      <p class="max-width metropolis-font text-gradient text line-height">
        Arriveras-tu à trouver le nom de chaque boss de chaque région ?
      </p>
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click.self="toggleMenu"
      >
        <div class="burger-menu">
          <button @click="logout" class="flex-item-center btn-region">
            <LogoutIcon/>
            <p>Déconnexion</p>
          </button>
          <button @click="goToProfile" class="flex-item-center btn-region">
            <ProfileIcon/>
            <p>Profil</p>
          </button>
        </div>
      </div>
      <p class="max-width metropolis-font text-gradient text line-height">
        Choisis une région !
      </p>
      <section class="regions-scroll">
        <div class="region-grid">
          <div
            v-for="region in regions"
            :key="region.id"
            class="region-card"
            :style="{
              borderColor: regionColors[region.name] || '#ccc',
              boxShadow: isHovering === region.id ? `0 0 15px ${regionColors[region.name]}` : 'none'
            }"
            @mouseenter="isHovering = region.id"
            @mouseleave="isHovering = null"
            @click="goToRegion(region.id)"
          >
            <img class="img-resize" :src="region.image_url" :alt="region.name">
            <p class="region-name">{{ region.name }}</p>
          </div>
        </div>
      </section>
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">
      <img class="second-ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/Elden-ring-ornament-icon-feather-two.png" alt="">
    </section>
  </main>
</template>

<script>
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';


export default {
  name: "RegionPage",
  components: {
    MenuIcon,
    LogoutIcon,
    ProfileIcon
  },
  computed: {
    userStore() {
      return useUserStore();
    }
  },
  data() {
    return {
      isMenuOpen: false,
      regions: [],
      regionColors: {
        "Necrolimbe": "#C19D53",
        "Liurnia": "#72BBFF",
        "Caelid": "#FF7B7B",
      },
      isHovering: null
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async fetchRegions() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/regions`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });
        this.regions = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des régions !", error);
      }
    },
    async logout() {
      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/users/logout`, {}, { withCredentials: true });

        this.userStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error("Erreur lors de la déconnexion !", error);
      }
    },
    goToRegion(regionId) {
      this.$router.push(`/region/${regionId}/levels`);
    },
    goToProfile() {
      this.$router.push('/profile');
    }
  },
  mounted() {
    this.fetchRegions();
  }
}

</script>

<style>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.burger-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.4);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: slideIn 0.3s ease forwards;
}

.btn-region {
  font-family: 'metropolis', sans-serif;
  border: 2px solid #C19D53;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #C19D53;
}

.btn-region:hover {
  background-color: transparent;
  color: #C19D53;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}

.regions-scroll {
  width: 100%;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 10px;
}

.region-card {
  border: 2px solid;
  border-radius: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.region-card:hover {
  transform: scale(1.03);
}

.img-resize {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 480px) {
  .region-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.region-name {
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
  color: white;
  font-family: 'Cinzel', serif;
}

.icon-wrapper-region {
  color: #C19D53;
}

.menu-nav {
  align-self: flex-end;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

</style>