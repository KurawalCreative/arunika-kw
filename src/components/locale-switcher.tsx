'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  const languages = [
    { code: 'id', label: 'Indonesia' },
    { code: 'jv', label: 'Jawa' },
    { code: 'su', label: 'Sunda' },
    { code: 'bt', label: 'Batak' },
    { code: 'ba', label: 'Bali' },
    { code: 'bug', label: 'Bugis' },
    { code: 'min', label: 'Minangkabau' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="relative flex items-center justify-center rounded-full bg-transparent text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-none"
        >
          <Globe className="w-4 h-4 text-orange-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl bg-white/90 shadow-md backdrop-blur-md p-2 dark:bg-neutral-900/90 transition-all"
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <DropdownMenuItem
              onClick={() => switchLocale(lang.code)}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all ${locale === lang.code
                ? 'bg-neutral-200 dark:bg-neutral-800 text-orange-500'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
            >
              {lang.label}
            </DropdownMenuItem>
          </motion.div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
