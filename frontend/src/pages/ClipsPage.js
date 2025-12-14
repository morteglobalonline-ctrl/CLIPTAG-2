import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Video, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ClipsPage = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('engaging');
  const [duration, setDuration] = useState('60s');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const { getAuthHeader } = useAuth();

  const styles = ['engaging', 'educational', 'entertaining', 'inspirational', 'controversial'];
  const durations = ['30s', '60s', '90s', '2min', '3min'];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API}/generate/clips`, {
        video_topic: topic,
        style,
        duration
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
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Generate Clips</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Viral Video Clips</h1>
          <p className="text-[#A1A1AA]">
            Generate engaging video clip scripts optimized for social media.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Clip Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Video Topic *
                </label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 5 productivity hacks for remote workers"
                  rows={3}
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] resize-none"
                  data-testid="clips-topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Content Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {styles.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                        style === s
                          ? 'bg-[#FF5F1F] text-black font-medium'
                          : 'bg-[#121212] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
                      }`}
                      data-testid={`style-${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Video Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        duration === d
                          ? 'bg-[#FF5F1F] text-black font-medium'
                          : 'bg-[#121212] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
                      }`}
                      data-testid={`duration-${d}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-[#FF5F1F] text-black font-bold py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] disabled:opacity-50"
                data-testid="generate-clips"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Clip Script
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Generated Script</h2>
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
                <p className="text-[#A1A1AA]">Generating your clip script...</p>
              </div>
            ) : result ? (
              <div className="bg-[#050505] rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <pre className="text-[#EDEDED] text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {result.content}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Video className="w-16 h-16 text-[#27272A] mb-4" />
                <p className="text-[#A1A1AA]">Your generated script will appear here</p>
                <p className="text-[#52525B] text-sm mt-2">Fill in the details and click generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClipsPage;
