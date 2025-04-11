"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Se não estiver autenticado, redirecionar para a página de login
        router.push("/login")
      } else {
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao Sistema CCGV</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Resumo das atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo do card de visão geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Números e métricas importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo do card de estatísticas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo do card de atividades recentes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
