import { Navigate } from 'react-router'
import { useVaultStore } from '../store/vaultStore'

function ProtectedRoute({ children }) {
  const isUnlocked = useVaultStore((state) => state.isUnlocked)

  if (!isUnlocked) {
    return <Navigate to="/unlock" replace />
  }

  return children
}

export default ProtectedRoute
