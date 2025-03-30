"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Printer, ArrowLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface CategoryTotal {
  categoria: string
  total: number
}

interface ReportData {
  entradas: CategoryTotal[]
  saidas: CategoryTotal[]
  totalEntradas: number
  totalSaidas: number
}

export default function TransacoesPorCategoriaPage() {
  const [dataInicio, setDataInicio] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [dataFim, setDataFim] = useState<Date>(new Date())
  const [reportData, setReportData] = useState<ReportData>({
    entradas: [],
    saidas: [],
    totalEntradas: 0,
    totalSaidas: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Função para gerar o relatório
  const gerarRelatorio = () => {
    setIsLoading(true)

    // Em um caso real, você faria uma chamada à API
    // Simulando dados para o exemplo
    setTimeout(() => {
      const dadosSimulados: ReportData = {
        entradas: [
          { categoria: "Salário", total: 5000 },
          { categoria: "Reembolso", total: 1250.75 },
          { categoria: "Décimas", total: 3200 },
          { categoria: "Investimentos", total: 450.25 },
        ],
        saidas: [
          { categoria: "Alimentação", total: 1200.5 },
          { categoria: "Transporte", total: 450.75 },
          { categoria: "Água", total: 120 },
          { categoria: "Luz", total: 250.3 },
          { categoria: "Internet", total: 150 },
          { categoria: "Aluguel", total: 1500 },
        ],
        totalEntradas: 9901,
        totalSaidas: 3671.55,
      }

      setReportData(dadosSimulados)
      setIsLoading(false)
    }, 1000)
  }

  // Gerar relatório ao carregar a página ou quando as datas mudarem
  useEffect(() => {
    gerarRelatorio()
  }, [dataInicio, dataFim])

  // Função para imprimir o relatório
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background print:hidden">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/relatorios">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Transações por Categoria</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : <span>Data inicial</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicio}
                      onSelect={(date) => date && setDataInicio(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : <span>Data final</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFim}
                      onSelect={(date) => date && setDataFim(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>

          {/* Cabeçalho para impressão */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-center">Relatório de Transações por Categoria</h1>
            <p className="text-center text-muted-foreground">
              Período: {format(dataInicio, "dd/MM/yyyy", { locale: ptBR })} a{" "}
              {format(dataFim, "dd/MM/yyyy", { locale: ptBR })}
            </p>
            <p className="text-center text-muted-foreground">
              Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
          </div>

          <Card className="print:shadow-none print:border-none">
            <CardHeader>
              <CardTitle>Entradas por Categoria</CardTitle>
              <CardDescription>
                Período: {format(dataInicio, "dd/MM/yyyy", { locale: ptBR })} a{" "}
                {format(dataFim, "dd/MM/yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Categoria</TableHead>
                      <TableHead className="font-medium text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.entradas.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.categoria}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total de Entradas</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          reportData.totalEntradas,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-none">
            <CardHeader>
              <CardTitle>Saídas por Categoria</CardTitle>
              <CardDescription>
                Período: {format(dataInicio, "dd/MM/yyyy", { locale: ptBR })} a{" "}
                {format(dataFim, "dd/MM/yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Categoria</TableHead>
                      <TableHead className="font-medium text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.saidas.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.categoria}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total de Saídas</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          reportData.totalSaidas,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Resumo</h3>
                <Separator className="flex-1 mx-4" />
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-x-4">
                    <span>Total de Entradas:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-500">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        reportData.totalEntradas,
                      )}
                    </span>

                    <span>Total de Saídas:</span>
                    <span className="font-semibold text-red-600 dark:text-red-500">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        reportData.totalSaidas,
                      )}
                    </span>

                    <span>Saldo:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        reportData.totalEntradas - reportData.totalSaidas >= 0
                          ? "text-emerald-600 dark:text-emerald-500"
                          : "text-red-600 dark:text-red-500",
                      )}
                    >
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        reportData.totalEntradas - reportData.totalSaidas,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Estilos para impressão */}
      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}

