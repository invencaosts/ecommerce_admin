import { Link } from 'react-router-dom'
import styles from './NotFound.module.scss'

export function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para Home</Link>
    </div>
  )
}
