import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; onError: () => void }
type State = { failed: boolean }

/** Bascule sur la version 2D si la scène 3D échoue (texture introuvable, GPU indisponible…). */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[3D] Scène désactivée, affichage de la version 2D :', error)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
