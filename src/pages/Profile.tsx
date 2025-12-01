import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserData } from "@/utils/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Load user data
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
    }
  }, [user, isAuthenticated, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) return;

      // Validate password change if requested
      if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
          toast({
            title: "Current password required",
            description: "Please enter your current password to change it.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!newPassword) {
          toast({
            title: "New password required",
            description: "Please enter a new password.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "New password and confirmation must match.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (newPassword.length < 8) {
          toast({
            title: "Password too short",
            description: "Password must be at least 8 characters.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Call API to update profile
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:8888/api'
        : '/api';

      const response = await fetch(`${API_BASE}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      const result = await response.json();

      // Update local user data
      updateUserData(result.user);
      refreshUser();

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Profile updated!",
        description: result.message || "Your changes have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);

    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:8888/api'
        : '/api';

      const response = await fetch(`${API_BASE}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          password: deletePassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Account deletion failed');
      }

      // Close dialog
      setShowDeleteDialog(false);

      // Show success message
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      // Logout and redirect to home
      logout();
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "Could not delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletePassword("");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          {/* Profile Information */}
          <Card className="p-6 shadow-lg animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to keep your current password
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>

          {/* User Stats (if available) */}
          {user.stats && (
            <Card className="p-6 shadow-lg animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exercises Completed</p>
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.total_exercises_completed}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.accuracy}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Answers</p>
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.total_answers}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.current_streak} days
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Account Info */}
          <Card className="p-6 shadow-lg animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Account Info</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {user.created_at && (
                <p>
                  <strong>Member since:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              )}
              {user.last_login && (
                <p>
                  <strong>Last login:</strong>{" "}
                  {new Date(user.last_login).toLocaleString()}
                </p>
              )}
            </div>
          </Card>

          {/* Danger Zone - Delete Account */}
          <Card className="p-6 shadow-lg animate-fade-in border-destructive">
            <h2 className="text-2xl font-semibold mb-4 text-destructive">Danger Zone</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. This action cannot be undone.
                All your data, including progress and statistics, will be permanently deleted.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </p>
              <div className="space-y-2">
                <Label htmlFor="delete-password" className="text-foreground">
                  Enter your password to confirm:
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="Your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  disabled={isDeleting}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deletePassword}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
