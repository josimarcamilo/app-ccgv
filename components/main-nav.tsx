"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { logout } from "@/lib/api"

interface MainNavProps {
  userName?: string
}

export function MainNav({ userName }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-6 md:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">CCGV</span>
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/transacoes"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/transacoes" || pathname.startsWith("/transacoes/")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Transações
          </Link>
          <Link
            href="/categorias"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/categorias" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Categorias
          </Link>
          <Link
            href="/contas"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/contas" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Contas
          </Link>
          <Link
            href="/importacao"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/importacao" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Importação
          </Link>
          <Link
            href="/relatorios"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/relatorios" || pathname.startsWith("/relatorios/")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Relatórios
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {userName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{userName}</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>
    </div>
  )
}

