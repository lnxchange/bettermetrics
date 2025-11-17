'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { HiArrowRight, HiRefresh } from 'react-icons/hi'

const scenarios = [
  {
    id: 1,
    question: "You're considering a major career change. What's your primary motivation?",
    options: [
      {
        id: 'a',
        text: "The current job doesn&apos;t pay enough to cover my basic needs and I'm constantly stressed about money",
        source: 'A',
        explanation: "This is appetitive motivation—your physiological security needs are unmet and dominating your decision-making."
      },
      {
        id: 'b',
        text: "I'm bored and unchallenged. I want to master new skills and work on projects that genuinely interest me",
        source: 'I',
        explanation: "This is intrinsic motivation—you&apos;re seeking autonomy, competence, and engagement for their own sake."
      },
      {
        id: 'c',
        text: "Everyone in my social circle is advancing faster than me. I need a more prestigious title or company",
        source: 'M',
        explanation: "This is mimetic desire—you&apos;re comparing yourself to social models and wanting what they have."
      }
    ]
  },
  {
    id: 2,
    question: "Why do you want to buy that new item (car, phone, clothes, etc.)?",
    options: [
      {
        id: 'a',
        text: "My current one is broken or unsafe, and I need it to function properly in daily life",
        source: 'A',
        explanation: "Appetitive—the item serves a genuine functional need for safety or basic capability."
      },
      {
        id: 'b',
        text: "The new features would genuinely improve my workflow or enable creative projects I'm passionate about",
        source: 'I',
        explanation: "Intrinsic—you value the tool for how it enables autonomous, meaningful activity."
      },
      {
        id: 'c',
        text: "I see others with it and feel like I'm falling behind or missing out. It would show I'm successful",
        source: 'M',
        explanation: "Mimetic—you&apos;re responding to social visibility and status signaling, not intrinsic quality."
      }
    ]
  },
  {
    id: 3,
    question: "You have a free Saturday afternoon. How do you decide what to do?",
    options: [
      {
        id: 'a',
        text: "I'm exhausted and need to rest, or I have urgent household needs that can&apos;t wait",
        source: 'A',
        explanation: "Appetitive—your body is signaling deficit (fatigue, hunger) or basic maintenance needs."
      },
      {
        id: 'b',
        text: "I choose an activity I find genuinely absorbing—reading, creating, learning—regardless of what others think",
        source: 'I',
        explanation: "Intrinsic—you&apos;re selecting based on autonomous interest and process-rewarding engagement."
      },
      {
        id: 'c',
        text: "I check what friends are doing, look at social media, and feel pulled toward whatever seems popular or impressive",
        source: 'M',
        explanation: "Mimetic—your choices are mediated through observation of others' visible activities."
      }
    ]
  }
]

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (questionId: number, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const calculateResults = () => {
    const sources = { A: 0, I: 0, M: 0 }
    scenarios.forEach(scenario => {
      const selectedOptionId = answers[scenario.id]
      if (selectedOptionId) {
        const option = scenario.options.find(opt => opt.id === selectedOptionId)
        if (option) {
          sources[option.source as 'A' | 'I' | 'M']++
        }
      }
    })
    return sources
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length === scenarios.length) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setShowResults(false)
  }

  const results = showResults ? calculateResults() : null
  const dominant = results ? 
    (Object.entries(results).sort(([,a], [,b]) => b - a)[0][0] as 'A' | 'I' | 'M') : null

  const sourceColors = {
    A: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-600' },
    I: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-600' },
    M: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600' }
  }

  const sourceDescriptions = {
    A: {
      name: "Appetites",
      summary: "Your motivations are currently dominated by physiological and safety needs.",
      insight: "When appetites dominate, it&apos;s difficult to focus on intrinsic projects or resist mimetic pressure. This isn&apos;t a personal failing—it&apos;s how the brain's valuation system works. Securing basic needs should be the priority.",
      recommendation: "Focus on stabilizing your A-layer: consistent income, safe housing, reliable food access, adequate rest. Once appetites are secured, intrinsic motivation and autonomous choice become much more accessible."
    },
    I: {
      name: "Intrinsic Motivation",
      summary: "Your motivations are primarily driven by autonomous interest and mastery.",
      insight: "You're making choices based on genuine engagement rather than external pressures. This is associated with higher well-being, creativity, and resilience. However, don&apos;t neglect appetitive needs or become oblivious to mimetic pressures that can still influence you.",
      recommendation: "Protect your intrinsic space: guard against mimetic infiltration (status competitions, social comparison), ensure A-layer security doesn&apos;t erode, and be mindful when institutions try to hijack your I-motivation with external rewards."
    },
    M: {
      name: "Mimetic Desire",
      summary: "Your motivations are strongly influenced by social observation and comparison.",
      insight: "You're making choices based on what you see others wanting or having. This isn&apos;t inherently bad—social learning is essential—but when mimetic signals dominate, they can crowd out intrinsic interests and lead to rivalry, anxiety, and unfulfilling pursuits.",
      recommendation: "Practice the audience-removal test: would you still want this if no one could see it? Reduce exposure to high-visibility social media. Seek low-status environments where genuine skill matters more than prestige. Reconnect with activities that absorbed you before you worried about comparison."
    }
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Motivational Self-Diagnosis
          </h1>
          <p className="text-xl text-gray-600">
            Answer three questions to identify which motivational source is currently dominant in your decision-making
          </p>
        </div>
      </section>

      {/* Diagnostic Tool */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!showResults ? (
          <>
            <div className="mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <p className="text-gray-700">
                <strong>How this works:</strong> Each question presents three options representing the three motivational sources. 
                Choose the option that most accurately reflects your current thinking. There are no &quot;right&quot; answers—this is about self-awareness, not judgment.
              </p>
            </div>

            {scenarios.map((scenario, index) => (
              <div key={scenario.id} className="mb-8 rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{scenario.question}</h3>
                </div>

                <div className="space-y-3">
                  {scenario.options.map(option => {
                    const isSelected = answers[scenario.id] === option.id
                    const colors = sourceColors[option.source as 'A' | 'I' | 'M']
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(scenario.id, option.id)}
                        className={`w-full rounded-lg border-2 p-4 text-left transition ${
                          isSelected
                            ? `${colors.border} ${colors.bg}`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full ${
                            isSelected ? colors.badge : 'bg-gray-300'
                          } text-xs font-bold text-white`}>
                            {option.source}
                          </div>
                          <p className={`flex-1 ${isSelected ? colors.text : 'text-gray-700'}`}>
                            {option.text}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < scenarios.length}
                className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                See Your Results
                <HiArrowRight className="ml-2 h-5 w-5" />
              </button>
              {Object.keys(answers).length < scenarios.length && (
                <p className="mt-3 text-sm text-gray-500">
                  Please answer all {scenarios.length} questions to see results
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Results Display */}
            <div className="mb-8 rounded-xl border-2 border-green-200 bg-green-50 p-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Your Results</h2>
              <div className="mb-6 flex items-center justify-center gap-6">
                {Object.entries(results!).map(([source, count]) => {
                  const colors = sourceColors[source as 'A' | 'I' | 'M']
                  return (
                    <div key={source} className="text-center">
                      <div className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full ${colors.badge} text-2xl font-bold text-white`}>
                        {count}
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{source}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {dominant && (
              <div className={`mb-8 rounded-xl border-2 ${sourceColors[dominant].border} ${sourceColors[dominant].bg} p-8`}>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Your Dominant Source: {sourceDescriptions[dominant].name}
                </h3>
                <p className="mb-4 text-lg font-semibold text-gray-800">
                  {sourceDescriptions[dominant].summary}
                </p>
                <p className="mb-4 text-gray-700">
                  {sourceDescriptions[dominant].insight}
                </p>
                <div className="rounded-lg bg-white p-4">
                  <p className="font-semibold text-gray-900 mb-2">What to do:</p>
                  <p className="text-gray-700">{sourceDescriptions[dominant].recommendation}</p>
                </div>
              </div>
            )}

            {/* Explanations for each answer */}
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Understanding Your Answers</h3>
              {scenarios.map(scenario => {
                const selectedOptionId = answers[scenario.id]
                const selectedOption = scenario.options.find(opt => opt.id === selectedOptionId)
                if (!selectedOption) return null

                const colors = sourceColors[selectedOption.source as 'A' | 'I' | 'M']

                return (
                  <div key={scenario.id} className={`mb-4 rounded-lg border-2 ${colors.border} ${colors.bg} p-6`}>
                    <p className="mb-2 font-semibold text-gray-900">{scenario.question}</p>
                    <p className="mb-2 text-sm text-gray-700"><strong>You chose:</strong> {selectedOption.text}</p>
                    <p className="text-sm text-gray-700"><strong>Analysis:</strong> {selectedOption.explanation}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
              >
                <HiRefresh className="mr-2 h-5 w-5" />
                Take Again
              </button>
              <Link
                href="/understand-your-motivations"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Learn More About AIM
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Important Context */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 text-center">Important Context</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>This is situational, not permanent:</strong> Your dominant motivational source can change based on context. 
              When you&apos;re sleep-deprived or financially stressed, A dominates. When secure and engaged, I can flourish. 
              When surrounded by high-status models and visible competition, M intensifies.
            </p>
            <p>
              <strong>All three are always present:</strong> You always have appetites, intrinsic interests, and mimetic influences. 
              This diagnostic identifies which is currently winning the weighting in your brain&apos;s common-currency valuation system.
            </p>
            <p>
              <strong>Not a personality test:</strong> This isn&apos;t about fixed traits. It&apos;s about understanding the structural 
              dynamics of motivation so you can make more intentional choices about your environment, goals, and priorities.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

