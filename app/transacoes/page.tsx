"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, subDays, parse } from "date-fns"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Search, Trash2, Eye, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"
import { fetchWithAuth, isAuthenticated, checkAuthStatus } from "@/lib/api"
import { useRouter } from "next/navigation"

// Definição dos tipos de transação
const TRANSACTION_TYPES = {
  1: { label: "Entrada", value: "entrada" },
  2: { label: "Saída", value: "saida" },
  3: { label: "Transferência", value: "transferencia" },
}

// Interface para a categoria
interface Category {
  id: number
  name: string
  team_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Interface para a conta
interface Account {
  id: number
  name: string
  balance: string
  balance_date: string
  TeamID: number
  to_receive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Interface para a transação conforme a API
interface Transaction {
  id: number
  TeamID: number
  account_id: number
  date_at: string
  type: number
  description: string
  value: number
  category_id: number
  category: Category
  category_map_id: number
  category_map: Category
  account: Account
  proof: string | null
  transaction_origin: string | null
  transfer: boolean
  external_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const statusMap = {
  aprovado: { label: "Aprovado", variant: "default" },
  pendente: { label: "Pendente", variant: "warning" },
  correcao: { label: "Correção", variant: "destructive" },
} as const

export default function TransacoesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [accounts, setAccounts] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Estados para os campos de data como string
  const [startDateStr, setStartDateStr] = useState(format(subDays(new Date(), 30), "dd/MM/yyyy"))
  const [endDateStr, setEndDateStr] = useState(format(new Date(), "dd/MM/yyyy"))

  // Inicializar filtros com os últimos 30 dias por padrão
  const [filters, setFilters] = useState({
    type: "",
    description: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    category: "",
    account: "",
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  })

  // Estado para o modal de confirmação de exclusão
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Verificar autenticação e carregar dados iniciais
  useEffect(() => {
    const init = async () => {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      const isValid = await checkAuthStatus()
      if (!isValid) {
        router.push("/login")
        return
      }

      // Carregar categorias e contas
      await Promise.all([fetchCategories(), fetchAccounts()])

      // Carregar transações com os filtros padrão
      fetchTransactions()
    }

    init()
  }, [router])

  // Função para buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth("/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.map((cat: Category) => cat.name))
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  // Função para buscar contas
  const fetchAccounts = async () => {
    try {
      const response = await fetchWithAuth("/accounts")
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.map((acc: Account) => acc.name))
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error)
    }
  }

  // Função para converter filtros em query params
  const getQueryParams = () => {
    const params = new URLSearchParams()

    if (filters.type) params.append("type", filters.type)
    if (filters.description) params.append("description", filters.description)
    if (filters.status) params.append("status", filters.status)
    if (filters.minAmount) params.append("min_value", filters.minAmount)
    if (filters.maxAmount) params.append("max_value", filters.maxAmount)
    if (filters.category) params.append("category", filters.category)
    if (filters.account) params.append("account", filters.account)

    if (filters.startDate) {
      params.append("start_date", format(filters.startDate, "yyyy-MM-dd"))
    }

    if (filters.endDate) {
      params.append("end_date", format(filters.endDate, "yyyy-MM-dd"))
    }

    params.append("page", currentPage.toString())
    params.append("page_size", pageSize.toString())

    return params.toString()
  }

  // Função para buscar transações com filtros
  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const queryParams = getQueryParams()
      const response = await fetchWithAuth(`/transactions?${queryParams}`)

      if (response.ok) {
        const data = await response.json()
        setTransactions(Array.isArray(data) ? data : data.items || [])
        setTotalCount(Array.isArray(data) ? data.length : data.total || 0)
        setTotalPages(Math.ceil((Array.isArray(data) ? data.length : data.total || 0) / pageSize))
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as transações",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar transações:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as transações",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para converter string de data para objeto Date
  const parseDate = (dateStr: string): Date | null => {
    try {
      return parse(dateStr, "dd/MM/yyyy", new Date())
    } catch (error) {
      return null
    }
  }

  // Função para aplicar as datas dos inputs aos filtros
  const applyDateFilters = () => {
    const startDate = parseDate(startDateStr)
    const endDate = parseDate(endDateStr)

    if (startDate && endDate) {
      setFilters((prev) => ({
        ...prev,
        startDate,
        endDate,
      }))
    } else {
      if (!startDate) {
        toast({
          title: "Data inválida",
          description: "A data inicial não está em um formato válido (dd/mm/aaaa)",
          variant: "destructive",
        })
      }
      if (!endDate) {
        toast({
          title: "Data inválida",
          description: "A data final não está em um formato válido (dd/mm/aaaa)",
          variant: "destructive",
        })
      }
    }
  }

  // Atualizar transações quando os filtros ou a paginação mudarem
  useEffect(() => {
    fetchTransactions()
  }, [filters, currentPage, pageSize])

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
  }

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      setIsDeleting(true)
      try {
        const response = await fetchWithAuth(`/transactions/${transactionToDelete.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "Sucesso",
            description: "Transação excluída com sucesso!",
          })
          // Recarregar transações após excluir
          fetchTransactions()
        } else {
          const errorData = await response.json()
          toast({
            title: "Erro",
            description: errorData.message || "Não foi possível excluir a transação",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao excluir transação:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir a transação",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
        setTransactionToDelete(null)
      }
    }
  }

  // Função para atualizar uma transação
  const handleUpdateTransaction = async (updatedTransaction: any) => {
    try {
      const response = await fetchWithAuth(`/transactions/${updatedTransaction.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTransaction),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso!",
        })
        // Recarregar transações após atualizar
        fetchTransactions()
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro",
          description: errorData.message || "Não foi possível atualizar a transação",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar transação:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a transação",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleClearFilters = () => {
    const defaultStartDate = subDays(new Date(), 30)
    const defaultEndDate = new Date()

