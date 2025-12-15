"use client"

import { Miembro, LeaderboardEntry } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MiembroAvatar } from "@/components/ui/miembro-avatar"
import { Medal } from "lucide-react"

interface LeaderboardProps {
  miembros: Miembro[]
}

const NIVELES = [
  { nivel: 1, nombre: "Polluelo", minPuntos: 0, maxPuntos: 50 },
  { nivel: 2, nombre: "Pájaro Joven", minPuntos: 51, maxPuntos: 150 },
  { nivel: 3, nombre: "Pájaro Adulto", minPuntos: 151, maxPuntos: 300 },
  { nivel: 4, nombre: "Pájaro Majestuoso", minPuntos: 301, maxPuntos: 500 },
  { nivel: 5, nombre: "Pájaro Legendario", minPuntos: 501, maxPuntos: Number.POSITIVE_INFINITY },
]

const getNivelActual = (puntos: number) => {
  return NIVELES.find((n) => puntos >= n.minPuntos && puntos <= n.maxPuntos) || NIVELES[0]
}

const getProgreso = (puntos: number) => {
  const nivelActual = getNivelActual(puntos)
  if (nivelActual.nivel === 5) return 100

  const puntosEnNivel = puntos - nivelActual.minPuntos
  const puntosNecesarios = nivelActual.maxPuntos - nivelActual.minPuntos + 1
  return (puntosEnNivel / puntosNecesarios) * 100
}

const getDistintivo = (posicion: number) => {
  switch (posicion) {
    case 1:
      return { emoji: "🥇", label: "Oro" }
    case 2:
      return { emoji: "🥈", label: "Plata" }
    case 3:
      return { emoji: "🥉", label: "Bronce" }
    default:
      return null
  }
}

export function Leaderboard({ miembros }: LeaderboardProps) {
  // Ordenar miembros por puntos descendente
  const miembrosOrdenados = [...miembros].sort((a, b) => b.puntos - a.puntos)

  const entries: LeaderboardEntry[] = miembrosOrdenados.map((m, index) => {
    const nivel = getNivelActual(m.puntos)
    const progreso = getProgreso(m.puntos)
    const distintivo = getDistintivo(index + 1)

    return {
      puesto: index + 1,
      miembro: {
        id: m.id,
        nombre: m.nombre,
        color: m.color,
      },
      puntos: m.puntos,
      nivel: {
        numero: nivel.nivel,
        nombre: nivel.nombre,
        progresoActual: progreso,
        puntosParaSiguiente:
          nivel.nivel === 5
            ? 0
            : nivel.maxPuntos - m.puntos + 1,
      },
      distintivo: distintivo ? (distintivo.label as "oro" | "plata" | "bronce") : undefined,
    }
  })

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary" />
          Ranking de Miembros
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Posiciones basadas en puntos acumulados
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Pos</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Miembro</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Puntos</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nivel</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.miembro.id}
                    className={`border-b border-border last:border-0 ${
                      entry.puesto <= 3 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="py-3 px-2 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{`#${entry.puesto}`}</span>
                        {entry.distintivo && (
                          <span title={`Medalla de ${entry.distintivo}`}>
                            {entry.distintivo === "oro"
                              ? "🥇"
                              : entry.distintivo === "plata"
                                ? "🥈"
                                : "🥉"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <MiembroAvatar
                          nombre={entry.miembro.nombre}
                          color={entry.miembro.color}
                          size="sm"
                        />
                        <span className="text-foreground font-medium">{entry.miembro.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-foreground font-medium">{entry.puntos}</td>
                    <td className="py-3 px-2 text-muted-foreground">{entry.nivel.nombre}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2 w-48">
                        <Progress
                          value={entry.nivel.progresoActual}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {Math.round(entry.nivel.progresoActual)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.miembro.id}
                className={`p-3 rounded-lg border ${
                  entry.puesto <= 3
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-lg font-bold text-foreground">
                      {entry.distintivo ? (
                        entry.distintivo === "oro" ? "🥇" : entry.distintivo === "plata" ? "🥈" : "🥉"
                      ) : (
                        `#${entry.puesto}`
                      )}
                    </div>
                    <MiembroAvatar
                      nombre={entry.miembro.nombre}
                      color={entry.miembro.color}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.miembro.nombre}</p>
                      <p className="text-xs text-muted-foreground">{entry.nivel.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{entry.puntos}</p>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={entry.nivel.progresoActual}
                    className="h-1.5 flex-1"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {Math.round(entry.nivel.progresoActual)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
