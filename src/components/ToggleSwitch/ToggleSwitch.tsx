import styles from './ToggleSwitch.module.scss'

interface ToggleSwitchProps {
  checked: boolean
  label: string
  onChange: () => void
}

export function ToggleSwitch({ checked, label, onChange }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={styles.root}
    >
      <span className={`${styles.track} ${checked ? styles.trackOn : styles.trackOff}`}>
        <span className={styles.knob} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
