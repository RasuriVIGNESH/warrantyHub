import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Camera, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

export function UpdateProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await authService.getProfile();
        const profileData = response.user || response;
        setUserProfile(profileData);
        
        // Set form values
        setValue('name', profileData.name || profileData.username || '');
        setValue('email', profileData.email || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const success = await updateProfile(data);
      if (success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only accept images less than 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      // TODO: Implement image upload to your backend/storage
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  if (isLoadingProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={handleBackToProfile}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Profile
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name || userProfile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new profile picture
              </p>
            </div>

            {/* Profile Form Section */}
            <div className="flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBackToProfile}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account Security
                </h3>
                <div className="space-y-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => {
                      toast.info('Change password functionality coming soon');
                    }}
                  >
                    Change Password
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {
                      toast.info('Delete account functionality coming soon');
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

