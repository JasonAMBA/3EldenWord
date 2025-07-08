<template>
  <main class="container background-register">

    <figure class="picture">
      <img class="border shadow custom img-picture" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-picture-register.png" alt="">
    </figure>
    
    <section class="content">
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span class="text-bold-red">Word</span> - The Boss Challenge</h1>
        <h2 class="cinzel-title text-red">Inscription</h2>
      </header>
      
      <form class="form metropolis-font">
        <fieldset class="form-group">
          <label class="text-gradient" for="username">Username</label>
          <input type="text" id="username" v-model="newUser.username" placeholder="Entrer votre username">
        </fieldset>

        <fieldset class="form-group">
          <label class="text-gradient" for="email">Email</label>
          <input type="email" id="email" v-model="newUser.email" placeholder="Entrer votre email">
        </fieldset>

        <fieldset class="form-group">
          <label class="text-gradient" for="password">Mot de passe</label>
          <input type="password" id="password" v-model="newUser.password" placeholder="Entrer votre mot de passe">
        </fieldset>

        <button class="flex-item-center btn-register" @click.prevent="register">
          <GamepadIcon/>
          <p>S'inscrire</p>
        </button>
      </form>

      <p v-if="successMessage" style="color: lightgreen">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

      <nav class="flex-center">
        <a href="/">
          <button class="flex-item-center btn-register">
            <HomeIcon/>
            <p>Page d'accueil</p>
          </button>
        </a>
        <a href="/login">
          <button class="flex-item-center btn-login-register">
            <SwordIcon/>
            <p>Se connecter</p>
          </button>
        </a>
      </nav>

      <img class="second-ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/Elden-ring-ornament-icon-feather-two.png" alt="">
    </section>
  </main>
</template>

<script>
import GamepadIcon from '../components/icons/GamepadIcon.vue';
import SwordIcon from '@/components/icons/SwordIcon.vue';
import HomeIcon from '../components/icons/HomeIcon.vue';
import axios from 'axios';

  export default {
    name: "RegisterPage",
    components: {
      GamepadIcon,
      SwordIcon,
      HomeIcon
    },
    data() {
      return {
        newUser: {username: '', email:'', password:''},
        errorMessage: '',
        successMessage: ''
      }
    },
    methods: {
      async register() {
        this.errorMessage = ''
        this.successMessage = ''
        try {
          const response = await axios.post('http://localhost:4000/users/register', this.newUser);

          this.successMessage = response.data.message
          alert(this.successMessage)
          this.$router.push('/login') // redirection vers la page de connexion

        } catch (error) {
          console.log(error);
          if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message
          } else {
            this.errorMessage = 'Une erreur inconnue est survenue'
          }
        }
      }
    }
  }
</script>

<style>

.background-register {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 9%,
    rgba(255, 2, 2, 0.7) 100%
  );
}

.text-red {
  background: linear-gradient(to right, rgba(255, 2, 2, 1), rgba(255, 2, 2, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-bold-red {
  background: #FF0202;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-register {
  font-family: 'metropolis', sans-serif;
  background-color: #FF0202;
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.3px;
  border: 2px solid #FF0202;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-register:hover {
  background-color: transparent;
}

.btn-login-register {
  background-color: transparent;
  color: white;
  border: 2px solid #FF0202;
  font-family: 'metropolis', sans-serif;
  font-weight: 700;
  letter-spacing: 1.3px;
  font-size: 15px;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-login-register:hover {
  background-color: #FF0202;
}
</style>