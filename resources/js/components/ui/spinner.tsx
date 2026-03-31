import { useTranslations } from "#app/hooks/use-translations"
import { Loader2Icon } from "lucide-react"

import { cn } from "#app/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { t } = useTranslations()
  return (
    <Loader2Icon
      role="status"
      aria-label={t("common.loading")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
