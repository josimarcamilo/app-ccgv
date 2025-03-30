// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("isAuthenticated")
  }
  return false
}

// Função para verificar a autenticação com o servidor e obter dados do usuário
export const checkAuthStatus = async () => {
  try {
    const response = await fetch("https://api.orfed.com.br/profile", {
      method: "GET",
      credentials: "include", // Importante para enviar cookies
    })

    if (response.ok) {
      // Se a resposta for bem-sucedida, armazenar os dados do usuário
      const userData = await response.json()
      localStorage.setItem("userData", JSON.stringify(userData))
      return true
    }

    return false
  } catch (error) {
    console.error("Erro ao verificar status de autenticação:", error)
    return false
  }
}

// Função para obter os dados do usuário atual
export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (e) {
        return null
      }
    }
  }
  return null
}

// Função para fazer requisições autenticadas
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Verificar se estamos enviando FormData
  const isFormData = options.body instanceof FormData

  const response = await fetch(`https://api.orfed.com.br${url}`, {
    ...options,
    headers: {
      // Só adicionar Content-Type se não for FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "include", // Importante para enviar cookies de sessão
  })

  // Se a resposta for 401 (não autorizado), podemos redirecionar para a página de login
  if (response.status === 401) {
    // Limpar dados de autenticação
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userData")

      // Redirecionar para a página de login
      window.location.href = "/login"
    }
  }

  return response
}

// Função para fazer logout
export const logout = async () => {
  try {
    // Chamar o endpoint de logout da API
    await fetch("https://api.orfed.com.br/logout", {
      method: "POST",
      credentials: "include", // Importante para enviar cookies
    })
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
  } finally {
    // Limpar dados locais independentemente da resposta da API
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userData")

      // Redirecionar para a página de login
      window.location.href = "/login"
    }
  }
}

// Função para verificar periodicamente o status da sessão
export const setupSessionCheck = (intervalMinutes = 5) => {
  if (typeof window !== "undefined") {
    // Verificar a cada X minutos
    const interval = setInterval(
      async () => {
        const isStillAuthenticated = await checkAuthStatus()

        if (!isStillAuthenticated && localStorage.getItem("isAuthenticated")) {
          // Sessão expirou, redirecionar para login
          localStorage.removeItem("isAuthenticated")
          localStorage.removeItem("userData")
          window.location.href = "/login"
        }
      },
      intervalMinutes * 60 * 1000,
    )

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(interval)
  }

  return () => {} // Função vazia para SSR
}

