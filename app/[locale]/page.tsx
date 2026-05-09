import { redirect } from "@/i18n/routing"

export default function Page() {
  redirect({ href: "/login", locale: "en" })
}
