import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onClose, onSwitchToSignup }) {
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e?.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    const { error } = await signIn(formData?.email, formData?.password)
    
    if (error) {
      setErrors({ submit: error })
    } else {
      onClose?.()
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to access Kerala Cultural Events</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData?.email}
              onChange={handleChange}
              className={`pl-10 ${errors?.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
            />
          </div>
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors?.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData?.password}
              onChange={handleChange}
              className={`pl-10 pr-10 ${errors?.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">{errors?.password}</p>
          )}
        </div>

        {errors?.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors?.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
          <p className="text-blue-800 text-sm font-medium mb-1">Demo Credentials:</p>
          <p className="text-blue-700 text-xs">
            Admin: admin@keralaevents.com / admin123<br/>
            Organizer: organizer@example.com / organizer123<br/>
            User: user@example.com / user123
          </p>
        </div>
      </form>
    </div>
  );
}