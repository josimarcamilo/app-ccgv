"use client"

import { useState, useEffect } from "react"
import { format, addMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts"
import { DayPicker } from "react-day-picker"
import { isAuthenticated, checkAuthStatus, setupSessionCheck, getCurrentUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function Home() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está autenticado localmente
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    // Verificar com o servidor se a sessão ainda é válida e obter dados do usuário
    const verifySession = async () => {
      setIsLoading(true)
      const isValid = await checkAuthStatus()

      if (!isValid) {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userData")
        router.push("/login")
        return
      }

      // Obter dados do usuário
      const user = getCurrentUser()
      if (user && user.name) {
        setUserName(user.name)
      }

      setIsLoading(false)

      // Mostrar toast de boas-vindas
      toast({
        title: "Bem-vindo",
        description: `Olá, ${user?.name || "usuário"}! Bem-vindo ao Sistema CCGV.`,
      })
    }

    verifySession()

    // Configurar verificação periódica da sessão
    const cleanupSessionCheck = setupSessionCheck()

    return () => {
      cleanupSessionCheck()
    }
  }, [router])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [totalBalance, setTotalBalance] = useState(24231)
  const [receivableBalance, setReceivableBalance] = useState(8213)
  const [expenses, setExpenses] = useState(4251)

  // Dados para o gráfico de entradas e saídas
  const [incomeExpenseData, setIncomeExpenseData] = useState([
    { name: "Jan", entrada: 12500, saida: 8200 },
    { name: "Fev", entrada: 13100, saida: 8400 },
    { name: "Mar", entrada: 14200, saida: 9100 },
    { name: "Abr", entrada: 15800, saida: 9300 },
    { name: "Mai", entrada: 16200, saida: 9800 },
    { name: "Jun", entrada: 15900, saida: 10200 },
  ])

  // Dados para o gráfico de projeção
  const [projectionData, setProjectionData] = useState<Array<{ name: string; saldo: number }>>([])

  // Em um caso real, você buscaria esses dados do backend
  useEffect(() => {
    if (isLoading) return

    // Simulação de busca de dados
    const fetchData = async () => {
      // Aqui você faria uma chamada API real
      // const response = await fetchWithAuth('/dashboard-data?date=' + format(selectedDate, 'yyyy-MM'))
      // const data = await response.json()

      // Simulando dados diferentes para cada mês
      const monthIndex = selectedDate.getMonth()
      const multiplier = ((monthIndex % 3) + 1) * 0.9

      setTotalBalance(Math.round(24231 * multiplier))
      setReceivableBalance(Math.round(8213 * multiplier))
      setExpenses(Math.round(4251 * multiplier))

      // Gerar dados de projeção
      generateProjectionData()
    }

    fetchData()
  }, [selectedDate, isLoading])

  // Gerar dados de projeção baseados no saldo atual e despesas médias
  const generateProjectionData = () => {
    const averageMonthlyExpense = 4500 // Despesa média mensal
    let remainingBalance = totalBalance
    const data = []

    const currentMonth = new Date()
    let month = currentMonth

    // Projetar até 12 meses ou até o saldo ficar negativo
    for (let i = 0; i < 12; i++) {
      data.push({
        name: format(month, "MMM", { locale: ptBR }),
        saldo: Math.round(remainingBalance),
      })

      remainingBalance -= averageMonthlyExpense

      // Se o saldo ficar negativo, parar a projeção
      if (remainingBalance <= 0) {
        data.push({
          name: format(addMonths(month, 1), "MMM", { locale: ptBR }),
          saldo: Math.round(remainingBalance),
        })
        break
      }

      month = addMonths(month, 1)
    }

    setProjectionData(data)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav userName={userName} />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <DayPicker
                    mode="default"
                    captionLayout="dropdown-buttons"
                    fromYear={2020}
                    toYear={2030}
                    defaultMonth={selectedDate}
                    selected={selectedDate}
                    month={selectedDate}
                    onMonthChange={(month) => setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1))}
                    footer={
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Fechar o popover após a seleção
                            document.body.click()
                          }}
                        >
                          Selecionar
                        </Button>
                      </div>
                    }
                    locale={ptBR}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalBalance)}
                </div>
                <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Receber</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(receivableBalance)}
                </div>
                <p className="text-xs text-muted-foreground">+10.5% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(expenses)}
                </div>
                <p className="text-xs text-muted-foreground">-2.5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entradas vs Saídas</CardTitle>
                <CardDescription>Comparativo mensal de receitas e despesas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeExpenseData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value as number)
                      }
                    />
                    <Legend />
                    <Bar dataKey="entrada" name="Entradas" fill="#10b981" />
                    <Bar dataKey="saida" name="Saídas" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projeção de Saldo</CardTitle>
                <CardDescription>Estimativa de duração do saldo atual</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projectionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value as number)
                      }
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Line
                      type="monotone"
                      dataKey="saldo"
                      name="Saldo Projetado"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <p>Bem-vindo ao Sistema CCGV</p>
        </div>
      </main>
    </div>
  )
}

