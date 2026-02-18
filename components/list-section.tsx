'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { getCategoryIcon, getCategoryLabel } from '@/lib/category-utils';
import { AddItemDialog } from '@/components/add-item-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListService, ListItem } from '@/services/list-service';
import { useFamily } from '@/hooks/use-family';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

export function ListSection() {
  const { family } = useFamily();
  const [items, setItems] = useState<ListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastActionMsg, setLastActionMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!family) return;
    try {
      setLoading(true);
      const [data, cats] = await Promise.all([
        ListService.getItems(),
        ListService.getCategories()
      ]);
      setItems(data);
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching list data:', error);
    } finally {
      setLoading(false);
    }
  }, [family]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => 
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory),
    [items, activeCategory]
  );

  const pendingItems = useMemo(() => 
    filteredItems.filter((item) => !item.purchased),
    [filteredItems]
  );

  const purchasedItems = useMemo(() => 
    filteredItems.filter((item) => item.purchased),
    [filteredItems]
  );

  const globalPendingCount = useMemo(() => 
    items.filter((i) => !i.purchased).length,
    [items]
  );

  const handleAddItem = useCallback(async (newItemData: { title: string; category: string; quantity: string }) => {
    if (!family) return;

    const cleanTitle = newItemData.title
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 100);
    const categoryToUse = newItemData.category || categories[0] || '';
    const cleanQuantity = parseInt(newItemData.quantity.trim().slice(0, 50)) || 1;

    if (cleanTitle && categoryToUse) {
      try {
        const createdItem = await ListService.create({
          title: cleanTitle,
          family_id: family.id,
          category: categoryToUse,
          quantity: cleanQuantity,
          purchased: false,
        });

        setItems((prev) => [...prev, createdItem]);
        setDialogOpen(false);
        setLastActionMsg('Item added to list');
        setTimeout(() => setLastActionMsg(''), 1500);
        toast.success('Producto agregado');
      } catch (error) {
        console.error('Error creating item:', error);
        toast.error('Error al crear el producto');
        throw error;
      }
    }
  }, [family, categories]);

  const togglePurchased = useCallback(async (item: ListItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, purchased: !i.purchased } : i))
    );

    try {
      const updatedItem = await ListService.update(item.id, {
        purchased: !item.purchased,
      });
      setItems((prev) =>
          prev.map((i) => (i.id === item.id ? updatedItem : i))
      );
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error al actualizar el producto');
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? item : i))
      );
    }
  }, []);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    try {
      await ListService.delete(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setLastActionMsg('Item deleted');
      setTimeout(() => setLastActionMsg(''), 1500);
      toast.success('Producto eliminado');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error al eliminar el producto');
    }
  }, []);

  const clearPurchased = useCallback(async () => {
    const purchased = items.filter((i) => i.purchased);
    try {
      await ListService.deleteBatch(purchased.map((i) => i.id));
      setItems((prev) => prev.filter((item) => !item.purchased));
      setLastActionMsg('Purchased items cleared');
      setTimeout(() => setLastActionMsg(''), 1500);
      toast.success('Lista de comprados limpiada');
    } catch (error) {
      console.error('Error cleaning purchased items:', error);
      toast.error('Error al limpiar la lista');
    }
  }, [items]);

  const countByCategory = useCallback((category: string | undefined) => {
    return items.filter((item) => item.category === category && !item.purchased).length;
  }, [items]);

  if (loading && items.length === 0) {
      return <SectionSkeleton />;
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
          {purchasedItems.length > 0 ? (
            <Button
              variant="outline"
              onClick={clearPurchased}
              className="text-xs sm:text-sm h-9 sm:h-10 bg-transparent"
              aria-label="Limpiar items comprados"
              title="Limpiar items comprados"
            >
              Limpiar Comprados
            </Button>
          ) : null}
          <AddItemDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            categories={categories}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto p-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <span className="hidden sm:inline">Todas</span>
            <span className="sm:hidden">Todo</span>
            {globalPendingCount > 0 ? (
              <Badge
                variant="secondary"
                className="ml-1 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-1.5"
              >
                {globalPendingCount}
              </Badge>
            ) : null}
          </TabsTrigger>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat);
            const count = countByCategory(cat);
            return (
              <TabsTrigger
                key={cat}
                value={cat}
                aria-label={getCategoryLabel(cat)}
                className="gap-0.5 sm:gap-1 text-xs sm:text-sm px-1 sm:px-3 py-2"
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span className="hidden lg:inline">{getCategoryLabel(cat)}</span>
                {count > 0 ? (
                  <Badge
                    variant="secondary"
                    className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs px-1 sm:px-1.5"
                  >
                    {count}
                  </Badge>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4 sm:mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-sm sm:text-base text-muted-foreground py-4 sm:py-8">
                  {loading ? 'Cargando items...' : 'No hay items en esta categoría'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Por Comprar</CardTitle>
                  <CardDescription>
                    {pendingItems.length} {pendingItems.length === 1 ? 'item' : 'items'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay items pendientes
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pendingItems.map((item) => {
                        const Icon = getCategoryIcon(item.category);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                          >
                            <Button
                              size="icon"
                              variant="outline"
                              className="shrink-0 bg-transparent"
                              onClick={() => togglePurchased(item)}
                              aria-label={`Marcar ${item.title} como comprado`}
                              title={`Marcar ${item.title} como comprado`}
                            >
                              <div className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Icon
                                        className="w-3 h-3 text-muted-foreground"
                                        aria-hidden="true"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {getCategoryLabel(item.category)}
                                      </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      • {item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0"
                                  onClick={() => handleDeleteItem(item.id)}
                                  aria-label={`Eliminar ${item.title}`}
                                  title={`Eliminar ${item.title}`}
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comprados</CardTitle>
                  <CardDescription>
                    {purchasedItems.length} {purchasedItems.length === 1 ? 'item' : 'items'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasedItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No hay items comprados</p>
                  ) : (
                    <div className="space-y-2">
                      {purchasedItems.map((item) => {
                        const Icon = getCategoryIcon(item.category);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50 opacity-60"
                          >
                            <Button
                              size="icon"
                              variant="secondary"
                              className="shrink-0"
                              onClick={() => togglePurchased(item)}
                              aria-label={`Marcar ${item.title} como no comprado`}
                              title={`Marcar ${item.title} como no comprado`}
                            >
                              <Check className="w-4 h-4" aria-hidden="true" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-medium line-through">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Icon className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {getCategoryLabel(item.category)}
                                      </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      • {item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0"
                                  onClick={() => handleDeleteItem(item.id)}
                                  aria-label={`Eliminar ${item.title}`}
                                  title={`Eliminar ${item.title}`}
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {lastActionMsg}
      </span>
    </div>
  );
}
