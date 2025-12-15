import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { 
  Zap, 
  Video, 
  Mic, 
  FileText, 
  TrendingUp, 
  LayoutGrid,
  BookOpen,
  ArrowRight,
  Check,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Video,
      title: 'Generate Clips with AI',
      description: 'Create viral video clips optimized for social media engagement.'
    },
    {
      icon: BookOpen,
      title: 'Create Story Videos',
      description: 'Build compelling narrative videos for faceless channels.'
    },
    {
      icon: LayoutGrid,
      title: 'Split Screen',
      description: 'Design engaging dual-view content for maximum retention.'
    },
    {
      icon: Mic,
      title: 'AI Voiceover',
      description: 'Transform text into natural, professional voiceover scripts.'
    },
    {
      icon: FileText,
      title: 'Video Transcription',
      description: 'Generate accurate captions and subtitles instantly.'
    },
    {
      icon: TrendingUp,
      title: 'Video Ranking',
      description: 'Optimize your content for YouTube SEO and discoverability.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Tool',
      description: 'Select from our suite of AI-powered video creation tools.'
    },
    {
      number: '02',
      title: 'Input Your Content',
      description: 'Provide your topic, script, or video details.'
    },
    {
      number: '03',
      title: 'Generate & Download',
      description: 'Get AI-generated content ready for your videos.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need video editing experience?',
      answer: 'Not at all! ClipTag AI handles all the complex editing for you. Simply upload your video, choose your preferences, and let our AI create viral-ready clips. No technical skills required — if you can click a button, you can create amazing content.'
    },
    {
      question: 'Can I upload my own videos?',
      answer: 'Yes! Upload any video up to 3 minutes long in MP4, MOV, AVI, or WebM format. Our AI will analyze your footage and automatically extract the most engaging moments to create viral clips.'
    },
    {
      question: 'How long does it take to generate a clip?',
      answer: 'Most clips are generated in under 60 seconds. The AI quickly identifies the best moments, applies smart cuts, adds captions, and optimizes pacing — all automatically.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. No contracts, no hidden fees, no questions asked. Cancel whenever you want and keep access until the end of your billing period. We believe in earning your business, not locking you in.'
    },
    {
      question: 'Which platforms is this for?',
      answer: 'Everything! TikTok, YouTube Shorts, Instagram Reels, Facebook, Twitter/X — our AI optimizes content for any platform. Choose portrait (9:16) for vertical feeds or landscape (16:9) for YouTube.'
    },
    {
      question: 'What makes ClipTag AI more affordable?',
      answer: 'We\'ve built our infrastructure from the ground up for efficiency. No bloated features, no celebrity marketing budgets — just powerful AI tools at prices that actually make sense for creators.'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-[#FF5F1F]" />
              <span className="text-sm text-[#FF5F1F] font-medium">Affordable AI Video Tools</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Most Affordable AI Video Tool{' '}
              <span className="text-[#FF5F1F]">for Creators</span>
            </h1>
            
            <p className="text-lg text-[#A1A1AA] mb-10 max-w-2xl mx-auto">
              Create viral, faceless videos, clips, voiceovers, and short-form content — 
              without paying insane prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg"
                  className="bg-[#FF5F1F] text-black font-bold text-lg px-8 py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.5)] transition-all duration-300"
                  data-testid="hero-get-started"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#27272A] text-white text-lg px-8 py-6 hover:bg-white/5 hover:border-white/20"
                  data-testid="hero-view-pricing"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8 hover:border-[#FF5F1F]/50 transition-all duration-300"
              >
                <span className="text-5xl font-bold text-[#FF5F1F]/20 absolute top-4 right-4">
                  {step.number}
                </span>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-[#A1A1AA]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful AI Tools
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Everything you need to create professional video content, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#050505] border border-[#27272A] rounded-xl p-6 hover:border-[#FF5F1F]/50 hover:shadow-[0_0_30px_rgba(255,95,31,0.1)] transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#FF5F1F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#A1A1AA] text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Cheaper than competitors. No hidden limits. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Standard</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white font-mono">$7.99</span>
                <span className="text-[#A1A1AA]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  All AI tools included
                </li>
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Unlimited generations
                </li>
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Content library
                </li>
              </ul>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  className="w-full border-[#27272A] text-white hover:bg-white/5"
                  data-testid="pricing-standard"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#0A0A0A] border-2 border-[#FF5F1F] rounded-xl p-8 relative shadow-[0_0_30px_rgba(255,95,31,0.2)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5F1F] text-black text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white font-mono">$24.99</span>
                <span className="text-[#A1A1AA]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Everything in Standard
                </li>
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Priority processing
                </li>
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Advanced features
                </li>
                <li className="flex items-center gap-3 text-[#A1A1AA]">
                  <Check className="w-5 h-5 text-[#10B981]" />
                  Premium support
                </li>
              </ul>
              <Link to="/pricing">
                <Button 
                  className="w-full bg-[#FF5F1F] text-black font-bold hover:bg-[#FF7A45]"
                  data-testid="pricing-pro"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-[#52525B] mt-8 text-sm">
            Save 25% with annual billing
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#A1A1AA]">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-[#27272A] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                  data-testid={`faq-${index}`}
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#A1A1AA] transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-[#A1A1AA]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-[#A1A1AA] mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are saving time and money with ClipTag AI.
          </p>
          <Link to="/register">
            <Button 
              size="lg"
              className="bg-[#FF5F1F] text-black font-bold text-lg px-10 py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.5)]"
              data-testid="cta-get-started"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
