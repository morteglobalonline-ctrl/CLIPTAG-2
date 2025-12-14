import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Mail, Shield, Check } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProfilePage = () => {
  const { user, getAuthHeader, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/profile?name=${encodeURIComponent(name)}`, null, {
        headers: getAuthHeader()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const planDetails = {
    free: { name: 'Free', color: '#52525B' },
    standard: { name: 'Standard', color: '#FF5F1F' },
    pro: { name: 'Pro', color: '#FF5F1F' }
  };

  const currentPlan = planDetails[user?.plan] || planDetails.free;

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#27272A]">
            <div className="w-16 h-16 bg-[#27272A] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#A1A1AA]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
              <p className="text-[#A1A1AA]">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                data-testid="profile-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-[#121212] border border-[#27272A] rounded-md px-4 py-3">
                <Mail className="w-5 h-5 text-[#52525B]" />
                <span className="text-[#A1A1AA]">{user?.email}</span>
              </div>
              <p className="text-[#52525B] text-xs mt-2">Email cannot be changed</p>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || name === user?.name}
              className="bg-[#FF5F1F] text-black font-bold hover:bg-[#FF7A45] disabled:opacity-50"
              data-testid="profile-save"
            >
              {saving ? 'Saving...' : saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Saved!
                </>
              ) : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#FF5F1F]" />
            <h3 className="text-lg font-semibold text-white">Subscription</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg">
            <div>
              <p className="text-white font-medium">Current Plan</p>
              <p className="text-[#52525B] text-sm">
                {user?.plan === 'free' ? 'No active subscription' : 'Active subscription'}
              </p>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${currentPlan.color}20`,
                color: currentPlan.color
              }}
            >
              {currentPlan.name}
            </span>
          </div>

          <Button
            onClick={() => window.location.href = '/pricing'}
            variant="outline"
            className="w-full mt-4 border-[#27272A] text-white hover:bg-white/5"
            data-testid="upgrade-plan"
          >
            {user?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0A0A0A] border border-red-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
          <p className="text-[#A1A1AA] text-sm mb-4">
            Once you sign out, you'll need to log in again to access your account.
          </p>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            data-testid="profile-logout"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
