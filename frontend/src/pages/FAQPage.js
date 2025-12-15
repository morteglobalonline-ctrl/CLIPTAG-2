import { useState } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { ChevronDown } from 'lucide-react';

const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'Do I need video editing experience to use ClipTag AI?',
          answer: 'Not at all! ClipTag AI is designed for everyone, from complete beginners to experienced creators. Our AI handles all the complex editing — detecting viral moments, applying smart cuts, adding captions, and optimizing pacing. If you can upload a file and click a button, you can create professional-quality content.'
        },
        {
          question: 'Can I upload my own videos?',
          answer: 'Absolutely! That\'s what ClipTag AI is built for. Upload any video up to 3 minutes long in MP4, MOV, AVI, or WebM format. Our AI will analyze your footage and automatically extract and optimize the most engaging moments.'
        },
        {
          question: 'How long does it take to generate a clip?',
          answer: 'Most clips are generated in under 60 seconds. The exact time depends on your video length and the complexity of processing, but our AI is optimized for speed. You\'ll have your viral-ready clip before you can finish your coffee.'
        },
        {
          question: 'What video formats are supported?',
          answer: 'We support all major video formats including MP4, MOV (QuickTime), AVI, and WebM. The maximum video length is 3 minutes, and you can output in either portrait (9:16) for TikTok/Reels or landscape (16:9) for YouTube.'
        }
      ]
    },
    {
      category: 'Features & Capabilities',
      questions: [
        {
          question: 'What does the AI actually do to my video?',
          answer: 'Our AI applies several optimizations automatically: (1) Detects the most engaging/viral moments, (2) Creates hook-first structure to capture attention in the first 3 seconds, (3) Applies smart jump cuts to maintain pacing, (4) Adds clean transitions, (5) Generates optimized captions and hashtags. You don\'t need to configure any of this — the AI knows best.'
        },
        {
          question: 'Which platforms can I use the clips for?',
          answer: 'Everything! TikTok, YouTube Shorts, Instagram Reels, Facebook, Twitter/X, LinkedIn — our clips work everywhere. Choose portrait (9:16) for vertical-first platforms like TikTok and Reels, or landscape (16:9) for traditional YouTube videos.'
        },
        {
          question: 'Can I customize the output style?',
          answer: 'Yes! While our AI applies smart defaults, you can add "AI Notes" to guide the style — like "make it emotional", "fast TikTok pace", or "cut the boring parts". You also choose the format (portrait/landscape) and final duration (15s to 180s).'
        },
        {
          question: 'What other tools are included?',
          answer: 'Beyond the main Generate Clips feature, ClipTag AI includes: Story Videos (narrative scripts), Split Screen concepts, AI Voiceover scripts, Video Transcription, and Video Ranking/SEO optimization. All tools are included in every plan.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, absolutely. No contracts, no cancellation fees, no questions asked. Cancel whenever you want directly from your account, and you\'ll keep access until the end of your current billing period. We believe in earning your business every month.'
        },
        {
          question: 'What\'s the difference between Standard and Pro?',
          answer: 'Standard ($7.99/mo) includes all AI tools and unlimited generations — perfect for individual creators. Pro ($24.99/mo) adds priority processing, advanced features, API access, and premium support — ideal for serious creators and teams.'
        },
        {
          question: 'Is there a free trial?',
          answer: 'We don\'t offer a free tier, but we do offer a 7-day money-back guarantee. Try ClipTag AI risk-free — if you\'re not completely satisfied within the first week, we\'ll refund you in full.'
        },
        {
          question: 'Do you offer annual billing?',
          answer: 'Yes! Save 25% when you choose annual billing. Standard becomes $5.99/mo and Pro becomes $18.74/mo when paid annually.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          question: 'What happens to my uploaded videos?',
          answer: 'Your videos are processed securely and stored temporarily for clip generation. We never use your content to train AI models, share it with third parties, or access it beyond what\'s needed to provide the service. You can delete your content anytime.'
        },
        {
          question: 'Who owns the content I create?',
          answer: 'You do. 100%. All clips, captions, and content generated using ClipTag AI are yours to use commercially, post anywhere, and monetize however you want. We claim no rights to your creations.'
        }
      ]
    },
    {
      category: 'Pricing & Value',
      questions: [
        {
          question: 'What makes ClipTag AI more affordable than competitors?',
          answer: 'We\'ve built our AI infrastructure from the ground up for efficiency. No bloated enterprise features you\'ll never use, no celebrity marketing budgets to fund, no VC pressure to overcharge. Just powerful tools at honest prices. We pass the savings directly to creators.'
        },
        {
          question: 'Are there any hidden limits or usage caps?',
          answer: 'No hidden limits. Both Standard and Pro plans include unlimited generations. We don\'t throttle your usage, charge per clip, or surprise you with overage fees. The price you see is the price you pay.'
        }
      ]
    }
  ];

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Frequently Asked <span className="text-[#FF5F1F]">Questions</span>
            </h1>
            <p className="text-lg text-[#A1A1AA]">
              Everything you need to know about ClipTag AI. Can't find your answer?{' '}
              <a href="/contact" className="text-[#FF5F1F] hover:underline">Contact us</a>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-[#27272A]">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openFaq === `${categoryIndex}-${questionIndex}`;
                  return (
                    <div 
                      key={questionIndex}
                      className="border border-[#27272A] rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                        data-testid={`faq-${categoryIndex}-${questionIndex}`}
                      >
                        <span className="font-medium text-white pr-4">{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-[#A1A1AA] shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-[#A1A1AA] leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-[#A1A1AA] mb-8">
            Our support team is here to help you get started.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#FF5F1F] text-black font-bold px-8 py-4 rounded-md hover:bg-[#FF7A45] transition-all"
            data-testid="faq-contact"
          >
            Contact Support
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FAQPage;
