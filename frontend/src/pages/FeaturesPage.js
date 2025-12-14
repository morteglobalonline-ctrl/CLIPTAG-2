import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { 
  Video, 
  Mic, 
  FileText, 
  TrendingUp, 
  LayoutGrid,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: Video,
      title: 'Generate Clips with AI',
      description: 'Create viral video clips optimized for social media engagement. Our AI analyzes trending content patterns to help you create hooks that capture attention in the first 3 seconds.',
      highlights: ['Viral hook generation', 'Platform-optimized scripts', 'Call-to-action suggestions']
    },
    {
      icon: BookOpen,
      title: 'Create Story Videos',
      description: 'Build compelling narrative videos perfect for faceless YouTube channels. Get complete scripts with scene descriptions, voiceover text, and visual suggestions.',
      highlights: ['Narrative arc structuring', 'Scene-by-scene breakdown', 'Emotional beat mapping']
    },
    {
      icon: LayoutGrid,
      title: 'Split Screen Content',
      description: 'Design engaging dual-view content that maximizes viewer retention. Perfect for reaction videos, comparisons, and side-by-side content.',
      highlights: ['Layout suggestions', 'Sync point planning', 'Audio strategy']
    },
    {
      icon: Mic,
      title: 'AI Voiceover Scripts',
      description: 'Transform your text into natural, professional voiceover scripts. Get pacing notes, emphasis markers, and tone guidance for every section.',
      highlights: ['Natural speech patterns', 'Pause markers', 'Emotion guidance']
    },
    {
      icon: FileText,
      title: 'Video Transcription',
      description: 'Generate accurate captions and subtitles instantly. Perfect formatting for YouTube subtitles and social media captions.',
      highlights: ['Timestamp formatting', 'Caption-ready segments', 'Multi-platform export']
    },
    {
      icon: TrendingUp,
      title: 'Video Ranking & SEO',
      description: 'Optimize your content for maximum discoverability. Get title suggestions, tag recommendations, and complete SEO strategies.',
      highlights: ['SEO score analysis', 'Tag recommendations', 'Competitor insights']
    }
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
              <span className="text-sm text-[#FF5F1F] font-medium">AI-Powered Features</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Everything You Need to Create{' '}
              <span className="text-[#FF5F1F]">Viral Content</span>
            </h1>
            <p className="text-lg text-[#A1A1AA] mb-10">
              Our suite of AI tools helps you create professional video content faster than ever before.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-[#FF5F1F]/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#FF5F1F]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-[#A1A1AA] mb-6 text-lg">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[#EDEDED]">
                          <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className="bg-[#050505] border border-[#27272A] rounded-xl p-8 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <Icon className="w-16 h-16 text-[#FF5F1F]/30 mx-auto mb-4" />
                        <p className="text-[#52525B] text-sm">Feature Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose ClipTag AI?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8 text-center">
              <div className="w-14 h-14 bg-[#FF5F1F]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7 text-[#FF5F1F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-[#A1A1AA]">
                Generate content in seconds, not hours. Our AI works at the speed of your creativity.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8 text-center">
              <div className="w-14 h-14 bg-[#FF5F1F]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7 text-[#FF5F1F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Save Time</h3>
              <p className="text-[#A1A1AA]">
                Focus on creating, not writing. Let AI handle the heavy lifting while you perfect your vision.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8 text-center">
              <div className="w-14 h-14 bg-[#FF5F1F]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-7 h-7 text-[#FF5F1F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Professional Quality</h3>
              <p className="text-[#A1A1AA]">
                Get results that rival expensive production houses, at a fraction of the cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-[#A1A1AA] mb-10">
            Start creating professional video content today.
          </p>
          <Link to="/register">
            <Button 
              size="lg"
              className="bg-[#FF5F1F] text-black font-bold text-lg px-10 py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.5)]"
              data-testid="features-cta"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FeaturesPage;
