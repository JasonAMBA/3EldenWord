import axios from "axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || '',
    isAuthenticated: !!localStorage.getItem("accessToken"),
    username: localStorage.getItem("username")
  }),
  actions: {
    login(token, username) {
      this.accessToken = token;
      this.username = username;
      this.isAuthenticated = true;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("username", username);
    },
    logout() {
      this.accessToken = '';
      this.username = '';
      this.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
    },
    async refreshToken() {
      try {
        const response = await axios.post('http://localhost:4000/users/refresh-token', {}, {withCredentials:true});
        this.accessToken = response.data.newAccessToken;

        localStorage.setItem("accessToken", response.data.newAccessToken);
      } catch (error) {
        console.error("Erreur lors du rafraichissement du token : ", error);
      }
    }
  }
});