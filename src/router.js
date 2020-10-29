import Vue from 'vue'
import Router from 'vue-router'
import {store} from './store/store'
import WelcomePage from './views/About.vue';
Vue.use(Router)
//All routes need meta
//So it is required to input meta
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'WelcomePage',
        meta: {
            enName: "The Cake",
            khName: "The Cake"
        },
        component: () => import('./views/WelcomePage.vue')
    },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: WelcomePage
        },
        {
            path: "/login",
            name: "Login",
            meta: {
                enName: "Login",
                khName: "ចូលប្រើប្រាស់"
            },
            component: () => import('./components/Login.vue'),
        },
        //store
        {
            path: "/stores",
            name: "Stores",
            meta: {
                enName: "Stores",
                khName: "ហាងទាំងអស់"
            },
            component: () => import('./views/Store.vue')
        },
        {
            path: "/stores/add",
            name: "Add Store",
            meta: {
                enName: "Add Store",
                khName: "បង្កើតហាងថ្មី"
            },
            component: () => import('./components/store/AddStore.vue')
        },
        {
            path: "/stores/add/:id",
            name: "Edit Store",
            meta: {
                enName: "Edit Store",
                khName: "កែប្រែហាង"
            },
            component: () => import('./components/store/AddStore.vue')
        },
        //sale dashbaord
        {
            path: "/sale",
            name: 'Sale',
            meta: {
                enName: "Sale",
                khName: "លក់"
            },
            component: () => import('./views/Sale.vue')
        },
        //settings 
        {
            path: "/settings",
            name: 'settings',
            meta: {
                enName: "Settings",
                khName: "ការកំណត់"
            },
            component: () => import('./views/Settings'),
        },
        //users
        {
            path: "/users/add",
            name: 'add_user',
            meta: {
                enName: "Add user",
                khName: "បង្កើតអ្នកប្រើប្រាស់"
            },
            component: () => import('./components/settings/AddUser.vue')
        },
        {
            path: "/users/:id/edit",
            name: 'edit_user',
            meta: {
                enName: "Edit user",
                khName: "កែប្រែអ្នកប្រើប្រាស់"
            },
            component: () => import('./components/settings/EditUser.vue')
        },
        ///Category
        {
            path: "/categories/add",
            name: "Add Category",
            meta: {
                enName: "Add Category",
                khName: "បង្កើតផ្នែកថ្មី"
            },
            component: () => import('./components/settings/AddCategory')
        },
        {
            path: "/categories/:id/edit",
            name: "Edit Category",
            meta: {
                enName: "Edit Category",
                khName: "កែប្រែផ្នែក"
            },
            component: () => import('./components/settings/AddCategory')
        },
        ///Products
        {
            path: "/products/add",
            name: "Add Product",
            meta: {
                enName: "Add Product",
                khName: "បន្ថែមទំនិញ"
            },
            component: () => import('./components/settings/AddProduct')
        },
        {
            path: "/products/:id/edit",
            name: "Edit Product",
            meta: {
                enName: "Edit Product",
                khName: "កែប្រែទំនិញ"
            },
            component: () => import('./components/settings/AddProduct')
        },
        {
            path: "/products/:id/show",
            name: "Show Product",
            meta: {
                enName: "Show Product",
                khName: "បង្ហាញទំនិញ"
            },
            component: () => import('./components/settings/ShowProduct')
        },
        ///handle not authorize user
        {
            path: "/not-authorize",
            name: 'not_authorize',
            meta: {
                enName: "Not Authorize",
                khName: "មិនមានសិទ្ធ"
            },
            component: () => import('./views/NotAuthorize')

        },
        //handle path not found
        //redirect to /login
        {path: "*", redirect: "/login"}

    ]
})
router.beforeEach((to, from, next) => {
    const exceptionRoutes = ['Login', 'Register']
    if (exceptionRoutes.includes(to.name)) {
        if (store.state.user.user != null && !store.state.user.user.profile.approved) {
            next('/not-authorize');
        }
        next();
    } else if (store.state.user.user == null) {
        next('/login')
    }
    next();
});
export default router;