<template>
  <main class="container" :style="{background: `linear-gradient(to bottom, rgba(0, 0, 0, 1) 9%, ${regionBackgrounds[region.name] || 'rgba(0,57,33,0.5)'} 100%)`}">
    <figure class="picture">
      <img class="border custom img-picture" :src="region.image" :style="{filter: `drop-shadow(24px 24px 24px ${regionColors[region.name] || 'rgba(0,0,0,0.25)'})`}" alt="">
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
            class="flex-item-center logout-btn"
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
            class="flex-item-center logout-btn"
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
import axios from 'axios';

  export default {
    name: 'SelectLevelPage',
    components: {
      MenuIcon,
      LogoutIcon,
      RegionIcon
    },
    computed: {
      userStore() {
        return useUserStore();
      },
      regionColors2() {
        return {
          "Necrolimbe": "#C19D53",
          "Liurnia": "#72BBFF",
          "Caelid": "#FF7B7B",
        };
      },
      regionColor() {
        return this.regionColors2[this.region.name] || "#ffffff";
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
        isHoverLogout: false,
        isHovering: null,
        isHoveringRegions: null,
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
          "Necrolimbe": "rgba(0, 57, 33, 0.5)",     // Or doré
          "Liurnia": "rgba(114, 187, 255, 0.5)",       // Bleu lumineux
          "Caelid": "rgba(255, 123, 123, 0.5)"         // Rouge maudit
        }
      }
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      async fetchRegionAndBosses() {
        try {
          const response = await axios.get(`http://localhost:4000/boss/regionandbosses/${this.regionId}`, {
            withCredentials: true,
            headers: {
              Authorization: `${this.userStore.accessToken}`
            }
          });
          this.region = response.data.region;
          this.bosses = response.data.bosses;
        } catch (error) {
          console.error("Erreur lors de la récupération des niveaux");
          
        }
      },
      async fetchProgress() {
        try {
          const response = await axios.get(`http://localhost:4000/game/progress/${this.regionId}`, {
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
        try {
          await axios.post("http://localhost:4000/game/start-level", {bossId}, {
            withCredentials: true,
            headers: {
              Authorization: `${this.userStore.accessToken}`
            }
          });

          // Si le niveau est bien lancé, on redirige
          this.$router.push(`/region/${this.regionId}/level/${bossId}`);
        } catch (error) {
          console.error("Impossible de démarrer le niveau :", error);

          if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
          } else {
            alert("Une erreur est survenue");
          }
        }
      },
      goToRegions() {
        this.$router.push('/regions');
      },
      async logout() {
        try {
          await axios.post("http://localhost:4000/users/logout", {}, {withCredentials: true});

          this.userStore.logout();
          this.$router.push('/login');
        } catch (error) {
          console.error("Erreur lors de la déconnexion !", error);
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

.level-card {
  position: relative;
  width: 200px;
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
  filter: brightness(0.5); /* Assombrit l'image pour mieux voir le texte */
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