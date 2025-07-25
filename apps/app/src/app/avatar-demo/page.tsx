"use client";

import { UserAvatar, Avatar, AvatarImage, AvatarFallback } from "@mindmark/ui/avatar";
import { UserProfile } from "@mindmark/ui/user-profile";
import { ThemeToggle } from "@mindmark/ui/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@mindmark/ui/card";
import { Badge } from "@mindmark/ui/badge";
import { Button } from "@mindmark/ui/button";

const mockUser = {
  id: "1",
  email: "john.doe@example.com",
  name: "John Doe",
  avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  created_at: "2024-01-15T10:30:00Z",
  last_active: "2024-12-19T15:45:00Z",
};

const mockUserNoAvatar = {
  id: "2",
  email: "jane.smith@example.com",
  name: "Jane Smith",
  created_at: "2024-03-20T14:20:00Z",
};

const mockUserEmailOnly = {
  id: "3",
  email: "developer@mindmark.app",
  created_at: "2024-06-10T09:15:00Z",
};

export default function AvatarDemoPage() {
  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Avatar & User Profile Demo</h1>
        <p className="text-muted-foreground">
          Testing enhanced avatar system, user profiles, and theme switching
        </p>
      </div>

      {/* Avatar Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar Variants & Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Size Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Size Variants</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="xs" />
                <p className="text-xs mt-1">XS</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="sm" />
                <p className="text-xs mt-1">SM</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="md" />
                <p className="text-xs mt-1">MD</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="lg" />
                <p className="text-xs mt-1">LG</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="xl" />
                <p className="text-xs mt-1">XL</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="2xl" />
                <p className="text-xs mt-1">2XL</p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Status Indicators</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="lg" status="online" />
                <p className="text-xs mt-1">Online</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="lg" status="offline" />
                <p className="text-xs mt-1">Offline</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="lg" status="busy" />
                <p className="text-xs mt-1">Busy</p>
              </div>
              <div className="text-center">
                <UserAvatar src={mockUser.avatar_url} name={mockUser.name} size="lg" status="away" />
                <p className="text-xs mt-1">Away</p>
              </div>
            </div>
          </div>

          {/* Fallback Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Fallback Examples</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <UserAvatar name="John Doe" size="lg" />
                <p className="text-xs mt-1">Name Initials</p>
              </div>
              <div className="text-center">
                <UserAvatar email="jane@example.com" size="lg" />
                <p className="text-xs mt-1">Email Initial</p>
              </div>
              <div className="text-center">
                <UserAvatar size="lg" />
                <p className="text-xs mt-1">Default</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Variants */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Compact Variant */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Compact Variant</h3>
            <div className="space-y-3">
              <UserProfile
                user={mockUser}
                variant="compact"
                onSignOut={handleSignOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
              <UserProfile
                user={mockUserNoAvatar}
                variant="compact"
                onSignOut={handleSignOut}
              />
            </div>
          </div>

          {/* Dropdown Variant */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Dropdown Variant</h3>
            <div className="flex gap-4">
              <UserProfile
                user={mockUser}
                variant="dropdown"
                onSignOut={handleSignOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
              <UserProfile
                user={mockUserEmailOnly}
                variant="dropdown"
                onSignOut={handleSignOut}
              />
            </div>
          </div>

          {/* Expanded Variant */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Expanded Variant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserProfile
                user={mockUser}
                variant="expanded"
                onSignOut={handleSignOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
              <UserProfile
                user={mockUserNoAvatar}
                variant="expanded"
                onSignOut={handleSignOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Toggle Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Toggle Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <ThemeToggle variant="toggle" />
              <p className="text-xs mt-1">Toggle</p>
            </div>
            <div className="text-center">
              <ThemeToggle variant="dropdown" />
              <p className="text-xs mt-1">Dropdown</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color System Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Brand Colors</h4>
              <div className="space-y-1">
                <Badge style={{ backgroundColor: "var(--brand-primary)", color: "white" }}>
                  Primary
                </Badge>
                <Badge style={{ backgroundColor: "var(--brand-secondary)", color: "white" }}>
                  Secondary
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Semantic Actions</h4>
              <div className="space-y-1">
                <Badge style={{ backgroundColor: "var(--semantic-success)", color: "white" }}>
                  Success
                </Badge>
                <Badge style={{ backgroundColor: "var(--semantic-warning)", color: "white" }}>
                  Warning
                </Badge>
                <Badge style={{ backgroundColor: "var(--semantic-danger)", color: "white" }}>
                  Danger
                </Badge>
                <Badge style={{ backgroundColor: "var(--semantic-info)", color: "white" }}>
                  Info
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Cognitive Support</h4>
              <div className="space-y-1">
                <Badge style={{ backgroundColor: "var(--cognitive-focus)", color: "white" }}>
                  Focus
                </Badge>
                <Badge style={{ backgroundColor: "var(--cognitive-memory)", color: "white" }}>
                  Memory
                </Badge>
                <Badge style={{ backgroundColor: "var(--cognitive-calm)", color: "white" }}>
                  Calm
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Content Types</h4>
              <div className="space-y-1">
                <Badge style={{ backgroundColor: "var(--content-article)", color: "white" }}>
                  Article
                </Badge>
                <Badge style={{ backgroundColor: "var(--content-video)", color: "white" }}>
                  Video
                </Badge>
                <Badge style={{ backgroundColor: "var(--content-tool)", color: "white" }}>
                  Tool
                </Badge>
                <Badge style={{ backgroundColor: "var(--content-reference)", color: "white" }}>
                  Reference
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
