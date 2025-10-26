import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Psychology',
  description: 'How the AIM Framework explains social anxiety, protects intrinsic motivation, and prevents mimetic pathology in psychological contexts.',
}

export default function PsychologyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Psychology & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Protecting intrinsic motivation, understanding social anxiety, and preventing mimetic pathology
          </p>
        </div>
      </section>

      {/* Hypothesis Status Banner */}
      <div className="bg-amber-50 border-t-4 border-amber-400 p-6">
        <div className="max-w-5xl mx-auto flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              These are testable predictions, not established findings.
            </h3>
            <p className="text-gray-700">
              We&apos;re seeking researchers to validate these hypotheses. 
              <Link href="/research-resources" className="text-primary-600 hover:underline ml-2">
                Access research materials →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-lg">
        
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How AIM Transforms Psychological Understanding</h2>
          
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 mb-8">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Psychology has long recognized that human behavior is multiply motivated, but existing frameworks struggle to cleanly separate motivational sources. 
              Self-Determination Theory distinguishes "intrinsic" from "extrinsic" motivation but lumps appetitive needs and mimetic desires together as "extrinsic." 
              Social psychology studies conformity and social influence but doesn't distinguish mimetic desire from other social processes.
            </p>
            <p className="text-gray-700">
              <strong>AIM's contribution:</strong> Three functionally distinct neural sources that generate testable predictions about when motivation shifts, what interventions work, and how psychological phenomena emerge.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Psychological Phenomena Explained</h3>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Social Anxiety as Mimetic Over-Attention</h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">Standard view</h5>
                    <p className="text-sm text-gray-700">Social anxiety stems from fear of negative evaluation</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">AIM view</h5>
                    <p className="text-sm text-gray-700">Social anxiety emerges when wₘ (mimetic weight) becomes dysregulated—excessive attention to others' perceived judgments inflates mimetic signals while drowning out I (intrinsic preferences) and A (genuine needs)</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Why this matters:</strong> Treatment should focus on re-weighting motivational sources, not just exposure therapy. 
                    <strong>Prediction:</strong> Interventions that strengthen wᵢ (intrinsic self-knowledge) will outperform pure exposure for social anxiety.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Flow States as Pure I-Activation</h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">Standard view</h5>
                    <p className="text-sm text-gray-700">Flow requires optimal challenge and clear goals</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">AIM view</h5>
                    <p className="text-sm text-gray-700">Flow occurs when wᵢ approaches 1.0 (near-complete intrinsic weight) with wₐ and wₘ minimized</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 mb-2">This explains why:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Flow breaks when external rewards introduced (wₘ increases)</li>
                    <li>• Flow requires A-sufficiency first (can't enter flow when hungry/exhausted)</li>
                    <li>• Flow is private (high observability increases wₘ, disrupting flow)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Why this matters:</strong> Can design flow-inducing environments by systematically reducing A-interference and M-observation while supporting I-activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">The I-to-M Drift Phenomenon</h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">Standard view</h5>
                    <p className="text-sm text-gray-700">Extrinsic rewards undermine intrinsic motivation (established)</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">AIM addition</h5>
                    <p className="text-sm text-gray-700">The mechanism is <strong>weight reallocation</strong>. When intrinsically motivated activities become publicly visible, wₘ inflates and wᵢ deflates</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 mb-2">This drift is:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• <strong>Not inevitable</strong> (autonomy-support blocks it)</li>
                    <li>• <strong>Reversible</strong> (removing M-visibility can restore I-weight)</li>
                    <li>• <strong>Context-dependent</strong> (sequence of feedback matters)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Why this matters:</strong> Explains why hobbies lose appeal when professionalized, why students lose curiosity under grades, why employees burn out under ranking systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Appetitive Dysregulation Cascades</h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">Standard view</h5>
                    <p className="text-sm text-gray-700">Sleep deprivation and hunger affect self-control</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-2">AIM view</h5>
                    <p className="text-sm text-gray-700">A-deficit doesn't just reduce self-control—it actively reallocates weights. When wₐ is elevated (unmet needs), wᵢ deflates (reduced autonomy capacity) and wₘ can inflate (increased social susceptibility)</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 mb-2">
                    <strong>Prediction:</strong> Sleep-deprived or hungry individuals should show:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Reduced intrinsic task persistence</li>
                    <li>• Increased conformity to social proof</li>
                    <li>• Impaired ability to resist mimetic desires</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Why this matters:</strong> Mental health interventions must address A-regulation first. Cannot expect I-based therapy (building autonomy, curiosity) to work when A is dysregulated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Psychological Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Detailed Psychological Mechanisms</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mimetic Pathology and Addiction</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Traditional addiction models</h4>
                    <p className="text-sm text-gray-700">Chemical dependence, habit formation, reward system hijacking</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">AIM addition</h4>
                    <p className="text-sm text-gray-700">Some addictions have strong mimetic components—the desire is sustained not by A-deficit or I-reward, but by wₘ (social observation, status signaling, group identity)</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 mb-2">
                    <strong>Observable difference:</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• <strong>A-driven addiction:</strong> Cyclical, state-dependent, satisfiable (physical withdrawal)</li>
                    <li>• <strong>I-driven compulsion:</strong> Persistent, process-focused, private (behavioral patterns)</li>
                    <li>• <strong>M-driven addiction:</strong> Visibility-sensitive, rivalry-prone, group-context dependent</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Clinical implication:</strong> Treatment must match mechanism. M-driven addictions respond to social environment modification (remove triggers, reduce observability), while I-driven compulsions need autonomy restoration.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Therapeutic Resistance and Motivation Mismatch</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 mb-2">Why therapy sometimes fails</h4>
                  <p className="text-gray-700">The intervention targets one motivational source (usually I—"find your authentic self") while the problem is located in another (A-dysregulation, M-anxiety).</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-1">Depression with A-deficit</h5>
                    <p className="text-sm text-gray-700">Therapy emphasizing meaning-finding (I) won't help if underlying problem is chronic sleep deprivation or nutritional deficit (A)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-1">Social anxiety as M-overweight</h5>
                    <p className="text-sm text-gray-700">Exposure therapy may fail if it doesn't address the weight reallocate (reducing wₘ, strengthening wᵢ)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-bold text-gray-900 mb-1">Burnout as I-to-M drift</h5>
                    <p className="text-sm text-gray-700">Coaching focused on "finding passion" misses that the work WAS intrinsically motivating before visibility/ranking inflated wₘ</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    <strong>Solution:</strong> Assess motivational source before selecting intervention.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Role of Autonomy in Mental Health</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700">
                    Self-Determination Theory established that autonomy supports well-being. <strong>AIM adds the mechanism:</strong> Autonomy = capacity for wᵢ to influence choice.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">When autonomy is impaired</h4>
                    <ol className="space-y-1 text-sm text-gray-700">
                      <li><strong>A-deficit:</strong> Unmet needs create urgency that overrides I-preferences (not truly autonomous)</li>
                      <li><strong>M-inflation:</strong> Excessive mimetic weight means choices track others' perceived opinions, not intrinsic values</li>
                    </ol>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">Recovery of autonomy requires</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Ensure A-sufficiency (basic needs met)</li>
                      <li>• Reduce M-observability (create private space)</li>
                      <li>• Strengthen I-signals (practice attending to intrinsic preferences)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700">
                    <strong>Prediction:</strong> Interventions that address all three will outperform interventions targeting only one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Novel Testable Predictions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 4: Autonomy-Supportive Feedback Blocks I-to-M Drift</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> When intrinsically motivated activities become PUBLIC (visible rankings, social comparison), motivation drifts from I to M <strong>UNLESS</strong> autonomy-supportive feedback is provided. The drift is not inevitable—it&apos;s contextual and reversible.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> SDT shows autonomy-support preserves intrinsic motivation. AIM predicts the MECHANISM: autonomy-support prevents wₘ from inflating. Can test whether <strong>private competence feedback</strong> preserves I even in competitive contexts.
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
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If Condition B performs like Condition A, autonomy-support doesn&apos;t block M
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 5: Mimetic Rivalry Produces Distinctive Escalation Pattern</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> In mimetic rivalry (two people wanting the same scarce object), desire INCREASES when the rival&apos;s interest is visible, even when the object&apos;s functional value is constant. This escalation is <strong>pre-conscious</strong> and produces distinctive bidding/pursuit patterns.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Game theory predicts competitive bidding but not ESCALATING desire. AIM predicts the desire itself intensifies through mirror-neuron observation. Can measure whether <strong>hiding rival bids</strong> reduces final prices.
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
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If blind vs visible makes no difference, mimetic amplification claim fails
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Questions for Psychological Science</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Therapeutic Outcomes by Motivation Source Matching</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Do therapeutic outcomes improve when intervention type matches diagnosed motivational source?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> A-deficit depression responds better to sleep/nutrition intervention than meaning-finding therapy; M-anxiety responds better to social environment modification than exposure alone
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Randomize depressed patients to A-focused vs I-focused vs M-focused interventions, measure recovery rates and relapse patterns
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Flow State Protection Mechanisms</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Can we design environments that protect flow states from I-to-M drift?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> Private workspaces with delayed feedback will maintain flow longer than public workspaces with immediate social comparison
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Compare flow state duration and quality across different observability conditions for intrinsically motivated tasks
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Anxiety as Weight Dysregulation</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Is social anxiety fundamentally a problem of excessive wₘ (mimetic weight) drowning out wᵢ (intrinsic self-knowledge)?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> Interventions that strengthen wᵢ (autonomy, self-knowledge) will outperform pure exposure therapy for social anxiety
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Compare social anxiety treatment outcomes between exposure therapy vs autonomy-supportive therapy vs combined approach
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Addiction Classification by Motivation Source</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Can we classify addictions by primary motivational source (A-driven, I-driven, M-driven) and predict treatment response?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> M-driven addictions (social media, status goods) will respond better to social environment modification than traditional addiction treatments
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Classify addiction cases by motivation source, randomize to matched vs mismatched treatment approaches, measure recovery rates
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resilience and Motivation Source Balance</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Do individuals with balanced A/I/M weights show greater psychological resilience than those with imbalanced weights?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> People with high wᵢ and moderate wₐ/wₘ will show better stress recovery and less vulnerability to social pressure
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Longitudinal study measuring motivation weights and resilience outcomes across stress events
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mimetic Rivalry and Mental Health</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Does exposure to mimetic rivalry (competing for same scarce resources) increase mental health problems?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> High-competition environments will increase anxiety, depression, and social comparison, while collaborative environments will improve well-being
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Compare mental health outcomes in competitive vs collaborative organizational cultures
              </p>
            </div>
          </div>
        </section>

        {/* Therapeutic Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Therapeutic Implications</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Motivation Source Assessment in Therapy</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">The AIM Diagnostic Framework</h4>
                  <p className="text-gray-700">Before selecting interventions, assess which motivational source is primarily driving the problem:</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-bold text-amber-800 mb-2">A-deficit problems</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Sleep deprivation</li>
                      <li>• Nutritional deficits</li>
                      <li>• Chronic stress</li>
                      <li>• Physical illness</li>
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-bold text-teal-800 mb-2">I-deficit problems</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Loss of autonomy</li>
                      <li>• Lack of meaning</li>
                      <li>• Burnout</li>
                      <li>• Depression</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-2">M-dysregulation problems</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Social anxiety</li>
                      <li>• Status competition</li>
                      <li>• Mimetic addiction</li>
                      <li>• Rivalry escalation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Targeted Intervention Strategies</h3>
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2">A-deficit Interventions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Sleep hygiene protocols:</strong> Address circadian rhythm disruption before cognitive therapy</li>
                    <li><strong>Nutritional assessment:</strong> Check for deficiencies that affect mood and cognition</li>
                    <li><strong>Stress reduction:</strong> Basic needs must be met before higher-order interventions</li>
                    <li><strong>Physical health:</strong> Medical evaluation for conditions affecting mental state</li>
                  </ul>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h4 className="font-bold text-teal-800 mb-2">I-deficit Interventions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Autonomy restoration:</strong> Increase choice and control in daily activities</li>
                    <li><strong>Meaning-making:</strong> Connect activities to personal values and goals</li>
                    <li><strong>Competence building:</strong> Develop skills that provide intrinsic satisfaction</li>
                    <li><strong>Flow state cultivation:</strong> Design environments that support deep engagement</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-2">M-dysregulation Interventions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Social environment modification:</strong> Reduce exposure to triggering social comparisons</li>
                    <li><strong>Observability reduction:</strong> Create private spaces for authentic self-expression</li>
                    <li><strong>Status diversification:</strong> Develop multiple sources of identity and recognition</li>
                    <li><strong>Rivalry de-escalation:</strong> Reframe competitive situations as collaborative opportunities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integrated Treatment Approaches</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">Sequential Treatment Model</h4>
                  <p className="text-gray-700 mb-2">Address motivational sources in order of priority:</p>
                  <ol className="space-y-1 text-sm text-gray-700">
                    <li><strong>First:</strong> Ensure A-sufficiency (basic needs met)</li>
                    <li><strong>Second:</strong> Reduce M-interference (create safe, private spaces)</li>
                    <li><strong>Third:</strong> Strengthen I-capacity (autonomy, meaning, flow)</li>
                  </ol>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">Prevention-Focused Therapy</h4>
                  <p className="text-gray-700 mb-2">Build protective factors against motivational dysregulation:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• <strong>A-resilience:</strong> Stress management, sleep hygiene, nutrition</li>
                    <li>• <strong>I-protection:</strong> Autonomy-supportive environments, meaning-making skills</li>
                    <li>• <strong>M-regulation:</strong> Social comparison awareness, status diversification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border-2 border-primary-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Therapeutic Environment Design</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">A-supportive environments</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Comfortable, safe physical spaces</li>
                      <li>• Access to basic needs (food, water, rest)</li>
                      <li>• Stress-reducing design elements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">I-supportive environments</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Private spaces for authentic expression</li>
                      <li>• Choice and autonomy in activities</li>
                      <li>• Meaningful, engaging tasks</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">M-regulation environments</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Reduced social comparison triggers</li>
                    <li>• Collaborative rather than competitive structures</li>
                    <li>• Multiple recognition systems (not just one status hierarchy)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Psychological Research?</h2>
          <p className="text-gray-700 mb-6">
            We&apos;re seeking psychologists to test AIM predictions and explore applications in your field.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contact Us to Collaborate
          </Link>
        </section>
      </article>
    </div>
  )
}
