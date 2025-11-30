import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserData } from "@/utils/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
      // Update user data locally (API endpoint for updating user would go here)
      if (user) {
        const updatedUser = { ...user, name };
        updateUserData(updatedUser);
        refreshUser();

        toast({
          title: "Profile updated!",
          description: "Your changes have been saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  type="text"
                  value={user.id}
                  disabled
                  className="bg-muted cursor-not-allowed font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Your unique user identifier
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
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
              <p className="text-xs pt-4">
                <strong>Note:</strong> Password authentication is not yet implemented in
                this MVP. We use email-only authentication.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
