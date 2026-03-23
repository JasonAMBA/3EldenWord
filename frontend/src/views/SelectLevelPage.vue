<template>
  <main class="container" :style="{background: `linear-gradient(to bottom, rgba(0, 0, 0, 1) 9%, ${regionBackgrounds[region.name] || 'rgba(0,57,33,0.5)'} 100%)`}">
    <figure class="picture">
      <img class="border custom img-picture" :src="region.image" alt="">
    </figure>

    <section class="content">
      <nav class="menu-nav">
        <div class="pointer" :style="{color:`${regionColors[region.name]}`}" @click="toggleMenu">
          <MenuIcon/>
        </div>
      </nav>
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span :style="boldGoldStyle">Word</span> - The Boss Challenge</h1>
        <h1 v-if="userStore.isAuthenticated" class="cinzel-title" :style="goldGradientStyle">Bonjour {{ userStore.username }}</h1>
      </header>
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click.self="toggleMenu"
      >
        <div class="burger-menu">
          <button
            @click="logout"
            class="flex-item-center btn-select-level"
            @mouseenter="isHovering = 'logout'"
            @mouseleave="isHovering = null"
            :style="{
              borderColor: regionColors[region.name],
              backgroundColor: isHovering === 'logout' ? 'transparent' : regionColors[region.name],
              color: isHovering === 'logout' ? regionColors[region.name] : 'white'
            }"
          >
            <LogoutIcon />
            <p>Déconnexion</p>
          </button>
          <button
            @click="goToRegions"
            class="flex-item-center btn-select-level"
            @mouseenter="isHoveringRegions = 'region'"
            @mouseleave="isHoveringRegions = null"
            :style="{
              borderColor: regionColors[region.name],
              backgroundColor: isHoveringRegions === 'region' ? 'transparent' : regionColors[region.name],
              color: isHoveringRegions === 'region' ? regionColors[region.name] : 'white'
            }"
          >
            <RegionIcon />
            <p>Menu des régions</p>
          </button>
          <button
            @click="goToProfile"
            class="flex-item-center btn-select-level"
            @mouseenter="isHoveringProfile = 'profile'"
            @mouseleave="isHoveringProfile = null"
            :style="{
              borderColor: regionColors[region.name],
              backgroundColor: isHoveringProfile === 'profile' ? 'transparent' : regionColors[region.name],
              color: isHoveringProfile === 'profile' ? regionColors[region.name] : 'white'
            }"
          >
            <ProfileIcon />
            <p>Profil</p>
          </button>
        </div>
      </div>
      <p class="max-width metropolis-font text line-height" :style="goldGradientStyle">
        Les différents niveau de {{ region.name }}
      </p>
      <div class="progress-wrapper">
        <label class="progress-label" :style="{color: regionColors[region.name]}">
          Progression : {{ progress.completed }}/{{ progress.total }} boss vaincus
        </label>
        <progress class="progress-bar" :class="`progress-${region.name}`" :value="progress.percentage" max="100"></progress>
      </div>
      <section class="levels-container">
        <div
          v-for="boss in bosses"
          :key="boss.id"
          class="level-card"
          @mouseenter="isHovering = boss.id"
          @mouseleave="isHovering = null"
          @click="goToLevel(boss.id)"
          :style="{
            boxShadow: isHovering === boss.id ? `0 0 20px ${regionColors[region.name]}99` : 'none'
          }"
        >
          <img class="level-image" :src="boss.hint1" alt="Indice du boss">
          <p class="level-text" :style="{color:`${regionColors[region.name]}`}">NIV {{ boss.lvl }}</p>
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
import RegionIcon from '@/components/icons/RegionIcon.vue';
import { useUserStore } from '@/stores/userStore';
import { useToastStore } from '@/stores/toastStore';
import axios from 'axios';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';

