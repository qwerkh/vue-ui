import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import {store} from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret,faUser,faBuilding,faExchangeAlt,faTimes,faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueProgressiveImage from 'vue-progressive-image'

library.add(faUserSecret,faUser,faBuilding,faExchangeAlt,faTimes,faEllipsisV);
 
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(require('vue-moment'));
Vue.use(VueProgressiveImage,{
  blur: 30
})

import * as VueGoogleMaps from 'vue2-google-maps'
 
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBtsxSgIdKE7-GIvgYfj31KTtsMMJOUjBI',
    libraries: 'places,drawing,visualization', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  autobindAllEvents: true,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
