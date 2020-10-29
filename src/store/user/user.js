
export const User = {
    state: {
        token: "",
        user: null,
        activeStore: null,
        stores: [
            // /// can add more properties to this
            // {
            //     _id: 1,
            //     svgPath: "appbar/icons8-details.svg",
            //     tooltips: "", //can be the name of each store,
            //
            // },
            // {
            //     _id: 2,
            //     svgPath: "appbar/icons8-keypad.svg",
            //     tooltips: "" //can be the name of each store
            // },
            // {   _id: 3,
            //     svgPath: "appbar/icons8-technology_lifestyle.svg",
            //     tooltips: "" //can be the name of each store
            // },
            // {
            //     _id: 4,
            //     svgPath: "appbar/icons8-home.svg",
            //     tooltips: "" //can be the name of each store
            // },
        ] // this is used to add store to sidebar
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.user = payload.user;
            state.stores = payload.user.stores.map(map => ({_id: map._id , shortcutName: map.shortcutName}))
            state.activeStore = state.stores.length > 0 ? state.stores[0]._id : null;
        },
        unSetUser(state) {
            state.user = null;
            state.token=null;
            state.stores = [];
            state.activeStore = null;
        },
        setActiveStore(state,payload){
            state.activeStore = payload._id;
        }
    },
    actions: {
        setUser(context, payload) {
            if (payload && payload.profile.approved) {
                context.commit('setUser', payload);
            }
        },
        unSetUser(context){
            context.commit('unSetUser');
        },
        setActiveStore(context, payload) {
            context.commit('setActiveStore', payload);
        }
    }
}