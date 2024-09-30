import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ClientesView from '@/views/Cliente/ClientesView.vue'
import ServicosView from '@/views/Servico/ServicosView.vue'
import GastosView from '@/views/Gasto/GastosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cliente',
      name: 'Clientes',
      component: ClientesView
    },
    {
      path: '/servicos/:clienteId/:clientName',
      name: 'Servicos',
      component: ServicosView
    },
    {
      path: '/gastos',
      name: 'gastos',
      component: GastosView
    }
  ]
})

export default router
