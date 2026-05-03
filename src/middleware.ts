import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const location = response.headers.get("location");
  if (location) {
    const fixed = location.replace(/:8080\b/, "");
    response.headers.set("location", fixed);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
