"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  })

  // Verificar se há um email lembrado ao carregar a página
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    const errors = {
      email: !formData.email.trim(),
      password: !formData.password.trim(),
    }

    setFormErrors(errors)

    if (errors.email || errors.password) {
      return
    }

    setIsLoading(true)

    try {
      // Fazer a requisição para a API com credentials: 'include' para permitir cookies
      const response = await fetch("https://api.orfed.com.br/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Importante para autenticação baseada em sessão
      })

      const data = await response.json()

      if (response.ok) {
        // Login bem-sucedido

        // Armazenar flag de autenticação
        localStorage.setItem("isAuthenticated", "true")

        // Se houver dados do usuário na resposta, armazená-los
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user))
        }

        // Se "lembrar-me" estiver marcado, armazenar o email
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema CCGV",
        })

        // Redirecionar para a página inicial
        router.push("/")
      } else {
        // Login falhou
        const errorMessage = data.message || data.error || "Credenciais inválidas"

        toast({
          title: "Erro de autenticação",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)

      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-4">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Logo CCGV"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-center">Sistema CCGV</h1>
          <p className="text-muted-foreground text-center mt-2">Centro de Controle Gerencial Vicentino</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    className={`pl-10 ${formErrors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setFormErrors({ ...formErrors, email: false })
                    }}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.email && <p className="text-sm text-red-500">O email é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className={`pl-10 ${formErrors.password ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setFormErrors({ ...formErrors, password: false })
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                  </Button>
                </div>
                {formErrors.password && <p className="text-sm text-red-500">A senha é obrigatória</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembrar-me
                </Label>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} CCGV - Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}

