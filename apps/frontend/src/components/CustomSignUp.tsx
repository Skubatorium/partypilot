import { useSignUp } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { TestId } from '../types/test-ids';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

interface AddressData {
  properties: {
    formatted: string;
    city: string;
    postcode: string;
    street: string;
    housenumber: string;
    country: string;
  };
}

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
  passwordConfirm: boolean | null;
  firstName: boolean | null;
  lastName: boolean | null;
  dateOfBirth: boolean | null;
  address: boolean | null;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
}

const PASSWORD_REQUIREMENTS = {
  minLength: 6,
  hasUpperCase: true,
  hasNumber: true,
};

export function CustomSignUp() {
  const { t } = useTranslation();
  const { signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [hasStartedTypingPassword, setHasStartedTypingPassword] = useState(false);
  const [passwordConfirmBlurred, setPasswordConfirmBlurred] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Deutschland'
  });

  const [validation, setValidation] = useState<ValidationState>({
    email: null,
    password: null,
    passwordConfirm: null,
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    address: null,
  });

  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  };

  const validatePassword = (password: string): boolean => {
    const requirements = validatePasswordRequirements(password);
    return Object.values(requirements).every(Boolean);
  };

  const validatePasswordMatch = (): boolean => {
    return formData.password === formData.passwordConfirm && formData.passwordConfirm.length > 0;
  };

  useEffect(() => {
    if (!hasStartedTypingPassword) return;
    
    const requirements = validatePasswordRequirements(formData.password);
    setPasswordRequirements(requirements);
    setValidation(prev => ({
      ...prev,
      password: Object.values(requirements).every(Boolean)
    }));
  }, [formData.password, hasStartedTypingPassword]);

  const handleEmailBlur = () => {
    const isValid = validateEmail(formData.emailAddress);
    setValidation(prev => ({
      ...prev,
      email: isValid
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, password: e.target.value }));
    setHasStartedTypingPassword(true);
    setShowPasswordRequirements(true);
  };

  const handlePasswordFocus = () => {
    setShowPasswordRequirements(true);
  };

  const handlePasswordBlur = () => {
    if (Object.values(passwordRequirements).every(Boolean)) {
      setShowPasswordRequirements(false);
    }
  };

  const handlePasswordConfirmBlur = () => {
    setPasswordConfirmBlurred(true);
    setValidation(prev => ({
      ...prev,
      passwordConfirm: validatePasswordMatch()
    }));
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, passwordConfirm: e.target.value }));
  };

  const handleAddressSelect = (location: AddressData) => {
    if (location && location.properties) {
      setFormData(prev => ({
        ...prev,
        street: location.properties.street || '',
        houseNumber: location.properties.housenumber || '',
        postalCode: location.properties.postcode || '',
        city: location.properties.city || '',
        country: location.properties.country || 'Deutschland'
      }));
      setValidation(prev => ({
        ...prev,
        address: true
      }));
    }
  };

  const validateForm = (): boolean => {
    const isValid = Object.values(validation).every(v => v === true);
    
    if (!isValid) {
      setError(t('auth.errorValidation'));
    } else {
      setError('');
    }

    return isValid;
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Handle different date formats
    let date: Date | null = null;
    
    // Try parsing the input value
    if (value) {
      // First try direct parsing
      date = new Date(value);
      
      // If that fails, try parsing DD.MM.YYYY format
      if (isNaN(date.getTime())) {
        const parts = value.split('.');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
      }
      
      // If that fails, try parsing DD/MM/YYYY format
      if (isNaN(date.getTime())) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
      }
    }
    
    // If we have a valid date, format it as YYYY-MM-DD
    const formattedDate = date && !isNaN(date.getTime()) 
      ? date.toISOString().split('T')[0]
      : value;
    
    console.log('Date processing:', {
      input: value,
      parsed: date,
      formatted: formattedDate
    });
    
    setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
    setValidation(prev => ({ ...prev, dateOfBirth: date !== null && !isNaN(date.getTime()) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!signUp) throw new Error('SignUp not initialized');

      const signUpData = {
        emailAddress: formData.emailAddress,
        password: formData.password,
        unsafeMetadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: {
            street: formData.street,
            houseNumber: formData.houseNumber,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country
          },
          dateOfBirth: formData.dateOfBirth
        }
      };

      console.log('Attempting sign up with data:', JSON.stringify(signUpData, null, 2));
      
      const response = await signUp.create(signUpData);
      console.log('Signup successful:', response);

      // Set success message
      setSuccess(t('auth.registrationSuccess'));

      // Prepare verification if needed
      if (response.status === 'complete') {
        console.log('Signup complete, creating session...');
        if (response.createdSessionId) {
          await setActive({ session: response.createdSessionId });
          console.log('Session activated');
          
          // Wait a moment to show the success message
          await new Promise(resolve => setTimeout(resolve, 2000));
          navigate('/dashboard');
        }
      } else {
        console.log('Preparing email verification...');
        await signUp.prepareEmailAddressVerification();
        console.log('Email verification prepared');
        
        // Wait a moment to show the success message
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/verify-email');
      }

    } catch (err) {
      console.error('Error during sign up:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
      }
      if (err && typeof err === 'object' && 'response' in err) {
        console.error('API Error response:', err.response);
      }
      setError(t('auth.errorSignUp'));
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (validationState: boolean | null) => {
    const baseClasses = "relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    
    if (validationState === null) return `${baseClasses} ring-gray-300`;
    return validationState
      ? `${baseClasses} ring-green-500`
      : `${baseClasses} ring-red-500`;
  };

  const ValidationIcon = ({ isValid }: { isValid: boolean | null }) => {
    if (isValid === null) return null;
    return isValid ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
    );
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
      ) : (
        <XCircleIcon className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-red-700"}>{text}</span>
    </div>
  );

  if (!GEOAPIFY_API_KEY) {
    console.error('Geoapify API key is missing');
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-8" data-testid={TestId.ContainerAuthForm}>
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" data-testid={TestId.FormSignup}>
        <div className="space-y-4 rounded-md shadow-sm">
          {/* Email field */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">{t('auth.emailAddress')}</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={getInputClassName(validation.email)}
              placeholder={t('auth.emailAddress')}
              value={formData.emailAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
              onBlur={handleEmailBlur}
              data-testid={TestId.InputEmail}
            />
            <ValidationIcon isValid={validation.email} />
          </div>
          {validation.email === false && (
            <div className="text-sm text-red-600">
              {t('auth.emailInvalid')}
            </div>
          )}

          {/* Password field */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
            <input
              id="password"
              name="new-password"
              type="password"
              required
              autoComplete="new-password"
              className={getInputClassName(validation.password)}
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              data-testid={TestId.InputPassword}
            />
            <ValidationIcon isValid={validation.password} />
          </div>

          {/* Password Requirements */}
          {showPasswordRequirements && hasStartedTypingPassword && !validation.password && (
            <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-md">
              <div className="font-medium mb-2">{t('auth.passwordRequirements.title')}</div>
              <PasswordRequirement
                met={passwordRequirements.minLength}
                text={t('auth.passwordRequirements.minLength', { minLength: PASSWORD_REQUIREMENTS.minLength })}
              />
              <PasswordRequirement
                met={passwordRequirements.hasUpperCase}
                text={t('auth.passwordRequirements.uppercase')}
              />
              <PasswordRequirement
                met={passwordRequirements.hasNumber}
                text={t('auth.passwordRequirements.number')}
              />
            </div>
          )}

          {/* Password Confirmation field */}
          <div className="relative">
            <label htmlFor="passwordConfirm" className="sr-only">{t('auth.passwordConfirm')}</label>
            <input
              id="passwordConfirm"
              name="new-password"
              type="password"
              required
              autoComplete="new-password"
              className={getInputClassName(validation.passwordConfirm)}
              placeholder={t('auth.passwordConfirm')}
              value={formData.passwordConfirm}
              onChange={handlePasswordConfirmChange}
              onBlur={handlePasswordConfirmBlur}
              data-testid={TestId.InputPasswordConfirm}
            />
            <ValidationIcon isValid={validation.passwordConfirm} />
          </div>
          {passwordConfirmBlurred && validation.passwordConfirm === false && (
            <div className="text-sm text-red-600">
              {t('auth.passwordMismatch')}
            </div>
          )}

          {/* First Name field */}
          <div className="relative">
            <label htmlFor="firstName" className="sr-only">{t('auth.firstName')}</label>
            <input
              id="firstName"
              name="given-name"
              type="text"
              required
              autoComplete="given-name"
              className={getInputClassName(validation.firstName)}
              placeholder={t('auth.firstName')}
              value={formData.firstName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, firstName: e.target.value }));
                setValidation(prev => ({ ...prev, firstName: e.target.value.length > 0 }));
              }}
              data-testid={TestId.InputFirstName}
            />
            <ValidationIcon isValid={validation.firstName} />
          </div>

          {/* Last Name field */}
          <div className="relative">
            <label htmlFor="lastName" className="sr-only">{t('auth.lastName')}</label>
            <input
              id="lastName"
              name="family-name"
              type="text"
              required
              autoComplete="family-name"
              className={getInputClassName(validation.lastName)}
              placeholder={t('auth.lastName')}
              value={formData.lastName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lastName: e.target.value }));
                setValidation(prev => ({ ...prev, lastName: e.target.value.length > 0 }));
              }}
              data-testid={TestId.InputLastName}
            />
            <ValidationIcon isValid={validation.lastName} />
          </div>

          {/* Date of Birth field */}
          <div className="relative">
            <label htmlFor="dateOfBirth" className="sr-only">{t('auth.dateOfBirth')}</label>
            <input
              id="dateOfBirth"
              name="bday"
              type="date"
              required
              autoComplete="bday"
              className={getInputClassName(validation.dateOfBirth)}
              placeholder={t('auth.dateOfBirth')}
              value={formData.dateOfBirth}
              onChange={handleDateOfBirthChange}
              data-testid={TestId.InputDateOfBirth}
              max={new Date().toISOString().split('T')[0]}
            />
            <ValidationIcon isValid={validation.dateOfBirth} />
          </div>

          {/* Address Search */}
          <div className={`address-search-container relative ${validation.address ? 'valid' : ''}`}>
            <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
              <GeoapifyGeocoderAutocomplete
                placeholder={t('auth.addressSearch')}
                lang="de"
                countryCodes={['de']}
                limit={5}
                placeSelect={(place) => handleAddressSelect(place as AddressData)}
              />
            </GeoapifyContext>
            {validation.address && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>

          {/* Hidden Address Fields */}
          <input type="hidden" name="street-address" autoComplete="street-address" value={formData.street} />
          <input type="hidden" name="address-level2" autoComplete="address-level2" value={formData.city} />
          <input type="hidden" name="postal-code" autoComplete="postal-code" value={formData.postalCode} />
          <input type="hidden" name="country-name" autoComplete="country-name" value={formData.country} />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            data-testid={TestId.ButtonSignUp}
          >
            {isLoading ? t('auth.signingUp') : t('auth.createAccount')}
          </button>
        </div>
      </form>

      <style>
        {`
          .geoapify-autocomplete-input {
            border: 0;
            border-radius: 0.375rem;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5rem;
            color: #111827;
            width: 100%;
            outline: none;
            box-shadow: 0 0 0 1px #D1D5DB;
          }
          .geoapify-autocomplete-input:focus {
            box-shadow: 0 0 0 2px #4F46E5;
          }
          .address-search-container.valid .geoapify-autocomplete-input {
            box-shadow: 0 0 0 1px #22C55E !important;
          }
          .geoapify-close-button {
            display: none;
          }
          .geoapify-autocomplete-items {
            border: none;
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
        `}
      </style>
    </div>
  );
} 