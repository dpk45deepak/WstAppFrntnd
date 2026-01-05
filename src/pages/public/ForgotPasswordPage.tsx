// src/pages/public/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import api from '../../services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // Password reset not implemented in backend. Inform user.
      setEmailSent(true);
      showToast('Password reset is not available. Contact support.', 'warning');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset instructions';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      showToast('Password reset is not available. Contact support.', 'warning');
    } catch (error: any) {
      showToast('Failed to resend email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {emailSent ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Mail className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          {emailSent ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-600 mt-2">
                We've sent password reset instructions to:
              </p>
              <p className="font-medium text-blue-600 mt-1">{email}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
              <p className="text-gray-600 mt-2">
                Enter your email to receive reset instructions
              </p>
            </>
          )}
        </div>

        {emailSent ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                If you don't see the email in your inbox, check your spam folder. 
                The reset link will expire in 1 hour.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                loading={loading}
                fullWidth
                size="lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Email
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                fullWidth
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              {...register('email')}
            />

            <Button 
              type="submit" 
              loading={loading} 
              fullWidth
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;