import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors'


Vue.use(Vuetify)

const opts = {}

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#4527A0', // deep-purple darken-3
                secondary: '#D1C4E9', // deep-purple lighten-4
                accent: '#B388FF', //deep-purple accent-1
                error: '#FF5252', //red accent-2
                info: '#FFFDE7', //'yellow lighten-5
                success: '#4CAF50', //green 
                warning: '#FFC107' //amber
            },
        },
    },
})