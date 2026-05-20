import { Outlet, NavLink } from 'react-router-dom'
import { ToastContainer } from '@/components/Toast'
import styles from './Layout.module.scss'

export function Layout() {
  return (
    <div className={styles.layout}>
      <ToastContainer />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Claps</span>
          <svg className={styles.brandStar} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 14l-1.5-5.5L1 7l5.5-1.5z" />
          </svg>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Produtos
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Claps E-Commerce Admin</p>
      </footer>
    </div>
  )
}
