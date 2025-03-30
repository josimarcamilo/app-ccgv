"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  id: number
  data: Date
  tipo: "entrada" | "saida" | "transferencia"
  descricao: string
  valor: number
  categoria: string
  conta: string
  status: "aprovado" | "pendente" | "correcao"
  comprovante?: string
  dataRegistro?: Date
  usuarioRegistro?: string
}

interface ApprovalHistory {
  id: number
  usuario: string
  status: "aprovado" | "pendente" | "correcao"
  observacao: string
  data: Date
}

const statusMap = {
  aprovado: { label: "Aprovado", variant: "default" },
  pendente: { label: "Pendente", variant: "warning" },
  correcao: { label: "Correção", variant: "destructive" },
} as const

export default function TransactionDetailsPage() {
  const params = useParams()
  const id = params.id

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([])
  const [isAddingApproval, setIsAddingApproval] = useState(false)
  const [newApproval, setNewApproval] = useState<{
    status: "aprovado" | "pendente" | "correcao" | ""
    observacao: string
  }>({
    status: "",
    observacao: "",
  })
  const [formErrors, setFormErrors] = useState({
    status: false,
    observacao: false,
  })

  useEffect(() => {
    // Em um caso real, você faria uma chamada à API
    // Simulando dados para o exemplo
    setTimeout(() => {
      const mockTransaction: Transaction = {
        id: Number(id),
        data: new Date(2025, 0, 31),
        tipo: "entrada",
        descricao: "Reembolso CMGV - Referente água,luz,mantimentos, faxina.",
        valor: 894.91,
        categoria: "Reembolso",
        conta: "Principal",
        status: "aprovado",
        comprovante: "comprovante.pdf",
        dataRegistro: new Date(2025, 0, 30),
        usuarioRegistro: "João Silva",
      }

      const mockApprovalHistory: ApprovalHistory[] = [
        {
          id: 1,
          usuario: "Maria Oliveira",
          status: "pendente",
          observacao: "Aguardando comprovante adicional",
          data: new Date(2025, 0, 30, 10, 15),
        },
        {
          id: 2,
          usuario: "Carlos Santos",
          status: "correcao",
          observacao: "Valor incorreto, favor corrigir",
          data: new Date(2025, 0, 30, 14, 30),
        },
        {
          id: 3,
          usuario: "Ana Pereira",
          status: "aprovado",
          observacao: "Documentação completa, aprovado",
          data: new Date(2025, 0, 31, 9, 45),
        },
      ]

      setTransaction(mockTransaction)
      setApprovalHistory(mockApprovalHistory)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleAddApproval = () => {
    // Validação
    const errors = {
      status: !newApproval.status,
      observacao: !newApproval.observacao.trim(),
    }

    setFormErrors(errors)

    if (errors.status || errors.observacao) {
      return
    }

    // Em um caso real, você enviaria para a API
    const newApprovalEntry: ApprovalHistory = {
      id: approvalHistory.length + 1,
      usuario: "Usuário Atual", // Em um caso real, seria o usuário logado
      status: newApproval.status,
      observacao: newApproval.observacao,
      data: new Date(),
    }

    setApprovalHistory([...approvalHistory, newApprovalEntry])

    // Atualiza o status da transação para o último status adicionado
    if (transaction) {
      setTransaction({
        ...transaction,
        status: newApproval.status,
      })
    }

    // Limpa o formulário
    setNewApproval({
      status: "",
      observacao: "",
    })

    setIsAddingApproval(false)

    toast({
      title: "Sucesso",
      description: "Registro de aprovação adicionado com sucesso!",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="flex justify-center items-center h-full">
            <p>Carregando detalhes da transação...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="flex justify-center items-center h-full">
            <p>Transação não encontrada.</p>
          </div>
        </main>
      </div>
    )
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/transacoes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Detalhes da Transação</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações da Transação</CardTitle>
                <CardDescription>Detalhes completos da transação #{transaction.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
                      <p>{format(transaction.data, "dd/MM/yyyy", { locale: ptBR })}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
                      <p className="capitalize">{transaction.tipo}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
                    <p>{transaction.descricao}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
                      <p className="text-lg font-semibold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          transaction.valor,
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge
                        variant={
                          (statusMap[transaction.status].variant as "default" | "warning" | "destructive") || "default"
                        }
                      >
                        {statusMap[transaction.status].label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Categoria</h3>
                      <p>{transaction.categoria}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Conta</h3>
                      <p>{transaction.conta}</p>
                    </div>
                  </div>

                  {transaction.comprovante && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Comprovante</h3>
                      <Button variant="outline" className="mt-1" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar comprovante
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Data de Registro</h3>
                    <p>
                      {transaction.dataRegistro
                        ? format(transaction.dataRegistro, "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Registrado por</h3>
                    <p>{transaction.usuarioRegistro || "-"}</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/transacoes/${transaction.id}/editar`}>Editar Transação</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Aprovações */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Histórico de Aprovações</CardTitle>
                <CardDescription>
                  Registro de todas as aprovações e alterações de status desta transação
                </CardDescription>
              </div>

              <Button size="sm" onClick={() => setIsAddingApproval(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Registro
              </Button>

              <Dialog open={isAddingApproval} onOpenChange={setIsAddingApproval}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Registro de Aprovação</DialogTitle>
                    <DialogDescription>Adicione um novo registro de aprovação para esta transação.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="approval-status">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newApproval.status}
                        onValueChange={(value: "aprovado" | "pendente" | "correcao") => {
                          setNewApproval({ ...newApproval, status: value })
                          setFormErrors({ ...formErrors, status: false })
                        }}
                      >
                        <SelectTrigger id="approval-status" className={formErrors.status ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="correcao">Correção</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.status && <p className="text-sm text-red-500">Status é obrigatório</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="approval-observation">
                        Observação <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="approval-observation"
                        placeholder="Digite sua observação..."
                        value={newApproval.observacao}
                        onChange={(e) => {
                          setNewApproval({ ...newApproval, observacao: e.target.value })
                          setFormErrors({ ...formErrors, observacao: false })
                        }}
                        className={formErrors.observacao ? "border-red-500" : ""}
                      />
                      {formErrors.observacao && <p className="text-sm text-red-500">Observação é obrigatória</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingApproval(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddApproval}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {approvalHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Nenhum registro de aprovação encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {approvalHistory.map((approval, index) => (
                    <div key={approval.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-medium">{approval.usuario}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(approval.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge
                          variant={
                            (statusMap[approval.status].variant as "default" | "warning" | "destructive") || "default"
                          }
                        >
                          {statusMap[approval.status].label}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-sm">{approval.observacao}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

