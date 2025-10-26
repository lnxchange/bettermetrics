import Link from 'next/link'
import { HiArrowRight, HiDownload, HiDocumentText } from 'react-icons/hi'
import { StatusBadge } from '@/components/ui/status-badge'

export default function ResearchResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <StatusBadge variant="seeking-validation" className="mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Resources</h1>
          <p className="text-xl text-gray-600">
            Access complete framework documents, testable predictions, and collaboration opportunities.
          </p>
        </div>
      </section>

      {/* Core Framework Documents */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Framework Documents</h2>
        
        <div className="space-y-6">
          {/* Document Card Template */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 transition">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Motivation Framework - Comprehensive Foundation
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete theoretical foundation, neuroscience grounding, and cross-domain applications. 
                  (47,366 characters)
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/api/documents/download/aim-framework-comprehensive" 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    <HiDownload className="mr-2" /> Download PDF
                  </Link>
                  <span className="text-sm text-gray-500">Published: October 20, 2025</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second Document */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 transition">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Neuroscience Grounding
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed neuroscience literature review supporting the three-source model. 
                  (23,891 characters)
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/api/documents/download/aim-neuroscience-grounding" 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    <HiDownload className="mr-2" /> Download PDF
                  </Link>
                  <span className="text-sm text-gray-500">Published: October 20, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Document */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 transition">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Cross-Domain Applications
                </h3>
                <p className="text-gray-600 mb-4">
                  Applications across economics, psychology, health, law, education, organizations, and marketing. 
                  (31,247 characters)
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/api/documents/download/aim-cross-domain-applications" 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    <HiDownload className="mr-2" /> Download PDF
                  </Link>
                  <span className="text-sm text-gray-500">Published: October 20, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Document */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 transition">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Testable Predictions
                </h3>
                <p className="text-gray-600 mb-4">
                  Specific, falsifiable hypotheses ready for empirical testing across all domains. 
                  (18,934 characters)
                </p>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/api/documents/download/aim-testable-predictions" 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    <HiDownload className="mr-2" /> Download PDF
                  </Link>
                  <span className="text-sm text-gray-500">Published: October 20, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Novel Testable Predictions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Novel Testable Predictions</h2>
          
          <div className="mb-8 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Makes AIM Predictions Unique?</h3>
            <p className="text-gray-700 mb-4">
              AIM&apos;s <strong>unique contribution</strong> is the <strong>tri-source classification</strong> - existing theories conflate:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• <strong>Self-Determination Theory:</strong> Lumps A and M together as &quot;extrinsic&quot;</li>
              <li>• <strong>Girard&apos;s Mimetic Theory:</strong> Underspecifies I and A</li>
              <li>• <strong>Behavioral Economics:</strong> Treats all &quot;social influence&quot; as one mechanism</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>AIM's tri-source framework enables unique predictions</strong> because it:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• Distinguishes between appetitive needs (A), intrinsic motivation (I), and mimetic desire (M)</li>
              <li>• Predicts how these sources interact and compete in the brain's valuation system</li>
              <li>• Enables specific interventions targeting each source separately</li>
              <li>• Provides falsifiable criteria for when predictions fail</li>
            </ul>
            <p className="text-gray-700 font-semibold">
              <strong>Result:</strong> No existing theory can predict when markets will fail, when interventions will backfire, or when social dynamics will escalate. AIM's tri-source model enables these predictions.
            </p>
          </div>
          
          {/* Implementation Priority */}
          <div className="mb-8 bg-green-50 p-6 rounded-xl border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Priority</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-green-800 mb-2">Ready for immediate testing:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Mimetic Contagion (Prediction 2) - 6 weeks</li>
                  <li>• Appetite-Mimetic Interaction (Prediction 3) - Single session</li>
                  <li>• Mimetic Rivalry Escalation (Prediction 5) - Single session</li>
                  <li>• Private-Then-Public Feedback (Prediction 10) - 6 weeks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-800 mb-2">Seeking industry partnerships:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• I-to-M Drift in Products (Prediction 1) - Tech company</li>
                  <li>• Flow-Based Exercise (Prediction 7) - Fitness industry</li>
                  <li>• Audience Removal in Legal (Prediction 8) - Law firms/courts</li>
                  <li>• Diversified Recognition (Prediction 11) - HR analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-purple-800 mb-2">Longer-term studies:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Autonomy Blocks Drift (Prediction 4) - 6 months</li>
                  <li>• Social Dining Direction (Prediction 6) - 3 months</li>
                  <li>• Opt-Out Rights in Contracts (Prediction 9) - 12 months</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Domain sections */}
          <div className="space-y-8">
            {/* Economics Section */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Economics</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 1: I-to-M Drift in Product Categories Over Time</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> When a product category transitions from private use (high-I) to public visibility (high-M), demand patterns will shift from <strong>stable & persistent</strong> to <strong>volatile & trend-sensitive</strong>.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Track productivity software (Notion, Obsidian) as they gain social media presence
                      <br/><strong>Required:</strong> Product analytics data + social media monitoring
                    </div>
                    <div>
                      <strong>Timeline:</strong> 12-18 months tracking cohorts
                      <br/><strong>Status:</strong> Seeking tech company partnership
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 2: Mimetic Contagion Requires Observation of GOAL-DIRECTED Action</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> Mimetic transmission requires observing someone <strong>reaching for/pursuing</strong> an object, not just <strong>owning</strong> it. Static ownership displays will produce weaker mimetic effects than dynamic pursuit displays.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> A/B test social media content: Static images vs videos of pursuing/acquiring products
                      <br/><strong>Required:</strong> E-commerce platform or influencer partnership
                    </div>
                    <div>
                      <strong>Timeline:</strong> 4-6 weeks
                      <br/><strong>Status:</strong> Protocol ready for testing
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 3: Appetite Deficits Amplify Mimetic Susceptibility</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> When appetites are dysregulated (hunger, sleep deprivation, fatigue), mimetic desire&apos;s weight (wₘ) increases relative to intrinsic motivation (wᵢ), making people MORE susceptible to social influence.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Manipulate appetite state (fasted 14 hours vs well-fed), expose to social proof, measure conformity
                      <br/><strong>Required:</strong> Lab setting, 100+ participants
                    </div>
                    <div>
                      <strong>Timeline:</strong> Single session
                      <br/><strong>Status:</strong> Ready for lab implementation
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Psychology Section */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Psychology</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 4: Autonomy-Supportive Feedback Blocks I-to-M Drift</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> When intrinsically motivated activities become PUBLIC (visible rankings, social comparison), motivation drifts from I to M <strong>UNLESS</strong> autonomy-supportive feedback is provided. The drift is not inevitable—it&apos;s contextual and reversible.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Students engaged in intrinsically interesting task. Condition A: Public leaderboard + controlling language. Condition B: Public leaderboard + autonomy-supportive feedback. Condition C: Private feedback only (control).
                      <br/><strong>Required:</strong> Educational institution partnership, IRB approval, 100+ student participants
                    </div>
                    <div>
                      <strong>Timeline:</strong> 6-week study
                      <br/><strong>Status:</strong> Seeking education research partnership
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 5: Mimetic Rivalry Produces Distinctive Escalation Pattern</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> In mimetic rivalry (two people wanting the same scarce object), desire INCREASES when the rival&apos;s interest is visible, even when the object&apos;s functional value is constant. This escalation is <strong>pre-conscious</strong> and produces distinctive bidding/pursuit patterns.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Auction format for non-essential goods. Condition A: Visible rival bids (standard eBay-style). Condition B: Blind bidding (rivals&apos; bids hidden until end).
                      <br/><strong>Required:</strong> Behavioral lab, 200+ participants
                    </div>
                    <div>
                      <strong>Timeline:</strong> Single-session experiment
                      <br/><strong>Status:</strong> Ready for behavioral lab
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Policy Section */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Health & Policy</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 6: Social Dining Amplifies Intake ONLY When Models Are Eating More</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> Social dining increases food intake <strong>through mimetic mechanisms</strong>, meaning: eating amplifies when observing others eat MORE than baseline, effect disappears when dining companion eats LESS, effect is strongest when the model is high-status/attractive.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Participants eat lunch with confederate. Condition A: Confederate eats large portion. Condition B: Confederate eats small portion. Condition C: Eats alone (control).
                      <br/><strong>Required:</strong> Nutrition research partnership, 3-month field study
                    </div>
                    <div>
                      <strong>Timeline:</strong> 3-month field study
                      <br/><strong>Status:</strong> Seeking nutrition research partnership
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Prediction 7: Flow-Based Exercise Programs Outperform Appearance-Based Programs at 12+ Months</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>What AIM Uniquely Predicts:</strong> Exercise programs designed around <strong>intrinsic rewards</strong> (mastery, flow, competence) will show better long-term adherence than programs designed around <strong>mimetic rewards</strong> (body image, social comparison, appearance goals).
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Test Design:</strong> Two exercise programs: High-I (emphasis on skill progression, optimal challenge, private milestones) vs High-M (before/after photos, group leaderboards, appearance metrics).
                      <br/><strong>Required:</strong> Fitness industry partnership, 12-month longitudinal study
                    </div>
                    <div>
                      <strong>Timeline:</strong> 12-month longitudinal study
                      <br/><strong>Status:</strong> Seeking fitness industry partnership
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Process */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Collaborate</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Contact Us</h3>
            <p className="text-gray-600">
              Reach out through our contact form or email to discuss your research interests and how they align with AIM predictions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Design Study</h3>
            <p className="text-gray-600">
              Work together to design rigorous tests of specific AIM predictions using your domain expertise and available resources.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Publish Results</h3>
            <p className="text-gray-600">
              Co-author papers that test AIM predictions, regardless of whether they support or falsify the framework.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Collaborating <HiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  )
}
