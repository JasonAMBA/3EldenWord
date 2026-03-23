<template>
  <main class="container background-login">

    <figure class="picture">
      <img class="border shadow custom img-picture" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden+ring+picture+login.png" alt="">
    </figure>

    <section class="content">
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span class="text-bold-blue">Word</span> - The Boss Challenge</h1>
        <h2 class="cinzel-title text-blue">Connexion</h2>
      </header>
      
      <form class="form metropolis-font">
        <fieldset class="form-group">
          <label class="text-gradient" for="username">Username</label>
          <input type="text" id="username" v-model="logUser.username" placeholder="Entrer votre username">
        </fieldset>

        <fieldset class="form-group">
          <label class="text-gradient" for="password">Mot de passe</label>
          <input type="password" id="password" v-model="logUser.password" placeholder="Entrer votre mot de passe">
        </fieldset>

        <button class="flex-item-center btn-login" @click.prevent="login">
          <SwordIcon/>
          <p>Connexion</p>
        </button>
      </form>

      <p v-if="successMessage" style="color: lightgreen">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

      <nav class="flex-center">
        <a href="/">
          <button class="flex-item-center btn-homepage-login">
            <HomeIcon/>
            <p>Page d'accueil</p>
          </button>
        </a>
        <a href="/register">
          <button class="flex-item-center btn-login">
            <GamepadIcon/>
            <p>S'inscrire</p>
          </button>
        </a>
      </nav>

      <img class="second-ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/Elden-ring-ornament-icon-feather-two.png" alt="">
    </section>
  </main>
</template>

<script>
import GamepadIcon from '@/components/icons/GamepadIcon.vue';
import HomeIcon from '@/components/icons/HomeIcon.vue';
import SwordIcon from '@/components/icons/SwordIcon.vue';
import { useUserStore } from '@/stores/userStore';
import { useToastStore } from '@/stores/toastStore';
import axios from 'axios';


export default {
  name: "LoginPage",
  components: {
    GamepadIcon,
    HomeIcon,
    SwordIcon
  },
  data() {
    return {
      logUser: { username: '', password: '' },
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async login() {
      this.errorMessage = ''
      this.successMessage = ''
      const toast = useToastStore();
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/users/login`, this.logUser, { withCredentials: true });

        const userStore = useUserStore();
        userStore.login(response.data.accessToken, response.data.username);

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
    }
  }
}
</script>

<style>

.background-login {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 9%,
    rgba(0, 2, 120, 0.7) 100%
  );
}

.text-blue {
  background: linear-gradient(to right, rgba(0, 132, 255, 1), rgba(0, 132, 255, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-bold-blue {
  background: #0084ff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-login {
  font-family: 'metropolis', sans-serif;
  background-color: #0084ff;
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.3px;
  border: 2px solid #0084ff;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-login:hover {
  background-color: transparent;
}

.btn-homepage-login {
  background-color: transparent;
  color: white;
  border: 2px solid #0084ff;
  font-family: 'metropolis', sans-serif;
  font-weight: 700;
  letter-spacing: 1.3px;
  font-size: 15px;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-homepage-login:hover {
  background-color: #0084ff;
}

</style>