'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Trash2, AlertTriangle, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserService } from '@/services/user-service';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function SettingsDialog() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!usuario) return;

    setIsDeleting(true);
    try {
      await UserService.deleteUser(usuario.id);
      await logout();
      toast.success('Cuenta eliminada correctamente');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta. Inténtalo de nuevo.');
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" title="Configuración" className="hover:bg-primary/10 text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configuración</DialogTitle>
            <DialogDescription>
              Gestiona tu cuenta y preferencias.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
             <div className="flex flex-col gap-2 p-4 border rounded-lg bg-background/50">
                <div className="flex items-center gap-2 font-medium text-foreground">
                    <UserX className="w-4 h-4" />
                    <span>Zona de Peligro</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Si eliminas tu cuenta, perderás todos tus datos y progreso. Esta acción no se puede deshacer.
                </p>
                <Button 
                    variant="destructive" 
                    className="w-full mt-2 gap-2"
                    onClick={() => setShowDeleteAlert(true)}
                >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Cuenta
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                ¿Estás absolutamente seguro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Se eliminará permanentemente tu cuenta de usuario y todos tus datos asociados de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
