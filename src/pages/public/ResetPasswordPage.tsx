// src/pages/public/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
// import api from '../../services/api';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [passwordReset] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        // Backend does not implement token validation. Mark invalid and inform user.
        setIsValidToken(false);
        showToast('Password reset is not supported by the backend.', 'warning');
      } catch (error) {
        setIsValidToken(false);
        showToast('Reset link is invalid or has expired', 'error');
      }
    };

    validateToken();
  }, [token, showToast]);

  const onSubmit = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // Backend does not provide password reset endpoint. Inform user.
      showToast('Password reset is not supported by the backend. Please contact support.', 'warning');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strength = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-red-400' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Good', color: 'bg-yellow-400' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' },
    };

    return { score, ...strength[score as keyof typeof strength] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  // Show loading while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center" padding="lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </Card>
      </div>
    );
  }

  // Redirect if token is invalid
  if (isValidToken === false) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {passwordReset ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Lock className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          {passwordReset ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Password Reset!</h1>
              <p className="text-gray-600 mt-2">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to login page...
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-gray-600 mt-2">
                Create a new secure password
              </p>
            </>
          )}
        </div>

        {passwordReset ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-800">
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/login')}
              fullWidth
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Input */}
            <div>
              <Input
                label="New Password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                icon={<Lock className="w-4 h-4 text-gray-400" />}
                {...register('password')}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score >= 4 ? 'text-green-600' :
                      passwordStrength.score >= 3 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className={`flex items-center ${password?.length >= 8 ? 'text-green-600' : ''}`}>
                  {password?.length >= 8 ? (
                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                  )}
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(password || '') ? 'text-green-600' : ''}`}>
                  {/[A-Z]/.test(password || '') ? (
                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                  )}
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/[a-z]/.test(password || '') ? 'text-green-600' : ''}`}>
                  {/[a-z]/.test(password || '') ? (
                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                  )}
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/[0-9]/.test(password || '') ? 'text-green-600' : ''}`}>
                  {/[0-9]/.test(password || '') ? (
                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                  )}
                  One number
                </li>
                <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password || '') ? 'text-green-600' : ''}`}>
                  {/[^A-Za-z0-9]/.test(password || '') ? (
                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                  )}
                  One special character
                </li>
              </ul>
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm New Password"
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              {...register('confirmPassword')}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {confirmPasswordVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <Button 
              type="submit" 
              loading={loading} 
              fullWidth
              size="lg"
              disabled={!password}
            >
              Reset Password
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;