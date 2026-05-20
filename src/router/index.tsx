import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home/Home'
import { NotFound } from '@/pages/NotFound/NotFound'
import { ProductFormPage } from '@/pages/ProductFormPage'
import { ProductListPage } from '@/pages/ProductListPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products',          element: <ProductListPage /> },
      { path: 'products/new',      element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
