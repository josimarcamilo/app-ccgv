"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
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
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <CardDescription>Total de usuários ativos no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 desde o último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <CardDescription>Receita total do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 17.329,00</div>
            <p className="text-xs text-muted-foreground">+2.1% desde o último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <CardDescription>Total de vendas no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+249</div>
            <p className="text-xs text-muted-foreground">+19% desde o último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <CardDescription>Tarefas que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-4 desde ontem</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Novo usuário registrado</p>
                <p className="text-sm text-muted-foreground">João Silva criou uma conta</p>
                <p className="text-xs text-muted-foreground">Hoje às 14:32</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Venda realizada</p>
                <p className="text-sm text-muted-foreground">Venda #1234 foi finalizada</p>
                <p className="text-xs text-muted-foreground">Hoje às 11:15</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Novo produto adicionado</p>
                <p className="text-sm text-muted-foreground">Produto "Cadeira Ergonômica" foi adicionado</p>
                <p className="text-xs text-muted-foreground">Ontem às 16:45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>Tarefas que precisam ser concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Atualizar catálogo de produtos</p>
                <p className="text-sm text-muted-foreground">Prazo: 25/04/2023</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Revisar relatório mensal</p>
                <p className="text-sm text-muted-foreground">Prazo: 30/04/2023</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Reunião com fornecedores</p>
                <p className="text-sm text-muted-foreground">Prazo: 02/05/2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
