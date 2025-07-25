"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import { UserAvatar } from "./avatar";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { cn } from "../utils/cn";
import { 
  Settings, 
  LogOut, 
  User, 
  Mail, 
  Calendar,
  Shield,
  Palette,
  Bell,
  ChevronDown,
  Edit
} from "lucide-react";

interface UserProfileProps {
  user?: {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    created_at?: string;
    last_active?: string;
  } | null;
  onSignOut?: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
  variant?: "compact" | "expanded" | "dropdown";
  showThemeToggle?: boolean;
  className?: string;
}

export function UserProfile({
  user,
  onSignOut,
  onEditProfile,
  onSettings,
  variant = "compact",
  showThemeToggle = true,
  className,
}: UserProfileProps) {
  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </div>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : null;

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-2 h-auto p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              className
            )}
          >
            <UserAvatar
              src={user.avatar_url}
              name={user.name}
              email={user.email}
              size="sm"
              status="online"
            />
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center gap-3 p-3">
            <UserAvatar
              src={user.avatar_url}
              name={user.name}
              email={user.email}
              size="md"
              status="online"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{displayName}</span>
              <span className="text-sm text-muted-foreground truncate">
                {user.email}
              </span>
              {joinDate && (
                <span className="text-xs text-muted-foreground">
                  Joined {joinDate}
                </span>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          {onEditProfile && (
            <DropdownMenuItem onClick={onEditProfile}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </DropdownMenuItem>
          )}
          {onSettings && (
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {onSignOut && (
            <DropdownMenuItem onClick={onSignOut} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "expanded") {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-4">
            <UserAvatar
              src={user.avatar_url}
              name={user.name}
              email={user.email}
              size="xl"
              status="online"
            />
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {joinDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {joinDate}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          {joinDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {joinDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Shield className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          </div>
          
          <div className="flex gap-2 pt-4">
            {onEditProfile && (
              <Button variant="outline" size="sm" onClick={onEditProfile} className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
            {showThemeToggle && (
              <ThemeToggle variant="dropdown" />
            )}
          </div>
          
          <div className="flex gap-2">
            {onSettings && (
              <Button variant="outline" size="sm" onClick={onSettings} className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}
            {onSignOut && (
              <Button variant="destructive" size="sm" onClick={onSignOut} className="flex-1">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant (default)
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <UserAvatar
        src={user.avatar_url}
        name={user.name}
        email={user.email}
        size="sm"
        status="online"
        className="shrink-0"
      />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <span className="text-sm font-medium truncate max-w-full">{displayName}</span>
        <span className="text-xs text-muted-foreground truncate max-w-full">
          {user.email}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {showThemeToggle && (
          <ThemeToggle size="sm" />
        )}
        {onSignOut && (
          <Button variant="ghost" size="icon" onClick={onSignOut} className="h-8 w-8">
            <LogOut className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export type { UserProfileProps };
