import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';


const LoginForm = ({ onSubmit, isLoading, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
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
            placeholder="Enter your password"
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
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleChange}
          disabled={isLoading}
        />
        
        <Button
          variant="link"
          size="sm"
          onClick={onForgotPassword}
          disabled={isLoading}
          className="text-primary hover:text-primary/80"
        >
          Forgot Password?
        </Button>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        iconName="LogIn"
        iconPosition="left"
        iconSize={18}
        className="w-full mt-6"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;