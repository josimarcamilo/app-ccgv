"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface TransactionForm {
  data: Date | undefined
  descricao: string
  valor: string
  categoria: string
  conta: string
  comprovante?: File
}

export default function NovaTransacaoPage() {
  // Estados para Entrada
  const [entradaForm, setEntradaForm] = useState<TransactionForm>({
    data: undefined,
    descricao: "",
    valor: "",
    categoria: "",
    conta: "",
  })

  // Estados para Saída
  const [saidaForm, setSaidaForm] = useState<TransactionForm>({
    data: undefined,
    descricao: "",
    valor: "",
    categoria: "",
    conta: "",
  })

  // Estados para Transferência
  const [transferenciaForm, setTransferenciaForm] = useState({
    data: undefined as Date | undefined,
    descricao: "",
    valor: "",
    categoria: "",
    contaOrigem: "",
    contaDestino: "",
  })

  // Dados mockados (em um caso real, viriam do backend)
  const categorias = ["Décimas", "Salário", "Alimentação", "Transporte"]
  const contas = ["a receber", "conta principal", "poupança"]

  const handleEntradaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !entradaForm.data ||
      !entradaForm.descricao ||
      !entradaForm.valor ||
      !entradaForm.categoria ||
      !entradaForm.conta
    ) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      })
      return
    }
    console.log("Entrada:", entradaForm)
    toast({
      title: "Sucesso",
      description: "Entrada registrada com sucesso!",
    })
    setEntradaForm({
      data: undefined,
      descricao: "",
      valor: "",
      categoria: "",
      conta: "",
    })
  }

  const handleSaidaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !saidaForm.data ||
      !saidaForm.descricao ||
      !saidaForm.valor ||
      !saidaForm.categoria ||
      !saidaForm.conta ||
      !saidaForm.comprovante
    ) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios, incluindo o comprovante",
      })
      return
    }
    console.log("Saída:", saidaForm)
    toast({
      title: "Sucesso",
      description: "Saída registrada com sucesso!",
    })
    setSaidaForm({
      data: undefined,
      descricao: "",
      valor: "",
      categoria: "",
      conta: "",
    })
  }

  const handleTransferenciaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !transferenciaForm.data ||
      !transferenciaForm.descricao ||
      !transferenciaForm.valor ||
      !transferenciaForm.categoria ||
      !transferenciaForm.contaOrigem ||
      !transferenciaForm.contaDestino
    ) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      })
      return
    }
    if (transferenciaForm.contaOrigem === transferenciaForm.contaDestino) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As contas de origem e destino não podem ser iguais",
      })
      return
    }
    console.log("Transferência:", transferenciaForm)
    toast({
      title: "Sucesso",
      description: "Transferência registrada com sucesso!",
    })
    setTransferenciaForm({
      data: undefined,
      descricao: "",
      valor: "",
      categoria: "",
      contaOrigem: "",
      contaDestino: "",
    })
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
            <h1 className="text-3xl font-bold tracking-tight">Nova Transação</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card de Entrada */}
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
                <CardDescription>Registre uma nova entrada de valor</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEntradaSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="entrada-data">Data do registro</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="entrada-data"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !entradaForm.data && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {entradaForm.data ? (
                            format(entradaForm.data, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={entradaForm.data}
                          onSelect={(date) => setEntradaForm({ ...entradaForm, data: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="entrada-descricao">Descrição</Label>
                    <Input
                      id="entrada-descricao"
                      value={entradaForm.descricao}
                      onChange={(e) => setEntradaForm({ ...entradaForm, descricao: e.target.value })}
                      placeholder="Digite a descrição"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="entrada-valor">Valor</Label>
                    <Input
                      id="entrada-valor"
                      type="number"
                      step="0.01"
                      value={entradaForm.valor}
                      onChange={(e) => setEntradaForm({ ...entradaForm, valor: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="entrada-categoria">Categoria</Label>
                    <Select
                      value={entradaForm.categoria}
                      onValueChange={(value) => setEntradaForm({ ...entradaForm, categoria: value })}
                    >
                      <SelectTrigger id="entrada-categoria">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="entrada-conta">Conta</Label>
                    <Select
                      value={entradaForm.conta}
                      onValueChange={(value) => setEntradaForm({ ...entradaForm, conta: value })}
                    >
                      <SelectTrigger id="entrada-conta">
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {contas.map((conta) => (
                          <SelectItem key={conta} value={conta}>
                            {conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="entrada-comprovante">Comprovante (opcional)</Label>
                    <Input
                      id="entrada-comprovante"
                      type="file"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setEntradaForm({ ...entradaForm, comprovante: file })
                        }
                      }}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Cadastrar Entrada
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Card de Saída */}
            <Card>
              <CardHeader>
                <CardTitle>Saída</CardTitle>
                <CardDescription>Registre uma nova saída de valor</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaidaSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="saida-data">Data do registro</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="saida-data"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !saidaForm.data && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {saidaForm.data ? (
                            format(saidaForm.data, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={saidaForm.data}
                          onSelect={(date) => setSaidaForm({ ...saidaForm, data: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="saida-descricao">Descrição</Label>
                    <Input
                      id="saida-descricao"
                      value={saidaForm.descricao}
                      onChange={(e) => setSaidaForm({ ...saidaForm, descricao: e.target.value })}
                      placeholder="Digite a descrição"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="saida-valor">Valor</Label>
                    <Input
                      id="saida-valor"
                      type="number"
                      step="0.01"
                      value={saidaForm.valor}
                      onChange={(e) => setSaidaForm({ ...saidaForm, valor: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="saida-categoria">Categoria</Label>
                    <Select
                      value={saidaForm.categoria}
                      onValueChange={(value) => setSaidaForm({ ...saidaForm, categoria: value })}
                    >
                      <SelectTrigger id="saida-categoria">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="saida-conta">Conta</Label>
                    <Select
                      value={saidaForm.conta}
                      onValueChange={(value) => setSaidaForm({ ...saidaForm, conta: value })}
                    >
                      <SelectTrigger id="saida-conta">
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {contas.map((conta) => (
                          <SelectItem key={conta} value={conta}>
                            {conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="saida-comprovante" className="flex gap-1">
                      Comprovante
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="saida-comprovante"
                      type="file"
                      className="cursor-pointer"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSaidaForm({ ...saidaForm, comprovante: file })
                        }
                      }}
                    />
                  </div>

                  <Button type="submit" variant="destructive" className="w-full">
                    Cadastrar Saída
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Card de Transferência */}
            <Card>
              <CardHeader>
                <CardTitle>Transferência</CardTitle>
                <CardDescription>Transfira valores entre contas</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransferenciaSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-data">Data do registro</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="transferencia-data"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !transferenciaForm.data && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transferenciaForm.data ? (
                            format(transferenciaForm.data, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={transferenciaForm.data}
                          onSelect={(date) => setTransferenciaForm({ ...transferenciaForm, data: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-descricao">Descrição</Label>
                    <Input
                      id="transferencia-descricao"
                      value={transferenciaForm.descricao}
                      onChange={(e) => setTransferenciaForm({ ...transferenciaForm, descricao: e.target.value })}
                      placeholder="Digite a descrição"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-valor">Valor</Label>
                    <Input
                      id="transferencia-valor"
                      type="number"
                      step="0.01"
                      value={transferenciaForm.valor}
                      onChange={(e) => setTransferenciaForm({ ...transferenciaForm, valor: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-categoria">Categoria</Label>
                    <Select
                      value={transferenciaForm.categoria}
                      onValueChange={(value) => setTransferenciaForm({ ...transferenciaForm, categoria: value })}
                    >
                      <SelectTrigger id="transferencia-categoria">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-conta-origem">Conta de origem</Label>
                    <Select
                      value={transferenciaForm.contaOrigem}
                      onValueChange={(value) => setTransferenciaForm({ ...transferenciaForm, contaOrigem: value })}
                    >
                      <SelectTrigger id="transferencia-conta-origem">
                        <SelectValue placeholder="Selecione a conta de origem" />
                      </SelectTrigger>
                      <SelectContent>
                        {contas.map((conta) => (
                          <SelectItem key={conta} value={conta}>
                            {conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="transferencia-conta-destino">Conta de destino</Label>
                    <Select
                      value={transferenciaForm.contaDestino}
                      onValueChange={(value) => setTransferenciaForm({ ...transferenciaForm, contaDestino: value })}
                    >
                      <SelectTrigger id="transferencia-conta-destino">
                        <SelectValue placeholder="Selecione a conta de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {contas.map((conta) => (
                          <SelectItem key={conta} value={conta}>
                            {conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" variant="secondary" className="w-full">
                    Realizar Transferência
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

