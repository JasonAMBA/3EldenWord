import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    type: 'info',
    visible: false,
    _timer: null
  }),
  actions: {
    show(message, type = 'info', duration = 3500) {
      if (this._timer) clearTimeout(this._timer);

      this.message = message;
      this.type = type;
      this.visible = true;

      this._timer = setTimeout(() => {
        this.visible = false;
      }, duration);
    }
  }
});
