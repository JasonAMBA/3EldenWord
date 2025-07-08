<template>
  <main class="container background-homepage">

    <figure class="picture">
      <img class="border shadow custom img-picture" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-picture.png" alt="">
    </figure>
    
    <section class="content">
      <header>
        <h1 class="metropolis-font text-gradient title blur">3Elden<span class="text-bold-gold">Word</span> - The Boss Challenge</h1>
        <h2 class="cinzel-title text-gold">Sans éclat !</h2>
      </header>
      
      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">

      <p class="max-width metropolis-font text-gradient text line-height">
        Tu connais l’univers d’Elden ring sur le bout des doigts ? Si c’est le cas, essaye donc de trouver le nom de chaque boss du jeu !
      </p>

      <img class="ornement" src="https://3eldenword-images.s3.eu-north-1.amazonaws.com/elden-ring-border-leaf.png" alt="">

      <nav class="flex-center">
        <a href="/register">
          <button class="flex-item-center btn-register-homepage">
            <GamepadIcon class=""/>
            <p>S'inscrire</p>
          </button>
        </a>
        <a href="/login">
          <button class="flex-item-center btn-login-homepage">
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
import SwordIcon from '@/components/icons/SwordIcon.vue';
import GamepadIcon from '../components/icons/GamepadIcon.vue';

  export default {
    name: "HomePage",
    components: {
      GamepadIcon,
      SwordIcon
    }
  }
</script>

<style>

.background-homepage {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 9%,
    rgba(0, 57, 33, 0.5) 100%
  );
}

.picture {
  grid-area: picture;
}

/* .blur {
  filter: blur(10px);
} */

.text-gold {
  background: linear-gradient(to right, rgba(193, 157, 83, 1), rgba(193, 157, 83, 0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-bold-gold {
  background: #C19D53;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ornement {
  width: 500px;
  height: auto;
}

.title {
  font-size: 36px;
}

.text {
  font-size: 32px;
}

.max-width {
  max-width: 450px;
  margin: 10px auto;
}



.btn-register-homepage {
  background-color: #C19D53;
  color: white;
  font-family: 'metropolis', sans-serif;
  font-weight: 700;
  letter-spacing: 1.3px;
  font-size: 15px;
  border: 2px solid #C19D53;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-register-homepage:hover {
  background-color: transparent;
  color: #C19D53;
}

.btn-login-homepage {
  background-color: transparent;
  color: #C19D53;
  border: 2px solid #C19D53;
  font-family: 'metropolis', sans-serif;
  font-weight: 700;
  letter-spacing: 1.3px;
  font-size: 15px;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.btn-login-homepage:hover {
  background-color: #C19D53;
  color: white;
}

</style>