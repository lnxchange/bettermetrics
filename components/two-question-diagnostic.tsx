'use client'

import { useState } from 'react'
import { AskAI } from '@/components/ask-ai'

/**
 * The Two-Question Diagnostic (AIM Treatise, Chapter 18, Section 18.6).
 * Eliminative: test for A, then for I; if both fail, M is identified by
 * exclusion. The page does not try to explain the result in depth; it hands
 * the reader to the chat with their own case pre-loaded.
 *
 * The M result and the I-Test hint are verbatim Treatise text (§18.6.1, and
 * "M is the Salience signal" from the Chapter 2 entry for Mimetic Desire).
 * Keep them canonical rather than paraphrasing.
 */

type Step = 'object' | 'q1' | 'q2' | 'result'
type Result = 'A' | 'I' | 'M'

const results: Record<
  Result,
  { title: string; body: string; question: (obj: string) => string }
> = {
  A: {
    title: 'An Appetite is present',
    body:
      'This want is addressing a real need of the body or basic security. Expect it to subside once the need is met and to return when it recurs.',
    question: obj =>
      `I used the Two-Question Diagnostic on "${obj}" and it looks Appetite-led. What does the AIM Framework say about how Appetites behave, and could Mimetic Desire still be inflating how much of this I think I need?`
  },
  I: {
    title: 'Intrinsic Motivation is present',
    body:
      'You would still want this with no audience. Expect it to deepen rather than finish. The tools it needs will satiate; the engagement itself will not.',
    question: obj =>
      `I used the Two-Question Diagnostic on "${obj}" and it looks Intrinsically motivated. How can I protect that from being crowded out, and how would I notice if a Mimetic Premium was creeping in?`
  },
  M: {
    title: 'M is likely the primary driver',
    body:
      'If both tests fail, the desire is not bodily-need-driven and would not persist in private, M is identified by exclusion. M is the Salience signal. The Mimetic contribution arrives in the form of the very thing an introspective test would be looking for, a felt lack, and introspection asked to distinguish a Salience reading from a deficit is asked to read a distinction the integrated Scalar does not carry.',
    question: obj =>
      `I used the Two-Question Diagnostic on "${obj}" and it came out as Mimetic Desire by elimination. What does the AIM Framework say I should do with that, given Source Opacity and the Knowledge Patch?`
  }
}

export function TwoQuestionDiagnostic() {
  const [step, setStep] = useState<Step>('object')
  const [obj, setObj] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const label = obj.trim() || 'this'

  const reset = () => {
    setStep('object')
    setResult(null)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {step === 'object' && (
        <form
          onSubmit={e => {
            e.preventDefault()
            setStep('q1')
          }}
        >
          <label htmlFor="tqd-object" className="block text-sm font-medium text-gray-700">
            Name something you want right now
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="tqd-object"
              value={obj}
              onChange={e => setObj(e.target.value)}
              placeholder="a promotion, a bigger house, to learn the cello"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Start
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Nothing you type here is sent anywhere until you choose to ask the AI.
          </p>
        </form>
      )}

      {step === 'q1' && (
        <Question
          number={1}
          tag="A-Test"
          text={`Would you still need ${label} if your survival were secure?`}
          hint="Tests whether the want is addressing a real deficit of the body or basic security."
          onYes={() => {
            setResult('A')
            setStep('result')
          }}
          onNo={() => setStep('q2')}
        />
      )}

      {step === 'q2' && (
        <Question
          number={2}
          tag="I-Test"
          text={`Would you still want ${label} if no one could ever see you having or doing it?`}
          hint="Tests whether the desire persists without social observation."
          onYes={() => {
            setResult('I')
            setStep('result')
          }}
          onNo={() => {
            setResult('M')
            setStep('result')
          }}
        />
      )}

      {step === 'result' && result && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Result</p>
          <h3 className="mt-1 text-xl font-bold text-gray-900">{results[result].title}</h3>
          <p className="mt-2 text-gray-700">{results[result].body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <AskAI
              variant="button"
              question={results[result].question(label)}
              label="Ask the AI about this"
            />
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-600 underline-offset-2 hover:underline"
            >
              Try another
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            The diagnostic is eliminative and reads behaviour, not introspection. Your own
            report is least reliable exactly where a confabulation is operating, which is
            why the Treatise pairs it with Behavioural Signatures read by others.
          </p>
        </div>
      )}
    </div>
  )
}

function Question({
  number,
  tag,
  text,
  hint,
  onYes,
  onNo
}: {
  number: number
  tag: string
  text: string
  hint: string
  onYes: () => void
  onNo: () => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Question {number} · {tag}
      </p>
      <h3 className="mt-1 text-xl font-semibold text-gray-900">{text}</h3>
      <p className="mt-1 text-sm text-gray-600">{hint}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onYes}
          className="rounded-lg border-2 border-gray-300 px-6 py-2 text-base font-semibold text-gray-800 transition hover:border-blue-500 hover:bg-blue-50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={onNo}
          className="rounded-lg border-2 border-gray-300 px-6 py-2 text-base font-semibold text-gray-800 transition hover:border-blue-500 hover:bg-blue-50"
        >
          No
        </button>
      </div>
    </div>
  )
}
