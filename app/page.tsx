"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Se não estiver autenticado, redirecionar para a página de login
        router.push("/login")
      } else {
        // Obter o token de forma segura apenas no lado do cliente
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("auth_token")
          setToken(storedToken)
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Sistema CCGV</h1>
        <p className="text-xl mb-4">Você está logado com sucesso!</p>
        {token && <p>Token de autenticação: {token.substring(0, 20)}...</p>}
      </div>
    </main>
  )
}
