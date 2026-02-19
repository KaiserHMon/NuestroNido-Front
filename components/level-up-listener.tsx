'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

export function LevelUpListener() {
  const { user } = useAuth();
  const { family } = useFamily();

  // Store the previous level number to detect changes
  const prevLevelNumberRef = useRef<number | undefined>(undefined);

  // State for the celebration dialog
  const [showCelebration, setShowCelebration] = useState(false);
  const [newLevelData, setNewLevelData] = useState<
    { name: string; image_url?: string } | undefined
  >(undefined);

  useEffect(() => {
    if (!user || !family) return;

    // Find the current user member object in the family
    const myMember = family.members.find((m) => m.id === user.id);

    if (!myMember || !myMember.level) return;

    const currentLevelNumber = myMember.level.level_number;

    // First run: just initialize the ref if valid
    if (prevLevelNumberRef.current === undefined) {
      prevLevelNumberRef.current = currentLevelNumber;
      return;
    }

    // Check for level UP
    if (currentLevelNumber > prevLevelNumberRef.current) {
      // LEVEL UP DETECTED!
      console.log('Level Up detected:', prevLevelNumberRef.current, '->', currentLevelNumber);

      setTimeout(() => {
        setNewLevelData({
          name: myMember.level?.name || '',
          image_url: myMember.level?.image_url,
        });
        setShowCelebration(true);
      }, 0);
    }

    // Update ref
    prevLevelNumberRef.current = currentLevelNumber;
  }, [family, user]);

  if (!showCelebration || !newLevelData || !user) return null;

  return (
    <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
      <DialogContent className="sm:max-w-md text-center border-2 border-yellow-400/50 bg-gradient-to-b from-background to-yellow-50/10">
        <DialogHeader>
          <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4 animate-bounce">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-600 dark:text-yellow-400">
            ¡Felicidades, {user.name}!
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            Has subido de nivel.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            <Avatar className="w-32 h-32 border-4 border-yellow-400 shadow-xl">
              <AvatarImage
                src={newLevelData.image_url}
                alt={newLevelData.name}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl bg-yellow-100 text-yellow-700">
                {newLevelData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Nuevo Título
            </p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-400">
              {newLevelData.name}
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => setShowCelebration(false)}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
          >
            ¡Genial!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
