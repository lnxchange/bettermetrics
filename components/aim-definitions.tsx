import { MathText } from '@/components/math-text'

/**
 * Canonical AIM Framework Definitions Component
 *
 * Definitions follow the AIM Treatise, Chapter 4, Section 4.3.1 (Axiom 1).
 * Keep this the single place the three sources are described on the site.
 *
 * COLOUR SCHEME, one colour per letter:
 * - Appetites (A) = red
 * - Intrinsic Motivation (I) = green
 * - Mimetic Desire (M) = blue
 */

export function AIMDefinitionsShort() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border-2 border-appetites/30 bg-gradient-to-br from-appetites-soft to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Appetites <span className="text-appetites">(A)</span>
          </h3>
          <p className="text-sm text-gray-700">
            What the body and basic security need: food, rest, warmth, safety, shelter, a
            floor of income. Urgent while active; fades once met; returns when the deficit
            does.
          </p>
          <p className="mt-2 text-xs italic text-gray-600">Signature: satiates, then recurs.</p>
        </div>

        <div className="rounded-lg border-2 border-intrinsic/30 bg-gradient-to-br from-intrinsic-soft to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Intrinsic Motivation <span className="text-intrinsic">(I)</span>
          </h3>
          <p className="text-sm text-gray-700">
            What is rewarding in the doing: curiosity, mastery, play, care, creative work,
            genuine connection. Continues in private with no audience or reward, and deepens
            as competence grows.
          </p>
          <p className="mt-2 text-xs italic text-gray-600">Signature: persists in private.</p>
        </div>

        <div className="rounded-lg border-2 border-mimetic/30 bg-gradient-to-br from-mimetic-soft to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Mimetic Desire <span className="text-mimetic">(M)</span>
          </h3>
          <p className="text-sm text-gray-700">
            A salience signal: what stands out as valuable in the surroundings. What other
            people visibly want is the strongest cue, but novelty, scarcity and display register
            the same way. Prone to rivalry when people converge on the same targets.
          </p>
          <p className="mt-2 text-xs italic text-gray-600">Signature: interest evaporates once novelty is worn off.</p>
        </div>
      </div>
    </div>
  )
}

export function AIMIntegrationEquation() {
  return (
    <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
      <h3 className="mb-4 text-xl font-bold text-gray-900">The Integration Equation</h3>
      <p className="mb-4 text-gray-700">
        All three sources combine in the brain&apos;s common-currency valuation system to create a unified motivational signal:
      </p>
      <div className="my-6 overflow-x-auto rounded bg-white p-4 text-center text-lg text-gray-900">
        <MathText text="$U(x) = w_A \cdot U_A(x) + w_I \cdot U_I(x) + w_M \cdot U_M(x)$" />
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Where:</strong></p>
        <ul className="ml-6 list-disc space-y-1">
        <li><MathText text="$\mathbf{w_A}$, $\mathbf{w_I}$, $\mathbf{w_M}$" />: weights that sum to 1, for how much each source influences this choice right now</li>
        <li><MathText text="$U_A$" />: utility from appetite satisfaction (cyclical, terminally satisfiable)</li>
        <li><MathText text="$U_I$" />: utility from intrinsic engagement (persistent, autonomous)</li>
        <li><MathText text="$U_M$" />: utility from mimetic desire (amplified by social visibility)</li>
        </ul>
      </div>
    </div>
  )
}

