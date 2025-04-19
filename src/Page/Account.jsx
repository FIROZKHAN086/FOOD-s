import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Account = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || ''
      }));
    } else {
      
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const reauthenticate = async (currentPassword) => {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.currentPassword) {
        toast.error("Current password required for changes.");
        return;
      }

      // Re-authenticate
      await reauthenticate(formData.currentPassword);

      // Update display name
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      // Update email
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Update password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Passwords don't match!");
          return;
        }
        await updatePassword(user, formData.newPassword);
      }

      toast.success("Profile updated successfully!");
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      navigate('/')
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate('/');
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen my-10 bg-gray-50 pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <button onClick={() => navigate('/')} className="text-white">
                <FaTimes />
              </button>
            </div>
            <p className="text-purple-100 mt-2">Manage your account securely</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {[
              { label: "Display Name", name: "displayName", type: "text", icon: <FaUser /> },
              { label: "Email", name: "email", type: "email", icon: <FaEnvelope /> },
              { label: "Current Password", name: "currentPassword", type: "password", icon: <FaLock /> },
              { label: "New Password", name: "newPassword", type: "password", icon: <FaLock /> },
              { label: "Confirm Password", name: "confirmPassword", type: "password", icon: <FaLock /> },
            ].map(({ label, name, type, icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {icon}
                  </div>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FaSignOutAlt />
                Sign Out
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
