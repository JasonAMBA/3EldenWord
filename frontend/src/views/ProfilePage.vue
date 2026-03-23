<template>
  <main class="container background-profile">

    <figure class="picture">
      <img class="border shadow custom img-picture" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden+ring+picture+account.png" alt="">
    </figure>

    <section class="content">
      <nav class="menu-nav">
        <div class="pointer icon-wrapper-profile" @click="toggleMenu">
          <MenuIcon/>
        </div>
      </nav>
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span class="text-bold-blue">Word</span> - The Boss Challenge</h1>
        <h2 class="cinzel-title text-blue">Mon compte</h2>
      </header>

      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click.self="toggleMenu"
      >
        <div class="burger-menu">
          <button @click="logout" class="flex-item-center btn-profile">
            <LogoutIcon/>
            <p>Déconnexion</p>
          </button>
          <button @click="goToRegions" class="flex-item-center btn-profile">
            <RegionIcon />
            <p>Menu des régions</p>
          </button>
        </div>
      </div>

      <form class="form metropolis-font">
        <fieldset class="form-group">
          <label class="text-gradient" for="username">Username</label>
          <input type="text" id="username" v-model="updateUser.username" :placeholder="userStore.username">
        </fieldset>

        <fieldset class="form-group">
          <label class="text-gradient" for="email">Email</label>
          <input type="email" id="email" v-model="updateUser.email" placeholder="Entrer votre email">
        </fieldset>

        <fieldset class="form-group">
          <label class="text-gradient" for="password">Mot de passe</label>
          <input type="password" id="password" v-model="updateUser.password" placeholder="Entrer votre nouveau mot de passe">
        </fieldset>

        <button class="flex-item-center btn-update" @click.prevent="update">
          <SwordIcon/>
          <p>Modifier</p>
        </button>
      </form>

      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

      <div v-if="!showDeleteConfirm">
        <button class="flex-item-center btn-delete" @click="showDeleteConfirm = true">
          <p>Supprimer mon compte</p>
        </button>
      </div>

      <div v-else class="delete-confirm metropolis-font">
        <p class="text-gradient">Voulez-vous vraiment supprimer votre compte ?</p>
        <div class="flex-item-center">
          <button class="btn-delete" @click="deleteUser">Confirmer</button>
          <button class="btn-cancel" @click="showDeleteConfirm = false">Annuler</button>
        </div>
      </div>
    </section>

  </main>
</template>

<script>
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import RegionIcon from '@/components/icons/RegionIcon.vue';
import SwordIcon from '@/components/icons/SwordIcon.vue';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

export default {
  name: "ProfilePage",
  components: {
    MenuIcon,
    LogoutIcon,
    RegionIcon,
    SwordIcon
  },
  computed: {
    userStore() {
      return useUserStore();
    }
  },
  data() {
    return {
      isMenuOpen: false,
      updateUser: { username: '', email: '', password: '' },
      errorMessage: '',
      showDeleteConfirm: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async update() {
      this.errorMessage = '';
      const toast = useToastStore();
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_URL}/users/update`, this.updateUser, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });

        if (this.updateUser.username) {
          this.userStore.username = this.updateUser.username;
          localStorage.setItem('username', this.updateUser.username);
        }

        this.updateUser = { username: '', email: '', password: '' };
        toast.show(response.data.message, 'success');
        this.$router.push('/regions');
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Une erreur inconnue est survenue';
        }
      }
    },
    goToRegions() {
      this.$router.push('/regions');
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
    async deleteUser() {
      const toast = useToastStore();
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_URL}/users/delete`, {
          withCredentials: true,
          headers: {
            Authorization: `${this.userStore.accessToken}`
          }
        });

        toast.show(response.data.message, 'success');
        this.userStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error("Erreur lors de la suppression du compte !", error);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Une erreur inconnue est survenue';
        }
      }
    }
  }
}
</script>

<style>

.background-profile {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 9%,
    rgba(0, 66, 120, 0.7) 100%
  );
}

.text-blue {
  background: linear-gradient(to right, rgba(0, 66, 120, 1), rgba(0, 66, 120, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-bold-blue {
  background: #004278;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-update {
  font-family: 'metropolis', sans-serif;
  background-color: #004278;
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.3px;
  border: 2px solid #004278;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-update:hover {
  background-color: transparent;
  color: #004278;
}

.icon-wrapper-profile {
  color: #004278;
}

.menu-nav {
  align-self: flex-end;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

.btn-profile {
  font-family: 'metropolis', sans-serif;
  border: 2px solid #004278;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #004278;
}

.btn-profile:hover {
  background-color: transparent;
  color: #004278;
}

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

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}

.btn-delete {
  font-family: 'metropolis', sans-serif;
  background-color: #8B0000;
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.3px;
  border: 2px solid #8B0000;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-delete:hover {
  background-color: transparent;
  color: #8B0000;
}

.btn-cancel {
  font-family: 'metropolis', sans-serif;
  background-color: transparent;
  color: #aaa;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.3px;
  border: 2px solid #aaa;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-cancel:hover {
  background-color: #aaa;
  color: white;
}

.delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