export default {
  name: 'SelectLevelPage',
  components: {
    MenuIcon,
    LogoutIcon,
    RegionIcon,
    ProfileIcon
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    regionColor() {
      return this.regionColors[this.region.name] || "#ffffff";
    },
    boldGoldStyle() {
      return {
        background: this.regionColor,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      };
    },
    goldGradientStyle() {
      return {
        background: `linear-gradient(to right, ${this.regionColor}, ${this.regionColor}80)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      };
    }
  },
  data() {
    return {
      isMenuOpen: false,
      isHovering: null,
      isHoveringRegions: null,
      isHoveringProfile: null,
      regionId: this.$route.params.id,
      region: {},
      bosses: [],
      progress: {
        completed: 0,
        total: 0,
        percentage: 0
      },
      regionColors: {
        "Necrolimbe": "#C19D53",
        "Liurnia": "#72BBFF",
        "Caelid": "#FF7B7B"
      },
      regionBackgrounds: {
        "Necrolimbe": "rgba(0, 57, 33, 0.5)",
        "Liurnia": "rgba(114, 187, 255, 0.5)",
        "Caelid": "rgba(255, 123, 123, 0.5)"
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async fetchRegionAndBosses() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/boss/regionandbosses/${this.regionId}`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });
        this.region = response.data.region;
        this.bosses = response.data.bosses;
      } catch (error) {
        console.error("Erreur lors de la récupération des niveaux", error);
      }
    },
    async fetchProgress() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/game/progress/${this.regionId}`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });
        this.progress = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération de la progression : ", error);
      }
    },
    async goToLevel(bossId) {
      const toast = useToastStore();
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/game/start-level`, { bossId }, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });

        if (response.data.attemptsLeft !== undefined && response.data.attemptsLeft < 5) {
          toast.show(`Niveau en cours — ${response.data.attemptsLeft} tentative(s) restante(s)`, 'info');
        }

        this.$router.push(`/region/${this.regionId}/level/${bossId}`);
      } catch (error) {
        console.error("Impossible de démarrer le niveau :", error);

        if (error.response && error.response.data && error.response.data.message) {
          toast.show(error.response.data.message, 'error');
        } else {
          toast.show("Une erreur est survenue", 'error');
        }
      }
    },
    goToRegions() {
      this.$router.push('/regions');
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    async logout() {
      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/users/logout`, {}, { withCredentials: true });

        this.userStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error("Erreur lors de la déconnexion !", error);
        this.userStore.logout();
        this.$router.push('/login');
      }
    },
  },
  mounted() {
    this.fetchRegionAndBosses();
    this.fetchProgress();
  }
}
</script>

<style>

.levels-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px 100px;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .levels-container {
    gap: 30px 40px;
  }
}

@media (max-width: 480px) {
  .levels-container {
    gap: 20px;
  }

  .level-text {
    font-size: 20px;
  }
}

.level-card {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.level-card:hover{
  transform: scale(1.05);
}

.level-image{
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5);
}

.level-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Cinzel', serif;
  font-size: 30px;
  
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.btn-select-level {
  font-family: 'metropolis', sans-serif;
  border: 2px solid;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress-wrapper {
  width: 80%;
  margin: 40px auto 10px;
}

.progress-label {
  font-family: 'Metropolis', sans-serif;
  font-size: 18px;
  margin-bottom: 8px;
  display: block;
  text-align: center;
}

.progress-bar {
  width: 50%;
  height: 18px;
  border-radius: 10px;
  background-color: #333;
  overflow: hidden;
}

.progress-bar::-webkit-progress-bar {
  background-color: #222;
  border-radius: 10px;
}

.progress-bar::-webkit-progress-value {
  border-radius: 10px;
  transition: width 0.6s ease-in-out;
}

.progress-Necrolimbe::-webkit-progress-value {
  background-color: #C19D53; /* doré */
}

.progress-Liurnia::-webkit-progress-value {
  background-color: #72BBFF; /* bleu */
}

.progress-Caelid::-webkit-progress-value {
  background-color: #FF7B7B; /* rouge */
}
</style>