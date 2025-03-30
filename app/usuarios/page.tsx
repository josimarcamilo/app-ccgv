"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Search, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface User {
  id: number
  nome: string
  email: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([
    { id: 1, nome: "ddd", email: "dd@gmail.com" },
    { id: 2, nome: "vvvdmv.msd", email: "nmvdsmv@gmail.com" },
    { id: 3, nome: "vsdvsd", email: "ccas@jkfdjsf.com" },
    { id: 4, nome: "vsdvds", email: "vdsvs@gsgs.com" },
    { id: 5, nome: "fjkfja", email: "mdkfjsaki@gmail.com" },
    { id: 6, nome: "dfsdf", email: "dsds@gmail.com" },
    { id: 7, nome: "mkm", email: "mkmk@gmail.com" },
    { id: 8, nome: "ooo", email: "ooo@gmail.com" },
    { id: 9, nome: "kkk", email: "kkk@gmail.com" },
    { id: 10, nome: "jjj", email: "jjj@gmail.com" },
  ])

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Estados para edição
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Estados para exclusão
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditNome(user.nome)
    setEditEmail(user.email)
    setEditPassword("")
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingUser && editNome && editEmail) {
      const updatedUsers = usuarios.map((user) =>
        user.id === editingUser.id ? { ...user, nome: editNome, email: editEmail } : user,
      )

      setUsuarios(updatedUsers)
      setIsEditDialogOpen(false)

      // Em um caso real, você enviaria essas informações para o backend
      console.log("Usuário atualizado:", { id: editingUser.id, nome: editNome, email: editEmail })
      if (editPassword) {
        console.log("Nova senha definida:", editPassword)
      }
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = usuarios.filter((user) => user.id !== userToDelete.id)
      setUsuarios(updatedUsers)
      setIsDeleteDialogOpen(false)

      // Em um caso real, você enviaria essa informação para o backend
      console.log("Usuário excluído:", userToDelete)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (nome && email && password) {
      const newUser = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
        nome,
        email,
      }

      setUsuarios([...usuarios, newUser])
      setNome("")
      setEmail("")
      setPassword("")
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
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold">Cadastrar usuário</h2>
              <form className="grid gap-4 mt-4 md:grid-cols-3" onSubmit={handleAddUser}>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite o email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Button type="submit">Cadastrar</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Lista de Usuários</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Select defaultValue="10">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="10" />
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
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar..." className="w-full md:w-[200px] pl-8" />
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Nome</TableHead>
                      <TableHead className="font-medium">E-mail</TableHead>
                      <TableHead className="font-medium w-[120px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditUser(usuario)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar usuário</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleDeleteClick(usuario)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir usuário</span>
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
                  Mostrando 1 a {Math.min(10, usuarios.length)} de {usuarios.length} registros
                </div>
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
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Faça as alterações nos dados do usuário aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                placeholder="Digite o nome"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Digite o email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{userToDelete?.nome}"? Esta ação não pode ser desfeita.
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

