"use client"

import { useLocale, useTranslations } from "next-intl"
import { routing, usePathname, useRouter } from "@/i18n/routing"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Languages } from "lucide-react"
import { Hint } from "./hint"

export function LanguageSwitcher() {
  const t = useTranslations("Language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function onValueChange(nextLocale: string) {
    router.replace({ pathname }, { locale: nextLocale })
  }

  return (
    <Hint label={t("en")} side="bottom">
      <Select value={locale} onValueChange={onValueChange}>
        <SelectTrigger className="!h-9 w-fit bg-muted/40 border border-border/50 hover:bg-primary/10 hover:text-primary transition-all rounded-md px-3 gap-2 focus:ring-0 focus:ring-offset-0">
          <Languages className="h-[1.1rem] w-[1.1rem]" />
          <SelectValue>
            <span className="text-xs font-medium">{t(locale)}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl p-1 min-w-[140px]">
          {routing.locales.map((l) => (
            <SelectItem
              key={l}
              value={l}
              className="rounded-lg cursor-pointer"
            >
              {t(l)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Hint>
  )
}
