import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService, UserUpdateData } from "../services/userService";
import toast from "react-hot-toast";
import {
  UserCircle,
  Phone,
  User as UserIcon,
  Mail,
  MapPin,
  Calendar,
  Users,
  Edit3,
  Save,
  Sparkles,
  Camera,
  Shield,
} from "lucide-react";

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.firstName.trim()) {
        toast.error("First name is required");
        return;
      }
      
      if (!formData.lastName.trim()) {
        toast.error("Last name is required");
        return;
      }
      
      if (!formData.phone.trim()) {
        toast.error("Phone number is required");
        return;
      }

      const updateData: UserUpdateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
      };

      console.log("Updating profile with data:", updateData);
      
      const updatedUser = await userService.updateProfile(updateData);
      console.log("Profile updated successfully:", updatedUser);
      
      // Refresh user data in context
      await refreshUser();
      
      setSuccess(true);
      toast.success("Profile updated successfully!");
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message && error.message !== "Failed to update profile") {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Stats for user activity
  const stats = [
    {
      label: "Events Organized",
      value: 0,
      icon: <Calendar className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Events Attended",
      value: 0,
      icon: <Users className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Total Registrations",
      value: 0,
      icon: <Shield className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative flex items-start justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">

          {/* Main Profile Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-500 animate-slideUp mb-8">

            {/* Header Section */}
            <div className="flex flex-col items-center mb-10 animate-fadeIn">
              <div className="relative mb-6 group">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full p-1 animate-spin-slow">
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                      <UserCircle className="w-20 h-20 text-slate-300" />
                    </div>
                  </div>

                  {/* Edit Avatar Button */}
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group-hover:animate-bounce">
                    <Camera className="w-5 h-5 text-white" />
                  </button>

                  {/* Sparkle effect */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 animate-slideUp" style={{ animationDelay: '200ms' }}>
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-slate-400 text-lg flex items-center justify-center gap-2 animate-slideUp" style={{ animationDelay: '300ms' }}>
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-slate-500 text-sm mt-2 animate-slideUp" style={{ animationDelay: '400ms' }}>
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"} ✨
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="group animate-slideUp" style={{ animationDelay: '500ms' }}>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2 group-hover:text-blue-400 transition-colors duration-300">
                    <UserIcon className="w-4 h-4 text-blue-400" />
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your first name"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Last Name */}
                <div className="group animate-slideUp" style={{ animationDelay: '600ms' }}>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2 group-hover:text-purple-400 transition-colors duration-300">
                    <UserIcon className="w-4 h-4 text-purple-400" />
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your last name"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group animate-slideUp" style={{ animationDelay: '700ms' }}>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-4 bg-slate-700/30 border border-slate-600/30 rounded-xl text-slate-400 placeholder-slate-500 cursor-not-allowed opacity-60"
                    placeholder="Email Address"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Shield className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group animate-slideUp" style={{ animationDelay: '800ms' }}>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2 group-hover:text-indigo-400 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Address */}
              <div className="group animate-slideUp" style={{ animationDelay: '900ms' }}>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2 group-hover:text-emerald-400 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your address"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-slideUp" style={{ animationDelay: '1000ms' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="text-center animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 font-medium">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Profile updated successfully!
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp" style={{ animationDelay: '1100ms' }}>
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeIn`}
                style={{ animationDelay: `${1200 + idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 group-hover:w-full`} style={{ width: '20%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
