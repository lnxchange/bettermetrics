/**
 * Canonical AIM Framework Definitions Component
 * 
 * These definitions are extracted from Report 1.1 and serve as the single source
 * of truth for how the framework is described across the entire website.
 */

export function AIMDefinitionsShort() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Appetites <span className="text-amber-600">(A)</span>
          </h3>
          <p className="text-sm text-gray-700">
            Homeostatic and physiological motivation plus basic safety needs. Cyclical, satiable, state-dependent.
          </p>
          <p className="mt-2 text-xs text-gray-600 italic">
            Examples: hunger, thirst, sleep, temperature regulation, physical safety
          </p>
        </div>

        <div className="rounded-lg border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Intrinsic Motivation <span className="text-teal-600">(I)</span>
          </h3>
          <p className="text-sm text-gray-700">
            Process-rewarding engagement. Persists in private, autonomy-aligned, context-independent.
          </p>
          <p className="mt-2 text-xs text-gray-600 italic">
            Examples: curiosity, mastery, flow states, autonomous projects, aesthetic creation
          </p>
        </div>

        <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Mimetic Desire <span className="text-purple-600">(M)</span>
          </h3>
          <p className="text-sm text-gray-700">
            Socially transmitted wanting through observation of models. Rivalry-prone, observability-sensitive.
          </p>
          <p className="mt-2 text-xs text-gray-600 italic">
            Examples: status-seeking, keeping up with neighbors, social comparison, viral trends
          </p>
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
        All three sources combine in the brain's common-currency valuation system to create a unified motivational signal:
      </p>
      <div className="my-6 rounded bg-white p-4 text-center font-mono text-lg">
        U(x) = w<sub>A</sub> · U<sub>A</sub>(x) + w<sub>I</sub> · U<sub>I</sub>(x) + w<sub>M</sub> · U<sub>M</sub>(x)
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Where:</strong></p>
        <ul className="ml-6 list-disc space-y-1">
          <li><strong>w<sub>A</sub>, w<sub>I</sub>, w<sub>M</sub></strong>: Normalized weights (sum to 1) representing how much each source influences this choice right now</li>
          <li><strong>U<sub>A</sub></strong>: Utility from appetite satisfaction (cyclical, terminally satisfiable)</li>
          <li><strong>U<sub>I</sub></strong>: Utility from intrinsic engagement (persistent, autonomous)</li>
          <li><strong>U<sub>M</sub></strong>: Utility from mimetic desire (amplified by social visibility)</li>
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
        Each motivational source has distinct neural pathways that converge in the brain's common-currency valuation system:
      </p>
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">Appetites (A):</p>
          <p className="text-sm text-amber-800">Hypothalamus → Orbitofrontal Cortex → Ventral Striatum</p>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="font-semibold text-teal-900">Intrinsic Motivation (I):</p>
          <p className="text-sm text-teal-800">VTA Dopamine → Hippocampus → Prefrontal Cortex</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <p className="font-semibold text-purple-900">Mimetic Desire (M):</p>
          <p className="text-sm text-purple-800">Mirror Neurons (Parietal/Premotor) → Ventral Striatum</p>
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
        Note: AIM is primarily a taxonomy and weighting system for existing neural processes, 
        not a claim about new brain regions.
      </p>
    </div>
  )
}

export function DescriptiveVsNormative() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">What AIM Describes</h3>
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
        <h3 className="mb-3 text-2xl font-bold text-gray-900">What AIM Recommends</h3>
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
    <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
      <h3 className="mb-3 text-xl font-bold text-gray-900">The Mimetic Premium (V<sub>M</sub>)</h3>
      <p className="mb-4 text-gray-700">
        A key concept from the AIM Framework: the excess value paid for social signaling, 
        separate from basic need or intrinsic quality.
      </p>
      <div className="rounded-lg bg-white p-4 border border-purple-200">
        <p className="text-sm font-semibold text-gray-900 mb-2">Example: Bottled Water</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Total Price:</strong> $5.00</li>
          <li className="ml-4"><span className="text-amber-600">A-component (Appetite):</span> $0.50 — hydration value</li>
          <li className="ml-4"><span className="text-teal-600">I-component (Intrinsic):</span> $0.50 — taste, convenience, quality</li>
          <li className="ml-4"><span className="text-purple-600">M-component (Mimetic):</span> $4.00 — status, brand signaling</li>
        </ul>
      </div>
      <p className="mt-4 text-xs text-gray-600">
        Understanding the Mimetic Premium helps explain pricing anomalies, luxury goods markets, 
        and why identical products command different prices based on social visibility.
      </p>
    </div>
  )
}

