import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple.darken3, 
        secondary: colors.deepPurple.lighten4, 
        accent: colors.deepPurple.accent1, 
        error: colors.red.accent2, 
        info: colors.yellow.lighten5, 
        success: colors.green.darken1, 
        warning:  colors.amber.darken1, 
      }
    }
  }
});
