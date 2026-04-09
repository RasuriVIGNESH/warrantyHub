import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const success = await updateProfile(data);
      if (success) {
        toast.success('Profile updated successfully');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h2>
            <button
              onClick={() => navigate('/profile/edit')}
              className="inline-flex items-center px-4 py-2 border border-primary rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 