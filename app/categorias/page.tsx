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

interface Category {
  id: number
  name: string
}

export default function CategoriasPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para o modal de criação/edição
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [nameError, setNameError] = useState(false)

  // Estado para o diálogo de confirmação de exclusão
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // Verificar autenticação e carregar categorias
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

      // Carregar categorias
      fetchCategories()
    }

    init()
  }, [router])

  // Filtrar categorias quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredCategories(filtered)
    }
  }, [searchTerm, categories])

  // Função para buscar categorias da API
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth("/categories")

      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        setFilteredCategories(data)
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as categorias",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para abrir o modal de criação
  const handleAddCategory = () => {
    setIsEditing(false)
    setCurrentCategory(null)
    setCategoryName("")
    setNameError(false)
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de edição
  const handleEditCategory = (category: Category) => {
    setIsEditing(true)
    setCurrentCategory(category)
    setCategoryName(category.name)
    setNameError(false)
    setIsDialogOpen(true)
  }

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
  }

  // Função para salvar (criar ou editar) uma categoria
  const handleSaveCategory = async () => {
    // Validação
    if (!categoryName.trim()) {
      setNameError(true)
      return
    }

    try {
      if (isEditing && currentCategory) {
        // Editar categoria existente
        const response = await fetchWithAuth(`/categories/${currentCategory.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: categoryName }),
        })

        if (response.ok) {
          toast({
            title: "Sucesso",
            description: "Categoria atualizada com sucesso",
          })

          // Atualizar a lista de categorias
          setCategories(categories.map((cat) => (cat.id === currentCategory.id ? { ...cat, name: categoryName } : cat)))
        } else {
          const errorData = await response.json()
          toast({
            title: "Erro",
            description: errorData.message || "Não foi possível atualizar a categoria",
            variant: "destructive",
          })
        }
      } else {
        // Criar nova categoria
        const response = await fetchWithAuth("/categories", {
          method: "POST",
          body: JSON.stringify({ name: categoryName }),
        })

        if (response.ok) {
          const newCategory = await response.json()

          toast({
            title: "Sucesso",
            description: "Categoria criada com sucesso",
          })

          // Adicionar a nova categoria à lista
          setCategories([...categories, newCategory])
        } else {
          const errorData = await response.json()
          toast({
            title: "Erro",
            description: errorData.message || "Não foi possível criar a categoria",
            variant: "destructive",
          })
        }
      }

      // Fechar o modal
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a categoria",
        variant: "destructive",
      })
    }
  }

  // Função para excluir uma categoria
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetchWithAuth(`/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso",
        })

        // Remover a categoria da lista
        setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id))
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro",
          description: errorData.message || "Não foi possível excluir a categoria",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a categoria",
        variant: "destructive",
      })
    } finally {
      setCategoryToDelete(null)
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
            <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Visualize, crie, edite e exclua categorias para organizar suas transações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar categorias..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <p>Carregando categorias...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "Nenhuma categoria encontrada para a busca." : "Nenhuma categoria cadastrada."}
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
                          <TableHead className="font-medium w-[120px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar categoria</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => handleDeleteClick(category)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir categoria</span>
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
                      Mostrando {filteredCategories.length}{" "}
                      {filteredCategories.length === 1 ? "categoria" : "categorias"}
                    </div>
                    {filteredCategories.length > 10 && (
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

      {/* Modal de Criação/Edição de Categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite os detalhes da categoria selecionada."
                : "Preencha os detalhes para criar uma nova categoria."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                placeholder="Digite o nome da categoria"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value)
                  setNameError(false)
                }}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-500">O nome da categoria é obrigatório</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCategory}>{isEditing ? "Salvar Alterações" : "Criar Categoria"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"? Esta ação não pode ser desfeita.
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

