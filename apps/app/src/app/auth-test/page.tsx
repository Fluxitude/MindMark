"use client";

import { useAuth } from "@mindmark/supabase";
import { UserProfile } from "@mindmark/ui/user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@mindmark/ui/card";
import { Button } from "@mindmark/ui/button";
import { Badge } from "@mindmark/ui/badge";
import { Skeleton } from "@mindmark/ui/skeleton";

export default function AuthTestPage() {
  const { user, loading, signOut } = useAuth();

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Authentication...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Authentication Test</h1>
        <p className="text-muted-foreground">
          Testing dynamic user authentication and profile display
        </p>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={user ? "default" : "destructive"}>
              {user ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {user && (
              <Badge variant="secondary">
                User ID: {user.id.slice(0, 8)}...
              </Badge>
            )}
          </div>

          {user && (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
              {user.user_metadata?.full_name && (
                <p><strong>Full Name:</strong> {user.user_metadata.full_name}</p>
              )}
              {user.user_metadata?.avatar_url && (
                <p><strong>Avatar URL:</strong> {user.user_metadata.avatar_url}</p>
              )}
            </div>
          )}

          {!user && (
            <div className="space-y-2">
              <p>No user is currently authenticated.</p>
              <Button asChild>
                <a href="/auth/login">Sign In</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Profile Components */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>User Profile Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compact Variant */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Compact Variant</h3>
              <UserProfile
                user={{
                  id: user.id,
                  email: user.email || undefined,
                  name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
                  avatar_url: user.user_metadata?.avatar_url || undefined,
                  created_at: user.created_at,
                }}
                variant="compact"
                onSignOut={signOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
            </div>

            {/* Dropdown Variant */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Dropdown Variant</h3>
              <UserProfile
                user={{
                  id: user.id,
                  email: user.email || undefined,
                  name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
                  avatar_url: user.user_metadata?.avatar_url || undefined,
                  created_at: user.created_at,
                }}
                variant="dropdown"
                onSignOut={signOut}
                onEditProfile={handleEditProfile}
                onSettings={handleSettings}
              />
            </div>

            {/* Expanded Variant */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Expanded Variant</h3>
              <div className="max-w-md">
                <UserProfile
                  user={{
                    id: user.id,
                    email: user.email || undefined,
                    name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
                    avatar_url: user.user_metadata?.avatar_url || undefined,
                    created_at: user.created_at,
                  }}
                  variant="expanded"
                  onSignOut={signOut}
                  onEditProfile={handleEditProfile}
                  onSettings={handleSettings}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw User Data */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Raw User Data (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
