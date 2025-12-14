import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Video, 
  BookOpen, 
  LayoutGrid, 
  Mic, 
  FileText, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const tools = [
    {
      icon: Video,
      title: 'Generate Clips',
      description: 'Create viral video clip scripts with AI',
      path: '/dashboard/clips',
      color: '#FF5F1F'
    },
    {
      icon: BookOpen,
      title: 'Story Videos',
      description: 'Build compelling narrative videos',
      path: '/dashboard/story',
      color: '#FF5F1F'
    },
    {
      icon: LayoutGrid,
      title: 'Split Screen',
      description: 'Design engaging dual-view content',
      path: '/dashboard/split-screen',
      color: '#FF5F1F'
    },
    {
      icon: Mic,
      title: 'AI Voiceover',
      description: 'Transform text to voiceover scripts',
      path: '/dashboard/voiceover',
      color: '#FF5F1F'
    },
    {
      icon: FileText,
      title: 'Transcription',
      description: 'Generate captions and subtitles',
      path: '/dashboard/transcription',
      color: '#FF5F1F'
    },
    {
      icon: TrendingUp,
      title: 'Video Ranking',
      description: 'Optimize for YouTube SEO',
      path: '/dashboard/ranking',
      color: '#FF5F1F'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-[#A1A1AA]">
            What would you like to create today?
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                to={tool.path}
                data-testid={`tool-${tool.title.toLowerCase().replace(' ', '-')}`}
                className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 hover:border-[#FF5F1F]/50 hover:shadow-[0_0_30px_rgba(255,95,31,0.1)] transition-all duration-300 group"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: tool.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5F1F] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[#A1A1AA] text-sm">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/library"
              className="flex items-center gap-4 p-4 bg-[#050505] rounded-lg hover:bg-[#121212] transition-colors"
              data-testid="quick-library"
            >
              <div className="w-10 h-10 bg-[#27272A] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <p className="text-white font-medium">Your Library</p>
                <p className="text-[#52525B] text-sm">View all generated content</p>
              </div>
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-4 p-4 bg-[#050505] rounded-lg hover:bg-[#121212] transition-colors"
              data-testid="quick-profile"
            >
              <div className="w-10 h-10 bg-[#27272A] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <p className="text-white font-medium">Your Profile</p>
                <p className="text-[#52525B] text-sm">Manage account settings</p>
              </div>
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-4 p-4 bg-[#050505] rounded-lg hover:bg-[#121212] transition-colors"
              data-testid="quick-upgrade"
            >
              <div className="w-10 h-10 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FF5F1F]" />
              </div>
              <div>
                <p className="text-white font-medium">Upgrade Plan</p>
                <p className="text-[#52525B] text-sm">Get more features</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
