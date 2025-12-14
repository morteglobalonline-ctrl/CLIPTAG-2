import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TrendingUp, Sparkles, Copy, Check } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RankingPage = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const { getAuthHeader } = useAuth();

  const popularNiches = ['Tech', 'Gaming', 'Finance', 'Health', 'Lifestyle', 'Education'];

  const handleGenerate = async () => {
    if (!title.trim() || !niche.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API}/generate/ranking`, {
        video_title: title,
        niche
      }, {
        headers: getAuthHeader()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Video Ranking</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Video Ranking & SEO</h1>
          <p className="text-[#A1A1AA]">
            Optimize your content for YouTube SEO and discoverability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Video Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Video Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 10 AI Tools That Will Make You Rich in 2024"
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                  data-testid="ranking-title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Video Niche *
                </label>
                <Input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Technology, Finance, Gaming"
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] mb-3"
                  data-testid="ranking-niche"
                />
                <div className="flex flex-wrap gap-2">
                  {popularNiches.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiche(n)}
                      className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                        niche === n
                          ? 'bg-[#FF5F1F] text-black font-medium'
                          : 'bg-[#121212] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#121212] border border-[#27272A] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">Analysis includes:</h3>
                <ul className="text-[#A1A1AA] text-sm space-y-1">
                  <li>• SEO score estimate</li>
                  <li>• Title optimization</li>
                  <li>• Tag recommendations</li>
                  <li>• Description template</li>
                  <li>• Competitor insights</li>
                </ul>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !title.trim() || !niche.trim()}
                className="w-full bg-[#FF5F1F] text-black font-bold py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] disabled:opacity-50"
                data-testid="generate-ranking"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze & Optimize
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">SEO Analysis</h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#FF5F1F]/50 transition-all"
                  data-testid="copy-result"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-2 border-[#27272A] border-t-[#FF5F1F] rounded-full animate-spin mb-4" />
                <p className="text-[#A1A1AA]">Analyzing your video...</p>
              </div>
            ) : result ? (
              <div className="bg-[#050505] rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <pre className="text-[#EDEDED] text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {result.content}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <TrendingUp className="w-16 h-16 text-[#27272A] mb-4" />
                <p className="text-[#A1A1AA]">Your SEO analysis will appear here</p>
                <p className="text-[#52525B] text-sm mt-2">Enter your video details and click analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RankingPage;
