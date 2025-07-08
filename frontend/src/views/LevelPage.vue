<template>
  <main class="container" :style="{background: `linear-gradient(to bottom, rgba(0, 0, 0, 1) 9%, ${regionBackgrounds[region.name] || 'rgba(0,57,33,0.5)'} 100%)`}">
    <figure class="picture">
      <img class="border custom img-picture" :src="region.image_url" :style="{filter: `drop-shadow(24px 24px 24px ${regionColors[region.name] || 'rgba(0,0,0,0.25)'})`}" alt="">
    </figure>

    <section class="content">
      <nav class="menu-nav">
        <div class="pointer" :style="{color:`${regionColors[region.name]}`}" @click="toggleMenu">
          <MenuIcon/>
        </div>
      </nav>
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span :style="boldGoldStyle">Word</span> - The Boss Challenge</h1>
        <h1 class="cinzel-title" :style="goldGradientStyle">Trouve le nom du boss !</h1>
      </header>
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
          <button
            @click="goToRegion(region.id)"
            class="flex-item-center logout-btn"
            @mouseenter="isHoveringlevels = 'levels'"
            @mouseleave="isHoveringlevels = null"
            :style="{
              borderColor: regionColors[region.name],
              backgroundColor: isHoveringlevels === 'levels' ? 'transparent' : regionColors[region.name],
              color: isHoveringlevels === 'levels' ? regionColors[region.name] : 'white'
            }"
          >
            <GamepadIcon/>
            <p>Menu des niveaux</p>
          </button>
        </div>
      </div>
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">
      <h1 class="cinzel-title" :style="goldGradientStyle">Lv {{ boss.level }}</h1>
      <div class="grid-indices">
        <img class="img-indice" :style="{filter: `drop-shadow(24px 24px 24px ${regionColors[region.name] || 'rgba(0,0,0,0.25)'})`}" :src="boss.hint1" alt="indice 1" />
        <img class="img-indice" :style="{filter: `drop-shadow(24px 24px 24px ${regionColors[region.name] || 'rgba(0,0,0,0.25)'})`}" :src="boss.hint2" alt="indice 2" />
        <img class="img-indice" :style="{filter: `drop-shadow(24px 24px 24px ${regionColors[region.name] || 'rgba(0,0,0,0.25)'})`}" :src="boss.hint3" alt="indice 3" />
      </div>
      <div class="guess-container">
        <input 
          v-model="guess"
          type="text"
          placeholder="Quel est le nom du boss ?"
          class="guess-input"
        />
        <button @click="makeGuess" class="submit-btn">Valider</button>
      </div>
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">
      <img class="second-ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/Elden-ring-ornament-icon-feather-two.png" alt="">
    </section>
  </main>
</template>

<script>
import GamepadIcon from '@/components/icons/GamepadIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import RegionIcon from '@/components/icons/RegionIcon.vue';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';


export default {
  name: 'LevelPage',
  components: {
    MenuIcon,
    LogoutIcon,
    RegionIcon,
    GamepadIcon
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
      regionId: this.$route.params.regionId,
      bossId: this.$route.params.bossId,
      isHoverLogout: false,
      isHovering: null,
      isHoveringRegions: null,
      isHoveringlevels: null,
      message:'',
      error:'',
      guess:'',
      correctImage:'',
      boss: {
        level: null,
        hint1: '',
        hint2: '',
        hint3: '',
        realImage:''
      },
      region: {},
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
    };
  },
  methods: {
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
    async fetchBossData() {
      try {
        const response = await axios.get(`http://localhost:4000/boss/${this.bossId}`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });
        const data = response.data;
        this.boss.level = data.level;
        this.boss.hint1 = data.image_hint1;
        this.boss.hint2 = data.image_hint2;
        this.boss.hint3 = data.image_hint3;
        this.boss.realImage = data.real_image;
      } catch (err) {
        console.error("Erreur lors de la récupération des images du boss : ", err);
      }
    },
    async fetchRegionData() {
      try {
        const response = await axios.get(`http://localhost:4000/regions/${this.regionId}`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });

        this.region = response.data
      } catch (err) {
        console.error("Erreur lors de la récupération de la région : ", err);
      }
    },
    async makeGuess() {
      try {
        const response = await axios.post('http://localhost:4000/game/guess-boss', {
          bossId: this.bossId,
          guess: this.guess
        }, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });
        this.message = response.data.message;
        this.error = '';

        // Si bonne réponse
        if (response.data.correctAnswerImage) {
          this.correctImage = response.data.correctAnswerImage;
          alert("Bravo ! Tu as deviné le bon boss ! 🔥");

          setTimeout(() => {
            this.$router.push(`/region/${this.regionId}/levels`);
          }, 2000)
        } else {
          // Mauvaise réponse
          alert(`${response.data.message} (${response.data.attemptsLeft} tentatives restantes)`);
        }

      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.message;

          if (status === 429) {
            alert("Attends 3 secondes avant de réessayer !")
          } else if (status === 403) {
            alert(`${message}\nRetour à la sélection des niveaux...`);
            setTimeout(() => {
              this.$router.push(`/region/${this.regionId}/levels`);
            }, 2000);
          } else {
            alert(message)
          }
        } else {
          alert("Erreur de connexion au serveur !")
        }
      }
    },
    goToRegions() {
      this.$router.push('/regions');
    },
    goToRegion(regionId) {
      this.$router.push(`/region/${regionId}/levels`);
    },
    async logout() {
      try {
        await axios.post("http://localhost:4000/users/logout", {}, {withCredentials: true});

        this.userStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error("Erreur lors de la déconnexion !", error);
      }
    }
  },
  mounted() {
    this.fetchBossData();
    this.fetchRegionData();
  }
}

</script>

<style>

.grid-indices {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.img-indice {
  width: 250px;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
}

.guess-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guess-input {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  width: 300px;
  margin-bottom: 10px;
}

.guess-input::placeholder {
  color: rgba(255, 215, 0, 0.7); /* doré pâle */
  font-style: italic;
  font-weight: 500;
  letter-spacing: 1px;
  font-family: 'Cinzel', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}



.submit-btn {
  background-color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  border-radius: 10px;
  cursor: pointer;
}



</style>