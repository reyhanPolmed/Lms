import { ModuleDetail, SidebarEntry, SidebarItemType } from "@/lib/types";

type RouteableItem = Pick<SidebarEntry, "id" | "type">;

export interface ModuleItemRouteEntry extends RouteableItem {
  identity: string;
  slug: string;
  href: string;
}

const routePrefixByType: Record<SidebarItemType, string> = {
  lesson: "lesson",
  quiz: "quiz",
  task: "task",
  assignment: "assignment",
  material: "material"
};

export function getModuleItemIdentity(item: RouteableItem): string {
  return `${item.type}:${item.id}`;
}

export function buildModuleItemRoutes(
  moduleId: string,
  items: RouteableItem[]
): ModuleItemRouteEntry[] {
  const counters: Record<SidebarItemType, number> = {
    lesson: 0,
    quiz: 0,
    task: 0,
    assignment: 0,
    material: 0
  };

  return items.map((item) => {
    counters[item.type] += 1;
    const slug = `${routePrefixByType[item.type]}${counters[item.type]}`;

    return {
      ...item,
      identity: getModuleItemIdentity(item),
      slug,
      href: `/modules/${moduleId}/${slug}`
    };
  });
}

export function normalizeSidebarRoutes(moduleId: string, items: SidebarEntry[]): SidebarEntry[] {
  const routeMap = new Map(
    buildModuleItemRoutes(moduleId, items).map((item) => [item.identity, item.href])
  );

  return items.map((item) => ({
    ...item,
    href: routeMap.get(getModuleItemIdentity(item)) ?? item.href
  }));
}

export function normalizeModuleDetailRoutes(module: ModuleDetail): ModuleDetail {
  const routeMap = new Map(
    buildModuleItemRoutes(
      module.id,
      module.sections.flatMap((section) => section.items)
    ).map((item) => [item.identity, item.href])
  );

  return {
    ...module,
    sections: module.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        href: routeMap.get(getModuleItemIdentity(item)) ?? item.href
      }))
    }))
  };
}

export function resolveModuleItemRoute(module: ModuleDetail, slug: string): ModuleItemRouteEntry | null {
  return (
    buildModuleItemRoutes(
      module.id,
      module.sections.flatMap((section) => section.items)
    ).find((item) => item.slug === slug) ?? null
  );
}
