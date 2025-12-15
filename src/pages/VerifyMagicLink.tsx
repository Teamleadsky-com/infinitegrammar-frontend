import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserData } from "@/utils/auth";

type VerificationStatus = 'verifying' | 'success' | 'error';

const VerifyMagicLink = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setErrorMessage('No token provided');
        return;
      }

      try {
        const API_BASE = import.meta.env.DEV
          ? 'http://localhost:8888/api'
          : '/api';

        const response = await fetch(`${API_BASE}/verify-magic-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to verify magic link');
        }

        const result = await response.json();

        // Save user data and refresh auth context
        updateUserData(result.user);
        refreshUser();

        setStatus('success');

        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to verify magic link');
      }
    };

    verifyToken();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl animate-fade-in">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Verifying Magic Link</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your magic link...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              <h1 className="text-2xl font-bold mb-2 text-success">Success!</h1>
              <p className="text-muted-foreground mb-4">
                You've been successfully logged in. Redirecting to home...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-2 text-destructive">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">
                {errorMessage || 'This magic link is invalid or has expired.'}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  Back to Login
                </Button>
                <p className="text-sm text-muted-foreground">
                  You can request a new magic link from the login page.
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyMagicLink;
