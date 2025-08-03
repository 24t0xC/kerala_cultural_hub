import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function SignupForm({ onClose, onSwitchToLogin }) {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const roleOptions = [
    { value: 'user', label: 'Cultural Enthusiast' },
    { value: 'artist', label: 'Artist/Performer' },
    { value: 'organizer', label: 'Event Organizer' }
  ]

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

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData?.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required'
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData?.phone && !/^\+?[\d\s-()]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    const { error } = await signUp(formData?.email, formData?.password, {
      full_name: formData?.fullName,
      role: formData?.role,
      phone: formData?.phone
    })
    
    if (error) {
      setErrors({ submit: error })
    } else {
      // Show success message
      setErrors({ 
        success: 'Account created successfully! Please check your email to verify your account.' 
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join Kerala Cultural Events</h2>
        <p className="text-gray-600 mt-2">Create your account to explore Kerala's culture</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData?.fullName}
              onChange={handleChange}
              className={`pl-10 ${errors?.fullName ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
          </div>
          {errors?.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors?.fullName}</p>
          )}
        </div>

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
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            I am a...
          </label>
          <Select
            id="role"
            name="role"
            value={formData?.role}
            onChange={handleChange}
            options={roleOptions}
            className={errors?.role ? 'border-red-500' : ''}
          />
          {errors?.role && (
            <p className="text-red-500 text-sm mt-1">{errors?.role}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData?.phone}
            onChange={handleChange}
            className={errors?.phone ? 'border-red-500' : ''}
            placeholder="Enter your phone number"
          />
          {errors?.phone && (
            <p className="text-red-500 text-sm mt-1">{errors?.phone}</p>
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
              placeholder="Create a password"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData?.confirmPassword}
              onChange={handleChange}
              className={`pl-10 pr-10 ${errors?.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors?.confirmPassword}</p>
          )}
        </div>

        {errors?.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors?.submit}</p>
          </div>
        )}

        {errors?.success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{errors?.success}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}