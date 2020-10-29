import Vue from 'vue'
import Element from 'element-ui'
import '../element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
Vue.use(Element, { locale })