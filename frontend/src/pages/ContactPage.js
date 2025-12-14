import { useState } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, MessageSquare, Clock, Check } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Contact & <span className="text-[#FF5F1F]">Support</span>
            </h1>
            <p className="text-lg text-[#A1A1AA]">
              Have a question or need help? We're here for you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#FF5F1F]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email Us</h3>
                    <p className="text-[#A1A1AA] text-sm mb-2">For general inquiries and support</p>
                    <a 
                      href="mailto:morteglobalonline@gmail.com" 
                      className="text-[#FF5F1F] hover:underline"
                      data-testid="contact-email"
                    >
                      morteglobalonline@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#FF5F1F]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Support</h3>
                    <p className="text-[#A1A1AA] text-sm">
                      Our team typically responds within 24 hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#FF5F1F]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Business Hours</h3>
                    <p className="text-[#A1A1AA] text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM (EST)<br />
                      Weekend support available for Pro users
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-[#050505] border border-[#27272A] rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Quick Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/faq" className="text-[#A1A1AA] hover:text-[#FF5F1F] transition-colors text-sm">
                      → Browse FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-[#A1A1AA] hover:text-[#FF5F1F] transition-colors text-sm">
                      → View Pricing Plans
                    </a>
                  </li>
                  <li>
                    <a href="/features" className="text-[#A1A1AA] hover:text-[#FF5F1F] transition-colors text-sm">
                      → Explore Features
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-[#050505] border border-[#27272A] rounded-xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-[#A1A1AA]">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                          Your Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                          placeholder="John Doe"
                          data-testid="contact-name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                          placeholder="john@example.com"
                          data-testid="contact-email-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                          Subject
                        </label>
                        <Input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                          placeholder="How can we help?"
                          data-testid="contact-subject"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                          Message
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] resize-none"
                          placeholder="Tell us more about your question or issue..."
                          data-testid="contact-message"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5F1F] text-black font-bold py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] disabled:opacity-50"
                        data-testid="contact-submit"
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;
