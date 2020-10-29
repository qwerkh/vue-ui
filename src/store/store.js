import Vuex from 'vuex';
import Vue from 'vue';
import { OrderItems } from './order_items/order_items';
import { User } from './user/user'
import {provider} from "../service/provider";
Vue.use(Vuex);
export const store = new Vuex.Store({
  modules: {
    orderItem: OrderItems,
    user: User,

  },
  state: {
    count: 1,
    dropdownMenu: [
      {
        enName: "Settings",
        khName: "ការកំណត់",
        path: "/settings",
        icon: "",
        svg: "",
        isShowing: (roles) => provider.isAdmin(roles) || provider.isSuper(roles) || provider.isGM(roles)
      },
      {
        enName: "Stores",
        khName: "ហាង",
        path: "/stores",
        icon: "",
        svg: "",
        isShowing: (roles) => provider.isSuper(roles)
      }
    ]
  },

})