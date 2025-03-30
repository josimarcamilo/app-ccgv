"use client"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileBarChart, FileText, BarChart2 } from "lucide-react"
import Link from "next/link"

export default function RelatoriosPage() {
  const relatorios = [
    {
      id: "transacoes-por-categoria",
      title: "Transações por Categoria",
      description: "Relatório de transações agrupadas por categoria, separando entradas e saídas.",
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      href: "/relatorios/transacoes-por-categoria",
    },
    {
      id: "fluxo-de-caixa",
      title: "Fluxo de Caixa",
      description: "Relatório de fluxo de caixa com entradas, saídas e saldo por período.",
      icon: <FileBarChart className="h-8 w-8 text-primary" />,
      href: "#",
      disabled: true,
    },
    {
      id: "extrato-por-conta",
      title: "Extrato por Conta",
      description: "Relatório detalhado de movimentações por conta.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      href: "#",
      disabled: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatorios.map((relatorio) => (
              <Card key={relatorio.id} className={relatorio.disabled ? "opacity-60" : ""}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="mt-1">{relatorio.icon}</div>
                  <div className="space-y-1">
                    <CardTitle>{relatorio.title}</CardTitle>
                    <CardDescription>{relatorio.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {relatorio.disabled ? (
                    <Button variant="outline" className="w-full" disabled>
                      Em breve
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href={relatorio.href}>Gerar Relatório</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

