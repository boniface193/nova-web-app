import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#029B97',
        secondary: '#646464',
        heading: '#2B2B2B',
        error: '#E62222',
        success: '#00B944',
        accent: '#52F1EC',
        default: '#000',
        background: '#DDF8F7',
        white: "#ffffff",
      },
    },
    options: {
      customProperties: true
    }
  },
});