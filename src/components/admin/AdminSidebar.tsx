import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Shield, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card className={cn(
      "h-screen p-4 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "px-2"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && tab.label}
              </Button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-3 text-red-600 hover:text-red-700",
              isCollapsed && "px-2"
            )}
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
