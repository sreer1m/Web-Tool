import {
  LayoutDashboard, Map, Users, Calendar, Megaphone, Brain, Settings,
  Zap, Bell, GitCompare, Globe
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { partners, alerts, computeHealthScore } from "@/data";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Europe Map", url: "/map", icon: Map },
];

const partnerItems = [
  { title: "Partners", url: "/partners", icon: Users },
  { title: "Compare", url: "/compare", icon: GitCompare },
  { title: "Website Analysis", url: "/website-analysis", icon: Globe },
];

const eventItems = [
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
];

const intelligenceItems = [
  { title: "Action Center", url: "/actions", icon: Zap },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Intelligence", url: "/intelligence", icon: Brain },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Count active alerts and high-risk partners for badge
  const alertCount = alerts.filter(a => a.severity === 'high').length +
    partners.filter(p => p.riskLevel === 'high').length;
  const criticalActionCount = partners.filter(p => computeHealthScore(p) < 30).length;

  const renderGroup = (label: string, items: typeof mainItems, badges?: Record<string, number>) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="hover:bg-sidebar-accent"
                  activeClassName="bg-sidebar-accent text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span>{item.title}</span>
                      {badges?.[item.url] ? (
                        <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-medium">
                          {badges[item.url]}
                        </span>
                      ) : null}
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">ME</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-sidebar-foreground truncate">Partner & Event</h2>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">ME</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Overview", mainItems)}
        {renderGroup("Partners", partnerItems)}
        {renderGroup("Events", eventItems)}
        {renderGroup("Intelligence", intelligenceItems, {
          '/alerts': alertCount > 0 ? alertCount : 0,
          '/actions': criticalActionCount > 0 ? criticalActionCount : 0,
        })}
        {renderGroup("System", bottomItems)}
      </SidebarContent>
    </Sidebar>
  );
}
