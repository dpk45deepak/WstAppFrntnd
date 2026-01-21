import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'driver']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      showToast(error.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card
        padding="lg"
        className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-teal-700">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join <span className="font-semibold text-teal-600">WstApp</span> today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Join as
            </label>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'user', icon: '👤', title: 'User', desc: 'Schedule pickups' },
                { value: 'driver', icon: '🚚', title: 'Driver', desc: 'Provide services' },
              ].map((role) => (
                <label
                  key={role.value}
                  className={`group relative cursor-pointer rounded-xl border p-1 mb-2 text-center transition-all
                    ${
                      selectedRole === role.value
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-400'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={role.value}
                    className="sr-only"
                    {...register('role')}
                  />
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {role.title}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {role.desc}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
            className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg"
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-teal-600 hover:text-teal-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
