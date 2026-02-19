'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-fit min-w-[100px] h-9 bg-transparent border-0 focus:ring-0 focus:ring-offset-0 px-2 gap-2 text-foreground/80 hover:text-foreground">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