    setStartDateStr(format(defaultStartDate, "dd/MM/yyyy"))
    setEndDateStr(format(defaultEndDate, "dd/MM/yyyy"))

    setFilters({
      type: "",
      description: "",
      status: "",
      minAmount: "",
      maxAmount: "",
      category: "",
      account: "",
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    })
    setCurrentPage(1)
  }

  // Função para obter o tipo de transação formatado
  const getTransactionType = (type: number) => {
    return TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES]?.label || "Desconhecido"
  }

  // Função para obter o valor do tipo de transação
  const getTransactionTypeValue = (type: number) => {
    return TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES]?.value || "unknown"
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-2">
                    <Label>Tipo</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="1">Entrada</SelectItem>
                        <SelectItem value="2">Saída</SelectItem>
                        <SelectItem value="3">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="correcao">Correção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Categoria</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categories.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Conta</Label>
                    <Select
                      value={filters.account}
                      onValueChange={(value) => setFilters({ ...filters, account: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {accounts.map((conta) => (
                          <SelectItem key={conta} value={conta}>
                            {conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Bloco de Data Início */}
                  <div className="grid gap-2">
                    <Label>Data Início</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="dd/mm/aaaa"
                        className="pl-8"
                        value={startDateStr}
                        onChange={(e) => setStartDateStr(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bloco de Data Fim */}
                  <div className="grid gap-2">
                    <Label>Data Fim</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="dd/mm/aaaa"
                        className="pl-8"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Valor Mínimo</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Valor Máximo</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por descrição..."
                      className="pl-8"
                      value={filters.description}
                      onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                    />
                  </div>
                  <Button variant="default" onClick={applyDateFilters}>
                    Aplicar Datas
                  </Button>
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              </div>

              <div className="rounded-md border mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Data</TableHead>
                      <TableHead className="font-medium">Tipo</TableHead>
                      <TableHead className="font-medium">Descrição</TableHead>
                      <TableHead className="font-medium text-right">Valor</TableHead>
                      <TableHead className="font-medium">Categoria</TableHead>
                      <TableHead className="font-medium">Conta</TableHead>
                      <TableHead className="font-medium w-[120px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Carregando transações...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhuma transação encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(new Date(transaction.date_at), "dd/MM/yyyy")}</TableCell>
                          <TableCell className="capitalize">{getTransactionType(transaction.type)}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{transaction.description}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              transaction.value,
                            )}
                          </TableCell>
                          <TableCell>{transaction.category?.name || "-"}</TableCell>
                          <TableCell>{transaction.account?.name || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={`/transacoes/${transaction.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Visualizar transação</span>
                                </Link>
                              </Button>

                              <EditTransactionDialog
                                transaction={{
                                  id: transaction.id,
                                  data: new Date(transaction.date_at),
                                  tipo: getTransactionTypeValue(transaction.type),
                                  descricao: transaction.description,
                                  valor: transaction.value,
                                  categoria: transaction.category?.name || "",
                                  conta: transaction.account?.name || "",
                                  status: "aprovado", // Assumindo status padrão
                                  comprovante: transaction.proof,
                                }}
                                categories={categories}
                                accounts={accounts}
                                onSave={handleUpdateTransaction}
                              />

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => handleDeleteClick(transaction)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir transação</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {transactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a{" "}
                    {Math.min(currentPage * pageSize, totalCount)} de {totalCount} registros
                  </div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">por página</span>
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Lógica para mostrar páginas ao redor da página atual
                        let pageNum = i + 1
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageNum = currentPage - 3 + i
                          }
                          if (currentPage > totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          }
                        }

                        return pageNum > 0 && pageNum <= totalPages ? (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ) : null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!transactionToDelete} onOpenChange={() => !isDeleting && setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

