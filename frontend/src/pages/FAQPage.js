import { useState } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { ChevronDown } from 'lucide-react';

const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'Who is ClipTag AI designed for?',
          answer: 'ClipTag AI is built for content creators of all sizes — from solo YouTubers and TikTok creators to social media managers and marketing teams. Whether you\'re running a faceless channel, need help with video scripts, or want to optimize your content for better reach, our tools are designed with you in mind.'
        },
        {
          question: 'Do I need any video editing experience to use ClipTag AI?',
          answer: 'Not at all! ClipTag AI is designed to be beginner-friendly. Our AI handles the complex work of generating scripts, voiceover text, SEO suggestions, and more. You just need to provide your ideas and preferences, and our tools will create professional-quality content for you.'
        },
        {
          question: 'What types of content can I create with ClipTag AI?',
          answer: 'You can create video clip scripts, story video narratives, split-screen content plans, voiceover scripts, video transcriptions, and SEO optimization strategies. Our tools cover the full spectrum of video content creation needs.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          question: 'Can I cancel my subscription at any time?',
          answer: 'Absolutely. There are no long-term contracts or cancellation fees. You can cancel your subscription whenever you want directly from your account settings. You\'ll continue to have access to your plan until the end of your current billing period.'
        },
        {
          question: 'What happens to my content if I cancel?',
          answer: 'Your generated content remains in your library for 30 days after cancellation. We recommend downloading anything important before that period ends. If you resubscribe, your previous content will be restored.'
        },
        {
          question: 'Is there a refund policy?',
          answer: 'Yes. If you\'re not satisfied within the first 7 days of your subscription, contact us for a full refund. No questions asked. We want you to feel confident in your decision to use ClipTag AI.'
        },
        {
          question: 'Do you offer discounts for annual billing?',
          answer: 'Yes! You save 25% when you choose annual billing instead of monthly. It\'s our way of rewarding customers who commit to growing with us.'
        }
      ]
    },
    {
      category: 'Features & Capabilities',
      questions: [
        {
          question: 'What platforms does the generated content work with?',
          answer: 'Our content is optimized for all major platforms including YouTube, TikTok, Instagram Reels, Facebook, Twitter/X, LinkedIn, and more. The scripts and suggestions we generate follow best practices for each platform\'s algorithm and audience expectations.'
        },
        {
          question: 'Are there any limits on how much content I can generate?',
          answer: 'No artificial limits. Both Standard and Pro plans include unlimited generations. We don\'t believe in credit systems or usage caps that interrupt your creative flow.'
        },
        {
          question: 'How accurate is the Video Ranking / SEO feature?',
          answer: 'Our SEO suggestions are based on current best practices and algorithm patterns. While no tool can guarantee rankings (YouTube\'s algorithm is always evolving), our recommendations give you the best foundation for discoverability.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          question: 'Is my content stored securely?',
          answer: 'Yes. All your data is encrypted in transit and at rest. We use industry-standard security practices to protect your content and personal information.'
        },
        {
          question: 'Do you use my content to train your AI?',
          answer: 'No. Your content belongs to you. We never use customer-generated content to train or improve our AI models without explicit consent. Your creative work remains yours.'
        },
        {
          question: 'Can I export my content?',
          answer: 'Absolutely. You can download any content you generate in multiple formats. Your work is portable and not locked into our platform.'
        }
      ]
    },
    {
      category: 'Comparisons',
      questions: [
        {
          question: 'What makes ClipTag AI more affordable than competitors?',
          answer: 'We\'ve optimized our AI infrastructure specifically for video content creation, reducing overhead costs. We don\'t spend millions on flashy marketing campaigns or celebrity endorsements. Instead, we pass those savings directly to our customers. The result: premium features at prices that make sense.'
        },
        {
          question: 'How is ClipTag AI different from other AI writing tools?',
          answer: 'Unlike generic AI writers, ClipTag AI is purpose-built for video content. Every feature is designed with creators in mind — from viral hook generation to platform-specific SEO. We understand the unique needs of video creators because that\'s our sole focus.'
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
              Everything you need to know about ClipTag AI. Can't find what you're looking for? 
              <a href="/contact" className="text-[#FF5F1F] hover:underline ml-1">Contact us</a>.
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
