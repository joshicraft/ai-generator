import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/chat',
            component: () => import('./views/Chat.vue')
        },
        {
            path: '/about',
            component: () => import('./views/About.vue')
        }
    ]
})

const app = createApp(App)

app.use(router)

app.mount('#app')