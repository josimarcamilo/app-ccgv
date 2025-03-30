"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface User {
  id: number
  nome: string
  email: string
}

interface EditUserDialogProps {
  user: User
  onSave: (user: User, password?: string) => void
}

export function EditUserDialog({ user, onSave }: EditUserDialogProps) {
  const [nome, setNome] = useState(user.nome)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    onSave(
      {
        ...user,
        nome,
        email,
      },
      password || undefined,
    )
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar usuário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Faça as alterações nos dados do usuário aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={`edit-nome-${user.id}`}>Nome</Label>
            <Input
              id={`edit-nome-${user.id}`}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-email-${user.id}`}>Email</Label>
            <Input
              id={`edit-email-${user.id}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-password-${user.id}`}>Nova Senha (opcional)</Label>
            <Input
              id={`edit-password-${user.id}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

