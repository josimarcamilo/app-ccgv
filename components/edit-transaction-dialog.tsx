"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
}

interface EditTransactionDialogProps {
  transaction: Transaction
  categories: string[]
  accounts: string[]
  onSave: (transaction: any) => void
}

export function EditTransactionDialog({ transaction, categories, accounts, onSave }: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Transaction>({ ...transaction })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.descricao.trim()) newErrors.descricao = true
    if (!formData.valor || formData.valor <= 0) newErrors.valor = true
    if (!formData.categoria) newErrors.categoria = true
    if (!formData.conta) newErrors.conta = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Converter para o formato esperado pela API
      const apiTransaction = {
        id: transaction.id,
        date: format(formData.data, "yyyy-MM-dd"),
        type: formData.tipo,
        description: formData.descricao,
        amount: formData.valor,
        category: formData.categoria,
        account: formData.conta,
        status: transaction.status, // Mantém o status original
      }

      await onSave(apiTransaction)
      setOpen(false)
    } catch (error) {
      console.error("Erro ao salvar transação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !isSubmitting && setOpen(newOpen)}>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4" />
        <span className="sr-only">Editar transação</span>
      </Button>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Faça as alterações nos dados da transação aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="transaction-date"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.data, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.data}
                    onSelect={(date) => date && setFormData({ ...formData, data: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-type">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "entrada" | "saida" | "transferencia") =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transaction-description">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Input
              id="transaction-description"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className={errors.descricao ? "border-red-500" : ""}
            />
            {errors.descricao && <p className="text-sm text-red-500">A descrição é obrigatória</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-value">
                Valor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transaction-value"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: Number.parseFloat(e.target.value) })}
                className={errors.valor ? "border-red-500" : ""}
              />
              {errors.valor && <p className="text-sm text-red-500">O valor deve ser maior que zero</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-category">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger id="transaction-category" className={errors.categoria ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-sm text-red-500">A categoria é obrigatória</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transaction-account">
              Conta <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.conta} onValueChange={(value) => setFormData({ ...formData, conta: value })}>
              <SelectTrigger id="transaction-account" className={errors.conta ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.conta && <p className="text-sm text-red-500">A conta é obrigatória</p>}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