export function NeuralCircuits() {
  return (
    <div className="rounded-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
      <h3 className="mb-4 text-xl font-bold text-gray-900">Neural Architecture</h3>
      <p className="mb-4 text-gray-700">
        Each motivational source has distinct neural pathways that converge in the brain&apos;s common-currency valuation system:
      </p>
      <div className="space-y-4">
        <div className="rounded-lg border border-appetites/30 bg-appetites-soft p-4">
          <p className="font-semibold text-appetites">Appetites (A):</p>
          <p className="text-sm text-appetites/90">Hypothalamus → Orbitofrontal Cortex → Ventral Striatum</p>
        </div>
        <div className="rounded-lg border border-intrinsic/30 bg-intrinsic-soft p-4">
          <p className="font-semibold text-intrinsic">Intrinsic Motivation (I):</p>
          <p className="text-sm text-intrinsic/90">VTA Dopamine → Hippocampus → Prefrontal Cortex</p>
        </div>
        <div className="rounded-lg border border-mimetic/30 bg-mimetic-soft p-4">
          <p className="font-semibold text-mimetic">Mimetic Desire (M):</p>
          <p className="text-sm text-mimetic/90">Mirror Neurons (Parietal/Premotor) → Ventral Striatum</p>
        </div>
        <div className="rounded-lg border-2 border-indigo-300 bg-indigo-100 p-4">
          <p className="font-semibold text-indigo-900">Integration Hub:</p>
          <p className="text-sm text-indigo-800">
            All sources converge in the ventromedial Prefrontal Cortex (vmPFC) and Ventral Striatum (VS)
            for unified priority signaling and action selection.
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-600 italic">
        Note: the AIM Framework is primarily a taxonomy and weighting system for existing neural processes,
        not a claim about new brain regions.
      </p>
    </div>
  )
}

export function DescriptiveVsNormative() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">What the AIM Framework Describes</h3>
        <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>Three neurologically distinct sources of motivation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>Common-currency integration through weighting in vmPFC/VS</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>Threshold-and-switch mechanisms (buffer, completion triggers, boredom, frustration)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>Structural explanation of restlessness and motivational conflict</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>How different contexts shift motivational weights (w<sub>A</sub>, w<sub>I</sub>, w<sub>M</sub>)</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">What the AIM Framework Recommends</h3>
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <p className="mb-4 text-gray-700">
            The normative proposals flow directly from the descriptive clarity. When we can distinguish 
            which parts of behavior are appetitive, intrinsic, or mimetic, we can articulate more precisely:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 font-bold text-green-700">Freedom:</span>
              <span>Intrinsic motivation leads while appetites are reliably regulated and mimetic pressures are deliberately managed</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold text-green-700">Fairness:</span>
              <span>Prioritizing appetitive sufficiency and intrinsic autonomy while neutralizing undue mimetic advantages</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold text-green-700">Respect:</span>
              <span>Protecting appetites and intrinsic projects while avoiding coercive mimetic manipulation</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 italic">
            These normative suggestions are meant to let the clearer motivational picture do as much 
            of the work as possible, rather than importing additional philosophical commitments.
          </p>
        </div>
      </div>
    </div>
  )
}

export function MimeticPremium() {
  return (
    <div className="rounded-lg border-2 border-mimetic/30 bg-gradient-to-br from-mimetic-soft to-white p-6">
      <h3 className="mb-3 text-xl font-bold text-gray-900">Price Decomposition and the Mimetic Premium (P<sub>M</sub>)</h3>
      <p className="mb-4 text-gray-700">
        Any price separates into three parts: what the object would cost bought purely to
        correct a deficit, the extra for quality sufficient to support genuine engagement, and
        the residual paid for what owning it signals.
      </p>
      <div className="rounded-lg border border-mimetic/20 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">Example: a $5 bottle of water</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="ml-4"><span className="font-medium text-appetites">A-Functional Price:</span> about $0.50 for hydration</li>
          <li className="ml-4"><span className="font-medium text-intrinsic">I-Adequate Price:</span> close to nothing; there is no process to support</li>
          <li className="ml-4"><span className="font-medium text-mimetic">Mimetic Premium:</span> the remaining $4.50, paid for the brand and the bottle being seen</li>
        </ul>
      </div>
      <p className="mt-4 text-xs text-gray-600">
        The premium is not set by any one model; it is the internalised network average of a
        reference group&apos;s valuations, each of which its holder experiences as their own.
      </p>
    </div>
  )
}

