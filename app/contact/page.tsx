import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss research collaboration, consulting, or media inquiries about the AIM Framework.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Whether you're a researcher, practitioner, organization, or journalist—we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 mb-2">
                I'm interested in:
              </label>
              <select
                id="interest"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select an option</option>
                <option value="research">Research Collaboration</option>
                <option value="testing">Testing & Validation</option>
                <option value="consulting">Organizational Consulting</option>
                <option value="speaking">Speaking Engagement</option>
                <option value="media">Media Inquiry</option>
                <option value="general">General Question</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Send Message
            </button>
          </form>
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
          Email: contact@usebettermetrics.com
        </p>
        <p className="text-gray-600 mb-8">
          We aim to respond to all inquiries within 48 hours.
        </p>
      </section>
    </div>
  )
}
