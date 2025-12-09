"use client"

import { useState, useEffect, useCallback, ChangeEvent, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Check, X, ShoppingBasket, Pill, Home, Wrench } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ItemLista {
  id: string
  nombre: string
  categoria: string
  cantidad: string
  comprado: boolean
}

const CATEGORIAS = [
  { value: "alimentos", label: "Alimentos", icon: ShoppingBasket, color: "bg-green-500" },
  { value: "farmacia", label: "Farmacia", icon: Pill, color: "bg-blue-500" },
  { value: "hogar", label: "Hogar", icon: Home, color: "bg-purple-500" },
  { value: "ferreteria", label: "Ferretería", icon: Wrench, color: "bg-orange-500" },
]

export function ListaSection() {
  const [items, setItems] = useState<ItemLista[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState("todas")
  const [lastActionMsg, setLastActionMsg] = useState("")

  const [nuevoItem, setNuevoItem] = useState({
    nombre: "",
    categoria: "alimentos",
    cantidad: "1",
  })

  useEffect(() => {
    const stored = localStorage.getItem("nuestronido-lista")
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("nuestronido-lista", JSON.stringify(items))
    }
  }, [items])

  const agregarItem = useCallback(() => {
    const nombreLimpio = nuevoItem.nombre.replace(/\s{2,}/g, " ").trim().slice(0, 100)
    const cantidadLimpia = nuevoItem.cantidad.trim().slice(0, 50)
    if (nombreLimpio) {
      const item: ItemLista = {
        id: Date.now().toString(),
        nombre: nombreLimpio,
        categoria: nuevoItem.categoria,
        cantidad: cantidadLimpia || "1",
        comprado: false,
      }

      setItems((prev) => [...prev, item])
      setNuevoItem({ nombre: "", categoria: "alimentos", cantidad: "1" })
      setDialogOpen(false)
      setLastActionMsg("Item agregado a la lista")
      setTimeout(() => setLastActionMsg(""), 1500)
    }
  }, [nuevoItem])

  const toggleComprado = useCallback((itemId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, comprado: !item.comprado } : item)))
  }, [])

  const eliminarItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
    setLastActionMsg("Item eliminado")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [])

  const limpiarComprados = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.comprado))
    setLastActionMsg("Items comprados limpiados")
    setTimeout(() => setLastActionMsg(""), 1500)
  }, [])

  const getCategoria = useCallback((categoriaValue: string) => {
    return CATEGORIAS.find((c) => c.value === categoriaValue)
  }, [])

  const itemsFiltrados =
    categoriaActiva === "todas" ? items : items.filter((item) => item.categoria === categoriaActiva)

  const itemsPendientes = itemsFiltrados.filter((item) => !item.comprado)
  const itemsComprados = itemsFiltrados.filter((item) => item.comprado)

  const contarPorCategoria = (categoria: string) => {
    return items.filter((item) => item.categoria === categoria && !item.comprado).length
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Lista de Compras</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestiona tus listas de compras por categoría
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {itemsComprados.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={limpiarComprados}
                    className="text-xs sm:text-sm h-9 sm:h-10 bg-transparent"
                    aria-label="Limpiar items comprados"
                    title="Limpiar items comprados"
                  >
                    Limpiar Comprados
                  </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 text-xs sm:text-sm h-9 sm:h-10">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                Agregar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Item a la Lista</DialogTitle>
                <DialogDescription>Añade un nuevo producto a tu lista de compras</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del producto</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Leche"
                    value={nuevoItem.nombre}
                    onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && agregarItem()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={nuevoItem.categoria}
                    onValueChange={(value) => setNuevoItem({ ...nuevoItem, categoria: value })}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" aria-hidden="true" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    placeholder="Ej: 2 litros, 1 kg"
                    value={nuevoItem.cantidad}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNuevoItem((prev) => ({ ...prev, cantidad: e.target.value.slice(0, 50) }))
                    }
                    aria-label="Cantidad del producto"
                    maxLength={50}
                  />
                </div>

                <Button onClick={agregarItem} className="w-full">
                  Agregar a la Lista
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={categoriaActiva} onValueChange={setCategoriaActiva}>
                  <TabsList className="grid w-full grid-cols-5 gap-1 h-auto p-1">
          <TabsTrigger value="todas" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <span className="hidden sm:inline">Todas</span>
            <span className="sm:hidden">Todo</span>
            {items.filter((i) => !i.comprado).length > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-1.5">
                {items.filter((i) => !i.comprado).length}
              </Badge>
            )}
          </TabsTrigger>
          {CATEGORIAS.map((cat) => {
            const Icon = cat.icon
            const count = contarPorCategoria(cat.value)
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="gap-0.5 sm:gap-1 text-xs sm:text-sm px-1 sm:px-3 py-2"
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span className="hidden lg:inline">{cat.label}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs px-1 sm:px-1.5">
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={categoriaActiva} className="mt-4 sm:mt-6">
          {itemsFiltrados.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-sm sm:text-base text-muted-foreground py-4 sm:py-8">
                  No hay items en esta categoría
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Por Comprar</CardTitle>
                  <CardDescription>
                    {itemsPendientes.length} {itemsPendientes.length === 1 ? "item" : "items"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {itemsPendientes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No hay items pendientes</p>
                  ) : (
                    <div className="space-y-2">
                      {itemsPendientes.map((item) => {
                        const categoria = getCategoria(item.categoria)
                        const Icon = categoria?.icon || ShoppingBasket
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Button
                              size="icon"
                              variant="outline"
                              className="shrink-0 bg-transparent"
                              onClick={() => toggleComprado(item.id)}
                              aria-label={`Marcar ${item.nombre} como comprado`}
                              title={`Marcar ${item.nombre} como comprado`}
                            >
                              <div className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-medium">{item.nombre}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Icon className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                                      <span className="text-xs text-muted-foreground">{categoria?.label}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">• {item.cantidad}</span>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0"
                                  onClick={() => eliminarItem(item.id)}
                                  aria-label={`Eliminar ${item.nombre}`}
                                  title={`Eliminar ${item.nombre}`}
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comprados</CardTitle>
                  <CardDescription>
                    {itemsComprados.length} {itemsComprados.length === 1 ? "item" : "items"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {itemsComprados.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No hay items comprados</p>
                  ) : (
                    <div className="space-y-2">
                      {itemsComprados.map((item) => {
                        const categoria = getCategoria(item.categoria)
                        const Icon = categoria?.icon || ShoppingBasket
                        return (
                          <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50 opacity-60"
                            >
                              <Button
                                size="icon"
                                variant="secondary"
                                className="shrink-0"
                                onClick={() => toggleComprado(item.id)}
                                aria-label={`Marcar ${item.nombre} como no comprado`}
                                title={`Marcar ${item.nombre} como no comprado`}
                              >
                                <Check className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-medium line-through">{item.nombre}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Icon className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">{categoria?.label}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">• {item.cantidad}</span>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0"
                                  onClick={() => eliminarItem(item.id)}
                                  aria-label={`Eliminar ${item.nombre}`}
                                  title={`Eliminar ${item.nombre}`}
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Región para lectores de pantalla que anuncia acciones (agregado/eliminado) */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {lastActionMsg}
      </span>
    </div>
  )
}
