import { ref } from 'vue'

const isDarkTheme = ref(false)

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('dark-theme', isDarkTheme.value)
}

export default {
  isDarkTheme,
  toggleTheme
}
