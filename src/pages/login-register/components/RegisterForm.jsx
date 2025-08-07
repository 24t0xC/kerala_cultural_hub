import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';


const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userTypeOptions = [
    { value: 'enthusiast', label: 'Cultural Enthusiast', description: 'Discover and attend cultural events' },
    { value: 'artist', label: 'Artist', description: 'Showcase your talent and connect with audiences' },
    { value: 'organizer', label: 'Event Organizer', description: 'Create and manage cultural events' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-error';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeChange = (value) => {
    setFormData(prev => ({ ...prev, userType: value }));
    if (errors?.userType) {
      setErrors(prev => ({ ...prev, userType: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.userType) {
      newErrors.userType = 'Please select your user type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData?.name}
        onChange={handleChange}
        error={errors?.name}
        required
        disabled={isLoading}
      />
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData?.email}
        onChange={handleChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div>
        {/* Custom Password Input with Show/Hide Toggle */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              errors?.password ? "text-destructive" : "text-foreground"
            )}
          >
            Password
            <span className="text-destructive ml-1">*</span>
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors?.password && "border-destructive focus-visible:ring-destructive"
              )}
            />
            
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon 
                name={showPassword ? "EyeOff" : "Eye"} 
                size={16}
                className="transition-colors"
              />
            </button>
          </div>

          {errors?.password && (
            <p className="text-sm text-destructive">
              {errors?.password}
            </p>
          )}
        </div>
        
        {formData?.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Password strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength < 25 ? 'text-error' :
                passwordStrength < 50 ? 'text-warning' :
                passwordStrength < 75 ? 'text-accent' : 'text-success'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Custom Confirm Password Input with Show/Hide Toggle */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            errors?.confirmPassword ? "text-destructive" : "text-foreground"
          )}
        >
          Confirm Password
          <span className="text-destructive ml-1">*</span>
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors?.confirmPassword && "border-destructive focus-visible:ring-destructive"
            )}
          />
          
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <Icon 
              name={showConfirmPassword ? "EyeOff" : "Eye"} 
              size={16}
              className="transition-colors"
            />
          </button>
        </div>

        {errors?.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors?.confirmPassword}
          </p>
        )}
      </div>
      <Select
        label="I am a..."
        placeholder="Select your role"
        options={userTypeOptions}
        value={formData?.userType}
        onChange={handleUserTypeChange}
        error={errors?.userType}
        required
        disabled={isLoading}
        className="mb-2"
      />
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        iconSize={18}
        className="w-full mt-6"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;