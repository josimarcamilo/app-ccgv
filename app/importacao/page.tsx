"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth, isAuthenticated, checkAuthStatus } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Account {
  id: number
  name: string
  to_receive: boolean
}

export default function ImportacaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])

  const [ofxFile, setOfxFile] = useState<File | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [ofxAccount, setOfxAccount] = useState("")
  const [csvAccount, setCsvAccount] = useState("")

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

  // Função para buscar contas da API
  const fetchAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth("/accounts")

      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
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

  // Atualizar as funções de importação para usar as rotas corretas e enviar como FormData
  const handleOfxImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ofxFile) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um arquivo OFX para importar",
      })
      return
    }

    if (!ofxAccount) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma conta para importar os registros",
      })
      return
    }

    // Criar FormData e adicionar os campos necessários
    const formData = new FormData()
    formData.append("account_id", ofxAccount)
    formData.append("file_ofx", ofxFile)

    try {
      setIsLoading(true)

      // Usar fetch diretamente para evitar que fetchWithAuth adicione Content-Type: application/json
      const token = localStorage.getItem("authToken")
      const baseUrl = "https://api.orfed.com.br"

      const response = await fetch(`${baseUrl}/transactions/import-ofx`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        // Não incluir Content-Type para que o navegador defina automaticamente como multipart/form-data
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Arquivo OFX importado com sucesso!`,
        })
        setOfxFile(null)
        setOfxAccount("")
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro",
          description: errorData.message || "Não foi possível importar o arquivo OFX",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao importar arquivo OFX:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao importar o arquivo OFX",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvFile) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um arquivo CSV para importar",
      })
      return
    }

    if (!csvAccount) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma conta para importar os registros",
      })
      return
    }

    // Criar FormData e adicionar os campos necessários
    const formData = new FormData()
    formData.append("account_id", csvAccount)
    formData.append("file_csv", csvFile)

    try {
      setIsLoading(true)

      // Usar fetch diretamente para evitar que fetchWithAuth adicione Content-Type: application/json
      const token = localStorage.getItem("authToken")
      const baseUrl = "https://api.orfed.com.br"

      const response = await fetch(`${baseUrl}/transactions/import-csv`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        // Não incluir Content-Type para que o navegador defina automaticamente como multipart/form-data
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Arquivo CSV importado com sucesso!`,
        })
        setCsvFile(null)
        setCsvAccount("")
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro",
          description: errorData.message || "Não foi possível importar o arquivo CSV",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao importar arquivo CSV:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao importar o arquivo CSV",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <h1 className="text-3xl font-bold tracking-tight">Importação</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p>Carregando contas...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Card de Importação OFX */}
              <Card>
                <CardHeader>
                  <CardTitle>Importar OFX</CardTitle>
                  <CardDescription>Selecione o arquivo OFX do banco para importar as transações</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOfxImport} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ofx-account">Conta para importação</Label>
                      <Select value={ofxAccount} onValueChange={setOfxAccount}>
                        <SelectTrigger id="ofx-account">
                          <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name} {account.to_receive ? "(A Receber)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ofx-file">Arquivo OFX</Label>
                      <div className="grid gap-4">
                        <Input
                          id="ofx-file"
                          type="file"
                          accept=".ofx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setOfxFile(file)
                          }}
                          className="cursor-pointer"
                        />
                        <Button type="submit" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Importar OFX
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Card de Importação CSV */}
              <Card>
                <CardHeader>
                  <CardTitle>Importar CSV</CardTitle>
                  <CardDescription>
                    Importe transações a partir de um arquivo CSV formatado corretamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCsvImport} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="csv-account">Conta para importação</Label>
                      <Select value={csvAccount} onValueChange={setCsvAccount}>
                        <SelectTrigger id="csv-account">
                          <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name} {account.to_receive ? "(A Receber)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="csv-file">Arquivo CSV</Label>
                      <div className="text-sm text-muted-foreground space-y-1 mb-2">
                        <p>O arquivo CSV deve seguir as seguintes regras:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Separar colunas com ponto e vírgula (;)</li>
                          <li>Cabeçalho na linha 7</li>
                          <li>Usar ponto (.) para casas decimais</li>
                          <li>Formato de data: yyyy-mm-dd</li>
                        </ul>
                      </div>
                      <div className="grid gap-4">
                        <Input
                          id="csv-file"
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setCsvFile(file)
                          }}
                          className="cursor-pointer"
                        />
                        <Button type="submit" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Importar CSV
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

