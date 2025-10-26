import { Metadata } from 'next'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'

export const metadata: Metadata = {
  title: 'About the AIM Framework',
  description: 'Learn about the AIM Motivation Framework, its origins, theoretical foundations, and how it transforms understanding of human choice.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The AIM Motivation Framework
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive foundation for understanding how people choose what to pursue
          </p>
        </div>
      </section>

      {/* Hypothesis Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 p-8 rounded-xl border-2 border-amber-200">
          <div className="flex justify-center mb-4">
            <StatusBadge variant="pre-empirical" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            The AIM Hypothesis: A Novel Theoretical Framework
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              The AIM Motivation Framework is a <strong>proposed theoretical synthesis</strong> that 
              distinguishes three neural sources of human motivation. It has <strong>not yet been empirically 
              validated</strong> through peer-reviewed research, though it synthesizes established findings 
              from neuroscience, behavioral economics, and psychology.
            </p>
            <div className="grid md:grid-cols-2 gap-4 my-6 text-sm">
              <div>
                <strong>Status:</strong> Pre-empirical validation (October 2025)<br/>
                <strong>Grounding:</strong> Theoretical synthesis of existing neuroscience literature
              </div>
              <div>
                <strong>Seeking:</strong> Research collaborators for empirical testing<br/>
                <strong>Falsifiability:</strong> See testable predictions below
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AIM Represents a Paradigm Shift */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why AIM Represents a Paradigm Shift</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Not Just New Mechanisms—New Categories for Understanding Human Motivation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Current Theories */}
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Theoretical Limitations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Self-Determination Theory</h4>
                  <p className="text-gray-700 text-sm">
                    Lumps appetitive needs and mimetic desires together as &quot;extrinsic motivation,&quot; 
                    missing the crucial distinction between biological necessity and social signaling.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Behavioral Economics</h4>
                  <p className="text-gray-700 text-sm">
                    Treats all social influence as one mechanism, unable to distinguish between 
                    helpful social learning and harmful status competition.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Mimetic Theory</h4>
                  <p className="text-gray-700 text-sm">
                    Underspecifies biological needs and intrinsic motivation, focusing primarily 
                    on social dynamics without grounding in neuroscience.
                  </p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="font-semibold text-red-800 text-sm">
                    Result: Theories conflict, predictions fail, policy backfires
                  </p>
                </div>
              </div>
            </div>

            {/* AIM's Solution */}
            <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AIM&apos;s Revolutionary Approach</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Three Functionally Distinct Sources</h4>
                  <p className="text-gray-700 text-sm">
                    Each with different neural circuits, behavioral signatures, and policy levers— 
                    enabling precise interventions rather than one-size-fits-all approaches.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Neuroscientifically Grounded</h4>
                  <p className="text-gray-700 text-sm">
                    Based on established neuroscience rather than philosophical speculation, 
                    enabling testable predictions and falsifiable hypotheses.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Cross-Disciplinary Integration</h4>
                  <p className="text-gray-700 text-sm">
                    Provides uniform framework for economics, law, psychology, and policy— 
                    resolving conflicts between different fields&apos; approaches to human behavior.
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 text-sm">
                    Enables: Scientific definitions, market failure prediction, institutional design
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-xl border-2 border-primary-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              The Core Innovation: Tri-Source Classification
            </h3>
            <div className="prose prose-lg max-w-none text-center">
              <p>
                Most theories propose new mechanisms. AIM proposes new <strong>categories</strong>. 
                This isn&apos;t an incremental improvement—it&apos;s a fundamental reorganization of how we 
                understand human motivation.
              </p>
              <p className="font-semibold text-primary-800">
                If validated, AIM would provide the first neuroscientific basis for 
                cross-disciplinary definitions of fundamental human concepts like freedom, 
                respect, fairness, and privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-lg">
        <h2>A New Understanding of Human Choice</h2>
        <p>
          For decades, researchers across economics, psychology, and neuroscience have struggled 
          with a fundamental question: Why do we want what we want? Traditional models treat 
          &ldquo;preference&rdquo; or &ldquo;desire&rdquo; as a single, undifferentiated force. But the reality is far 
          more nuanced.
        </p>
        <p>
          The AIM Motivation Framework provides the answer by distinguishing three distinct neural 
          sources of motivation that integrate through the brain&apos;s common-currency valuation system.
        </p>

        <h2>The Three Sources in Detail</h2>

        <div className="not-prose bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200 my-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-4xl mr-3">🍽️</span>
            Appetites (A): Homeostatic Motivation
          </h3>
          <p className="text-gray-700 mb-4">
            Motivations arising from physiological deficits—hunger, thirst, thermoregulation, 
            fatigue, sexual drive—that originate in homeostatic monitoring systems.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Characteristics:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• State-dependent intensity</li>
                <li>• Cyclical (return as need rebuilds)</li>
                <li>• Terminal satisfiability</li>
                <li>• Rapid value collapse after satiety</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Neural Basis:</h4>
              <p className="text-gray-600">
                Hypothalamus → orbitofrontal cortex → ventral striatum
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4 font-semibold">
            Why it matters: Unmet appetites hijack decision-making. When sleep-deprived or hungry, 
            choices shift dramatically because A dominates the valuation signal.
          </p>
        </div>

        <div className="not-prose bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200 my-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-4xl mr-3">💡</span>
            Intrinsic Motivation (I): Process-Rewarding Engagement
          </h3>
          <p className="text-gray-700 mb-4">
            Internal, self-endorsed engagement in activities rewarding in the doing—curiosity, 
            exploration, mastery, autonomous choice, play, aesthetic creation, flow.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Characteristics:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Persistent across contexts and time</li>
                <li>• Process-focused (doing is the reward)</li>
                <li>• Autonomy-sensitive</li>
                <li>• Privately valued</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Neural Basis:</h4>
              <p className="text-gray-600">
                VTA dopamine → hippocampus coupling → prefrontal cortex
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4 font-semibold">
            Why it matters: Intrinsic motivation is the foundation of freedom, creativity, and 
            lasting satisfaction. When I leads, people persist through setbacks and experience 
            well-being independent of social approval.
          </p>
        </div>

        <div className="not-prose bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200 my-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-4xl mr-3">👥</span>
            Mimetic Desire (M): Socially Transmitted Wanting
          </h3>
          <p className="text-gray-700 mb-4">
            Desires sparked by observing others&apos; goal-directed actions, social opinions, prestige 
            cues, and status signals. You want something because you see others wanting it.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Characteristics:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Observability-dependent</li>
                <li>• Pre-conscious (don&apos;t remember source)</li>
                <li>• Rivalry-prone</li>
                <li>• Visibility-sensitive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Neural Basis:</h4>
              <p className="text-gray-600">
                Mirror neurons (parietal/premotor) → ventral striatum
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4 font-semibold">
            Why it matters: Mimetic desire explains herding, bubbles, social anxiety, and status 
            competition. It&apos;s not inherently bad—it enables culture and learning—but becomes 
            problematic when it creates rivalry or overrides intrinsic aims.
          </p>
        </div>

        <h2>The Common-Currency Integration System</h2>
        <p>
          The brain doesn&apos;t maintain separate decision systems for each source. Instead, the 
          <strong> ventromedial prefrontal cortex (vmPFC)</strong> and <strong>ventral striatum (VS)</strong> 
          compute a unified &ldquo;common currency&rdquo; of subjective value that integrates A, I, and M into a 
          single priority signal used for choice.
        </p>
        
        <div className="not-prose bg-gray-50 p-6 rounded-lg my-6">
          <p className="font-mono text-center text-lg">
            U(x) = w<sub>A</sub>U<sub>A</sub>(x) + w<sub>I</sub>U<sub>I</sub>(x) + w<sub>M</sub>U<sub>M</sub>(x)
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            Where w<sub>A</sub>, w<sub>I</sub>, w<sub>M</sub> are normalized weights (sum to 1) 
            representing the proportional influence of each source
          </p>
        </div>

        <h2>About the Researcher</h2>
        <div className="not-prose bg-gray-50 p-6 rounded-xl my-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              {/* Placeholder for profile image */}
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                Photo
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Yule Guttenbeil</h3>
              <p className="text-gray-700 mb-3">
                Yule Guttenbeil is a practicing lawyer and independent researcher who developed 
                the AIM Framework through deep interdisciplinary synthesis. His background in law 
                provided a unique lens: the need for precise definitions and clear boundaries that 
                prevent conflation—the same rigor required for good contracts.
              </p>
              <p className="text-gray-700 italic">
                &ldquo;I wasn&apos;t trying to invent new data or observations. All the neuroscience, all the 
                behavioral evidence was already there. I just needed to put better boundaries around 
                the categories of motivation. Once I did that, suddenly everything clicked.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="not-prose mt-12 p-8 bg-primary-50 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Research</h2>
          <p className="text-gray-700 mb-6">
            AIM is a living framework. We&apos;re actively seeking researchers to test predictions, 
            practitioners to apply interventions, and organizations to pilot system redesigns.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contact Us to Collaborate
          </Link>
        </div>
      </article>
    </div>
  )
}
