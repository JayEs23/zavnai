"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Mail, Send, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual contact API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Basic sanitization - remove null bytes and limit length
    let sanitized = value.replace(/\x00/g, '');
    if (field === 'message' && sanitized.length > 2000) {
      sanitized = sanitized.substring(0, 2000);
    } else if (field === 'name' && sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    } else if (field === 'subject' && sanitized.length > 200) {
      sanitized = sanitized.substring(0, 200);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
  };

  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                Get in Touch
              </p>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about ZAVN? Want to partner with us? Or just want to say hello? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Ways to Reach Us</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-teal-600">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a href="mailto:hello@zavn.ai" className="text-primary hover:underline">
                          hello@zavn.ai
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-emerald-600">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Support</h3>
                        <p className="text-muted-foreground text-sm">
                          For technical support or account questions, email us at{" "}
                          <a href="mailto:support@zavn.ai" className="text-primary hover:underline">
                            support@zavn.ai
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-muted/50 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours. For urgent matters, please mention &quot;URGENT&quot; in your subject line.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
