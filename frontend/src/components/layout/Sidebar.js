import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  FolderOpen, 
  User, 
  LogOut, 
  Zap,
  Video,
  BookOpen,
  Mic,
  FileText,
  TrendingUp,
  Scissors,
  LayoutGrid
} from 'lucide-react';

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Library', path: '/dashboard/library', icon: FolderOpen },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const toolLinks = [
    { name: 'Generate Clips', path: '/dashboard/clips', icon: Video },
    { name: 'Story Videos', path: '/dashboard/story', icon: BookOpen },
    { name: 'Split Screen', path: '/dashboard/split-screen', icon: LayoutGrid },
    { name: 'AI Voiceover', path: '/dashboard/voiceover', icon: Mic },
    { name: 'Transcription', path: '/dashboard/transcription', icon: FileText },
    { name: 'Video Ranking', path: '/dashboard/ranking', icon: TrendingUp },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0A0A0A] border-r border-[#27272A] pt-4 flex flex-col z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-6 py-4 mb-4">
        <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-xl text-white">ClipTag AI</span>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`sidebar-${link.name.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/20'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Tools Section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-[#52525B] uppercase tracking-wider mb-3">
            AI Tools
          </h3>
          <div className="space-y-1">
            {toolLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`sidebar-${link.name.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/20'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-[#27272A] p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-[#27272A] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-[#A1A1AA]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[#52525B] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          data-testid="sidebar-logout"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
