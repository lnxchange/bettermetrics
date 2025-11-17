'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affiliation: '',
    interest: '',
    message: '',
    paperScope: '',
    paperQuestions: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you within 48 hours.')
        setFormData({
          name: '',
          email: '',
          affiliation: '',
          interest: '',
          message: '',
          paperScope: '',
          paperQuestions: ''
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 mb-8">
            Whether you&apos;re a researcher, practitioner, organization, or journalist—we&apos;d love to hear from you.
          </p>
          
          {/* AIM Chat Recommendation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Have Questions About AIM?</h2>
            <p className="text-blue-800 mb-4">
              For questions about the AIM Framework, testable predictions, or research applications, 
              we encourage you to try our <strong>AIM Chat</strong> AI assistant first. It has access 
              to the latest versions of our research documentation and can provide detailed answers 
              about the framework&apos;s theoretical foundations and practical applications.
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try AIM Chat →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="affiliation" className="block text-sm font-semibold text-gray-700 mb-2">
                Affiliation/Organization
              </label>
              <input
                type="text"
                id="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 mb-2">
                I&apos;m interested in: *
              </label>
              <select
                id="interest"
                required
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select an option</option>
                <option value="research-paper">Request Research Paper</option>
                <option value="research">Research Collaboration</option>
                <option value="testing">Testing & Validation</option>
                <option value="consulting">Organizational Consulting</option>
                <option value="speaking">Speaking Engagement</option>
                <option value="media">Media Inquiry</option>
                <option value="general">General Question</option>
              </select>
            </div>

            {/* Conditional Research Paper Fields */}
            {formData.interest === 'research-paper' && (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> As Yule is a working lawyer, papers will generally include limited references 
                    but will provide sufficient information for you to further investigate and critique the framework&apos;s 
                    application to your specific domain.
                  </p>
                </div>

                <div>
                  <label htmlFor="paperScope" className="block text-sm font-semibold text-gray-700 mb-2">
                    Research Paper Scope * <span className="text-gray-500 font-normal">(Your field, topic, or domain of interest)</span>
                  </label>
                  <textarea
                    id="paperScope"
                    required={formData.interest === 'research-paper'}
                    rows={4}
                    value={formData.paperScope}
                    onChange={handleChange}
                    placeholder="e.g., Application of AIM Framework to consumer behavior in sustainable fashion markets, or neuroscience grounding for mimetic desire in adolescents..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="paperQuestions" className="block text-sm font-semibold text-gray-700 mb-2">
                    Specific Questions * <span className="text-gray-500 font-normal">(What you want the paper to address)</span>
                  </label>
                  <textarea
                    id="paperQuestions"
                    required={formData.interest === 'research-paper'}
                    rows={6}
                    value={formData.paperQuestions}
                    onChange={handleChange}
                    placeholder="e.g., How does the AIM Framework explain the rise of sustainable fashion preferences? What testable predictions can it make about consumer behavior changes? How would you measure intrinsic vs. mimetic motivations in this context?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </>
            )}

            {/* Regular message field for non-research-paper requests */}
            {formData.interest !== 'research-paper' && (
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required={formData.interest !== 'research-paper'}
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Why Collaborate on AIM */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Why Collaborate on AIM?</h2>
            <p className="text-xl max-w-4xl mx-auto">
              This isn&apos;t an incremental improvement—it&apos;s a fundamental reorganization of how we understand human motivation, 
              with implications for every field of human behavior.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Not Incremental—Revolutionary</h3>
              <p className="text-gray-100">
                Most theories propose new mechanisms. AIM proposes new <strong>categories</strong>. 
                If validated, it would provide the first neuroscientific basis for cross-disciplinary 
                definitions of fundamental human concepts.
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Unique Cross-Disciplinary Applications</h3>
              <p className="text-gray-100">
                AIM enables scientific definitions of freedom, respect, fairness, and privacy that 
                apply uniformly across economics, law, psychology, and policy—resolving conflicts 
                between different fields&apos; approaches to human behavior.
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Testable Predictions Existing Frameworks Cannot Make</h3>
              <p className="text-gray-100">
                AIM&apos;s tri-source model enables predictions about market failures, intervention backfires, 
                and social dynamics escalation that no existing theory can make—providing a competitive 
                advantage in research and practice.
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm text-center">
            <h3 className="text-2xl font-bold mb-4">The Opportunity</h3>
            <p className="text-lg text-gray-100 max-w-3xl mx-auto">
              If validated, AIM would represent the first time in history that concepts like &quot;freedom,&quot; 
              &quot;respect,&quot; &quot;fairness,&quot; and &quot;privacy&quot; could be defined scientifically rather than philosophically, 
              with testable predictions about when they are violated and how to restore them.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Collaboration Opportunities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Researchers */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Researchers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Test AIM predictions across disciplines</li>
                <li>• Co-author publications</li>
                <li>• Access framework materials and datasets</li>
              </ul>
            </div>

            {/* For Practitioners */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Practitioners</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Organizational design consulting</li>
                <li>• Contract & policy design support</li>
                <li>• Training & workshops</li>
              </ul>
            </div>

            {/* For Organizations */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Organizations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pilot AIM-based interventions</li>
                <li>• System redesign projects</li>
                <li>• Research partnerships</li>
              </ul>
            </div>

            {/* For Media */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Media</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Expert commentary on motivation science</li>
                <li>• Speaking engagements</li>
                <li>• Access to research papers and findings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Connect</h2>
        <p className="text-gray-600 mb-6">
          Email: yule@attune.legal
        </p>
        <p className="text-gray-600 mb-8">
          We aim to respond to all inquiries within 48 hours.
        </p>
      </section>
    </div>
  )
}
