import Link from 'next/link'
import { HiArrowRight, HiDownload, HiDocumentText } from 'react-icons/hi'
import { StatusBadge } from '@/components/ui/status-badge'

export default function ResearchResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <StatusBadge variant="pre-empirical" className="mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Resources</h1>
          <p className="text-xl text-gray-600">
            Access complete framework documents, testable predictions, and collaboration opportunities.
          </p>
        </div>
      </section>

      {/* Core Framework Documents */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Framework Documents</h2>
        
        {/* Custom Paper Request Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Request Custom Research Papers</h3>
              <p className="text-sm text-blue-700 mb-3">
                Research papers are prepared in direct response to your specific field or topic of interest. 
                This ensures targeted engagement and better knowledge transfer within your framework context.
              </p>
              <p className="text-sm text-blue-700 mb-4">
                <strong>Note:</strong> As Yule is a working lawyer, papers will generally include limited references 
                but will provide sufficient information for you to further investigate and critique the framework&apos;s application 
                to your specific domain.
              </p>
              <Link 
                href="/contact?interest=research-paper"
                className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Request a Research Paper <HiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Document Card - Framework Overview */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Motivation Framework - Comprehensive Foundation
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete theoretical foundation, neuroscience grounding, and cross-domain applications. 
                  Covers the three-source motivational model (Appetites, Intrinsic Motivation, Mimetic Desire) 
                  and its implications across multiple disciplines.
                </p>
                <p className="text-sm text-gray-500">
                  Available by request • Customized to your research field or topic
                </p>
              </div>
            </div>
          </div>
          
          {/* Document Card - Neuroscience */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Neuroscience Grounding
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed neuroscience literature review supporting the three-source model. 
                  Explores the neural substrates underlying Appetites, Intrinsic Motivation, and Mimetic Desire.
                </p>
                <p className="text-sm text-gray-500">
                  Available by request • Customized to your research field or topic
                </p>
              </div>
            </div>
          </div>

          {/* Document Card - Applications */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Cross-Domain Applications
                </h3>
                <p className="text-gray-600 mb-4">
                  Applications across economics, psychology, health, law, education, organizations, and marketing. 
                  Shows how the AIM Framework provides novel insights and predictions in each field.
                </p>
                <p className="text-sm text-gray-500">
                  Available by request • Customized to your research field or topic
                </p>
              </div>
            </div>
          </div>

          {/* Document Card - Predictions */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <HiDocumentText className="text-4xl text-primary-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AIM Framework - Testable Predictions
                </h3>
                <p className="text-gray-600 mb-4">
                  Specific, falsifiable hypotheses ready for empirical testing across all domains. 
                  Includes experimental designs and expected outcomes based on the tri-source motivational model.
                </p>
                <p className="text-sm text-gray-500">
                  Available by request • Customized to your research field or topic
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <Link 
            href="/contact?interest=research-paper"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition text-lg"
          >
            Request a Custom Research Paper <HiArrowRight className="ml-2" />
          </Link>
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
              <strong>AIM&apos;s tri-source framework enables unique predictions</strong> because it:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• Distinguishes between appetitive needs (A), intrinsic motivation (I), and mimetic desire (M)</li>
              <li>• Predicts how these sources interact and compete in the brain&apos;s valuation system</li>
              <li>• Enables specific interventions targeting each source separately</li>
              <li>• Provides falsifiable criteria for when predictions fail</li>
            </ul>
            <p className="text-gray-700 font-semibold">
              <strong>Result:</strong> No existing theory can predict when markets will fail, when interventions will backfire, or when social dynamics will escalate. AIM&apos;s tri-source model enables these predictions.
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
