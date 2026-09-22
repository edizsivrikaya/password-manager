import { useThemeStore } from '../store/themeStore'
import { MoonIcon, SunIcon } from './Icon'
import Button from './Button'

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="px-2.5"
      title={theme === 'dark' ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
    >
      {theme === 'dark' ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </Button>
  )
}

export default ThemeToggle
