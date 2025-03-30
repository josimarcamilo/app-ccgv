"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { fetchWithAuth, isAuthenticated, checkAuthStatus } from "@/lib/api"
import { useRouter } from "next/navigation"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface Account {
  id: number
  name: string
  to_receive: boolean
}

export default function ContasPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para o modal de criação/edição
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)
  const [accountName, setAccountName] = useState("")
  const [toReceive, setToReceive] = useState(false)
  const [nameError, setNameError] = useState(false)

  // Estado para o diálogo de confirmação de exclusão
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)

  // Verificar autenticação e carregar contas
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

      // Carregar contas
      fetchAccounts()
    }

    init()
  }, [router])

  // Filtrar contas quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAccounts(accounts)
    } else {
      const filtered = accounts.filter((account) => account.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredAccounts(filtered)
    }
  }, [searchTerm, accounts])

  // Função para buscar contas da API
  const fetchAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth("/accounts")

      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
        setFilteredAccounts(data)
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as contas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as contas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para abrir o modal de criação
  const handleAddAccount = () => {
    setIsEditing(false)
    setCurrentAccount(null)
    setAccountName("")
    setToReceive(false)
    setNameError(false)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de edição
  const handleEditAccount = (account: Account) => {
    setIsEditing(true)
    setCurrentAccount(account)
    setAccountName(account.name)
    setToReceive(account.to_receive)
    setNameError(false)
    setIsDialogOpen(true)
  }

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account)
  }

  // Função para salvar (criar ou editar) uma conta
  const handleSaveAccount = async () => {
    // Validação
    if (!accountName.trim()) {
      setNameError(true)
      return
    }

    try {
      if (isEditing && currentAccount) {
        // Editar conta existente
        const response = await fetchWithAuth(`/accounts/${currentAccount.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: accountName,
            to_receive: toReceive,
          }),
        })

        if (response.ok) {
          toast({
            title: "Sucesso",
            description: "Conta atualizada com sucesso",
          })

          // Atualizar a lista de contas
          setAccounts(
            accounts.map((acc) =>
              acc.id === currentAccount.id ? { ...acc, name: accountName, to_receive: toReceive } : acc,
            ),
          )
        } else {
          const errorData = await response.json()
          toast({
            title: "Erro",
            description: errorData.message || "Não foi possível atualizar a conta",
            variant: "destructive",
          })
        }
      } else {
        // Criar nova conta
        const response = await fetchWithAuth("/accounts", {
          method: "POST",
          body: JSON.stringify({
            name: accountName,
            to_receive: toReceive,
          }),
        })

        if (response.ok) {
          const newAccount = await response.json()

          toast({
            title: "Sucesso",
            description: "Conta criada com sucesso",
          })

          // Adicionar a nova conta à lista
          setAccounts([...accounts, newAccount])
        } else {
          const errorData = await response.json()
          toast({
            title: "Erro",
            description: errorData.message || "Não foi possível criar a conta",
            variant: "destructive",
          })
        }
      }

      // Fechar o modal
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar conta:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a conta",
        variant: "destructive",
      })
    }
  }

  // Função para excluir uma conta
  const handleConfirmDelete = async () => {
    if (!accountToDelete) return

    try {
      const response = await fetchWithAuth(`/accounts/${accountToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Conta excluída com sucesso",
        })

        // Remover a conta da lista
        setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id))
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro",
          description: errorData.message || "Não foi possível excluir a conta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a conta",
        variant: "destructive",
      })
    } finally {
      setAccountToDelete(null)
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
            <Button onClick={handleAddAccount}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Contas</CardTitle>
              <CardDescription>Visualize, crie, edite e exclua contas para organizar suas transações.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contas..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <p>Carregando contas...</p>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "Nenhuma conta encontrada para a busca." : "Nenhuma conta cadastrada."}
                  </p>
                  {searchTerm && (
                    <Button variant="link" onClick={() => setSearchTerm("")}>
                      Limpar busca
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium">Nome</TableHead>
                          <TableHead className="font-medium">Tipo</TableHead>
                          <TableHead className="font-medium w-[120px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>
                              <Badge variant={account.to_receive ? "outline" : "secondary"}>
                                {account.to_receive ? "A Receber" : "Normal"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditAccount(account)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar conta</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => handleDeleteClick(account)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir conta</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {filteredAccounts.length} {filteredAccounts.length === 1 ? "conta" : "contas"}
                    </div>
                    {filteredAccounts.length > 10 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              1
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Criação/Edição de Conta */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite os detalhes da conta selecionada."
                : "Preencha os detalhes para criar uma nova conta."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="account-name">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="account-name"
                placeholder="Digite o nome da conta"
                value={accountName}
                onChange={(e) => {
                  setAccountName(e.target.value)
                  setNameError(false)
                }}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-500">O nome da conta é obrigatório</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="to-receive" checked={toReceive} onCheckedChange={setToReceive} />
              <Label htmlFor="to-receive">Conta a Receber</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Marque esta opção se esta conta for utilizada para registrar valores a receber.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAccount}>{isEditing ? "Salvar Alterações" : "Criar Conta"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={!!accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{accountToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

