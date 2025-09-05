// layouts/CustomizeHeader.tsx
import {
  Separator
} from "./ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "./ui/sidebar"
import { useLocation, useParams } from "react-router-dom"

export default function CustomizeHeader() {
  const location = useLocation()
  const { lang } = useParams<{ lang: string }>()
  const segments = location.pathname.split("/").filter(Boolean)
  const breadcrumbSegments = segments.filter((seg) => seg !== lang)
  const currentRoute = breadcrumbSegments[breadcrumbSegments.length - 1]

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbSegments.slice(0, -1).map((segment, index) => {
                const path = `/${[lang, ...breadcrumbSegments.slice(0, index + 1)].join("/")}`
                return (
                  <BreadcrumbItem key={index} className="hidden md:flex">
                    <BreadcrumbLink href={path}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                )
              })}

              <BreadcrumbPage className="font-semibold text-primary">
                {currentRoute
                  ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)
                  : "Inicio"}
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    </SidebarInset>
  )
}
