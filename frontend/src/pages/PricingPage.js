import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Standard',
      monthlyPrice: 7.99,
      yearlyPrice: 7.99 * 12 * 0.75, // 25% discount
      description: 'Perfect for individual creators getting started.',
      features: [
        'All AI tools included',
        'Unlimited generations',
        'Content library storage',
        'Standard processing speed',
        'Email support',
        'Export to all formats'
      ],
      featured: false
    },
    {
      name: 'Pro',
      monthlyPrice: 24.99,
      yearlyPrice: 24.99 * 12 * 0.75, // 25% discount
      description: 'For serious creators who need more power.',
      features: [
        'Everything in Standard',
        'Priority processing',
        'Advanced AI features',
        'Bulk generation',
        'API access',
        'Premium support',
        'Custom templates',
        'Analytics dashboard'
      ],
      featured: true
    }
  ];

  const getPrice = (plan) => {
    if (billingPeriod === 'monthly') {
      return plan.monthlyPrice;
    }
    return (plan.yearlyPrice / 12).toFixed(2);
  };

  const getTotalYearly = (plan) => {
    return plan.yearlyPrice.toFixed(2);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Simple, <span className="text-[#FF5F1F]">Affordable</span> Pricing
            </h1>
            <p className="text-lg text-[#A1A1AA] mb-10">
              Cheaper than competitors. No hidden limits. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-[#0A0A0A] border border-[#27272A] rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#FF5F1F] text-black'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
                data-testid="billing-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-[#FF5F1F] text-black'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
                data-testid="billing-yearly"
              >
                Yearly
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  billingPeriod === 'yearly'
                    ? 'bg-black/20 text-black'
                    : 'bg-[#FF5F1F]/20 text-[#FF5F1F]'
                }`}>
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-8 ${
                  plan.featured
                    ? 'bg-[#0A0A0A] border-2 border-[#FF5F1F] shadow-[0_0_40px_rgba(255,95,31,0.2)] relative'
                    : 'bg-[#0A0A0A] border border-[#27272A]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5F1F] text-black text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-[#A1A1AA] mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white font-mono">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-[#A1A1AA]">/month</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-[#52525B] mt-2">
                      ${getTotalYearly(plan)} billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="text-[#EDEDED]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button
                    className={`w-full py-6 font-bold ${
                      plan.featured
                        ? 'bg-[#FF5F1F] text-black hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.5)]'
                        : 'bg-white/5 text-white border border-[#27272A] hover:bg-white/10'
                    }`}
                    data-testid={`pricing-select-${plan.name.toLowerCase()}`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-[#050505] border border-[#27272A] rounded-lg px-6 py-4">
              <div className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">No commitment required</p>
                <p className="text-[#A1A1AA] text-sm">Cancel anytime with no questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why We're More Affordable
            </h2>
            <p className="text-[#A1A1AA]">
              Get premium features without the premium price tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">No Feature Gating</h3>
              <p className="text-[#A1A1AA] text-sm">
                All our AI tools are included in every plan. We don't lock essential features behind higher tiers.
              </p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Unlimited Generations</h3>
              <p className="text-[#A1A1AA] text-sm">
                No credit systems or usage caps. Generate as much content as you need without watching a meter.
              </p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Optimized Infrastructure</h3>
              <p className="text-[#A1A1AA] text-sm">
                We've built our AI pipeline from the ground up, passing the savings directly to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Pricing Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-[#27272A] pb-6">
              <h3 className="text-white font-medium mb-2">Can I switch plans later?</h3>
              <p className="text-[#A1A1AA] text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="border-b border-[#27272A] pb-6">
              <h3 className="text-white font-medium mb-2">Is there a free trial?</h3>
              <p className="text-[#A1A1AA] text-sm">
                We don't offer a free tier, but you can cancel within the first 7 days for a full refund if you're not satisfied.
              </p>
            </div>
            <div className="border-b border-[#27272A] pb-6">
              <h3 className="text-white font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-[#A1A1AA] text-sm">
                We accept all major credit cards, debit cards, and PayPal. All payments are securely processed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PricingPage;
