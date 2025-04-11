// Função para salvar o token JWT no localStorage
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Função para obter o token JWT do localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Função para remover o token JWT do localStorage (logout)
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("auth_token")
  }
  return false
}

// Função para fazer requisições à API
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = "https://api.orfed.com.br"
  const url = `${baseUrl}${endpoint}`

  // Adiciona o token de autenticação ao header se existir
  const token = getToken()
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  // Adiciona o Content-Type se não for especificado
  if (!options.headers?.["Content-Type"] && !(options.body instanceof FormData)) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    }
  }

  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Ocorreu um erro na requisição")
  }

  return data
}
