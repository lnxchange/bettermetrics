import React from 'react'
import { CorpusIndex } from '@/lib/treatise-citations'
import { ResolvedBasis, TestingBasis } from '@/lib/testing-basis'
import { TestingChip } from '@/lib/testing-chip'
import { TestingStatus, TestingStatusFile } from '@/lib/testing-status'

const linkClass =
  'font-medium text-primary-700 underline decoration-primary-700/30 underline-offset-2 hover:decoration-primary-700 dark:text-blue-300 dark:decoration-blue-300/40 dark:hover:decoration-blue-300'

function BasisText({ basis, index }: { basis: string; index: CorpusIndex }) {
  const resolved = TestingBasis.resolve(basis, index)
  return <BasisLink resolved={resolved} />
}

function BasisLink({ resolved }: { resolved: ResolvedBasis }) {
  if (!resolved.href) return <span>{resolved.text}</span>
  return (
    <>
      <a href={resolved.href} className={linkClass}>
        {resolved.text}
      </a>
      {resolved.note ? <span> {resolved.note}</span> : null}
    </>
  )
}

function StatusChip({
  prefix,
  word,
  definition
}: {
  prefix?: string
  word: string
  definition?: string
}) {
  const label = prefix ? `${prefix}: ${word}` : word
  const className = `${TestingChip.className(
    word
  )} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300`
  if (!definition) {
    return (
      <span className={className} data-treatment={TestingChip.treatment(word)}>
        {label}
      </span>
    )
  }
  return (
    <details className="max-w-full">
      <summary
        className={`${className} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
        data-treatment={TestingChip.treatment(word)}
      >
        {label}
      </summary>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {definition}
      </p>
    </details>
  )
}

function Prose({ children }: { children: string }) {
  return (
    <p className="text-base leading-relaxed text-foreground/90">{children}</p>
  )
}

function VocabularyList({
  title,
  entries
}: {
  title: string
  entries: Record<string, string>
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <dl className="mt-3 space-y-3">
        {Object.entries(entries).map(([name, definition]) => (
          <div key={name}>
            <dt className="font-medium text-foreground">{name}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function LogList({ entries }: { entries: TestingStatusFile['log'] }) {
  return (
    <ol className="space-y-6">
      {entries.map(entry => (
        <li
          key={`${entry.date}-${entry.kind}-${entry.title}`}
          className="border-l-2 border-border pl-4"
        >
          <p className="text-sm text-muted-foreground">
            <time dateTime={entry.date}>
              {TestingStatus.formatDate(entry.date)}
            </time>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            <span className="font-medium uppercase tracking-wide">
              {TestingStatus.kindLabel(entry.kind)}
            </span>
          </p>
          <p className="mt-1 font-semibold text-foreground">{entry.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
            {entry.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}

function Results({
  status,
  index
}: {
  status: TestingStatusFile
  index: CorpusIndex
}) {
  const rows = status.validation.internal.results
  return (
    <>
      <div className="space-y-4 md:hidden">
        {rows.map((row, position) => (
          <article
            key={`${row.area}-${position}`}
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Area
            </p>
            <p className="font-medium text-foreground">{row.area}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Result
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {row.claim}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Where
            </p>
            <p className="text-sm">
              <BasisText basis={row.basis} index={index} />
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <div className="mt-1">
              <StatusChip
                word={row.status}
                definition={status.vocabulary.result_status[row.status]}
              />
            </div>
          </article>
        ))}
      </div>
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-4 font-semibold">
              Area
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Result
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Where
            </th>
            <th scope="col" className="py-2 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, position) => (
            <tr
              key={`${row.area}-${position}`}
              className="border-b border-border align-top"
            >
              <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                {row.area}
              </th>
              <td className="py-3 pr-4 leading-relaxed text-foreground/90">
                {row.claim}
              </td>
              <td className="py-3 pr-4">
                <BasisText basis={row.basis} index={index} />
              </td>
              <td className="py-3">
                <StatusChip
                  word={row.status}
                  definition={status.vocabulary.result_status[row.status]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function TestingFallback() {
  return (
    <div className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Testing the Framework
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {TestingStatus.preparing}
          </p>
        </header>
      </div>
    </div>
  )
}

export function TestingDocument({
  status,
  index
}: {
  status: TestingStatusFile | null
  index: CorpusIndex
}) {
  if (!status) return <TestingFallback />
  const resultLine = TestingStatus.resultLine(status.derived)
  const taskLine = TestingStatus.taskLine(status.derived.taskCounts)
  const log = TestingStatus.splitLog(status.log)
  return (
    <div className="flex-1 bg-background text-foreground">
      <header className="border-b border-border bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:max-w-4xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {status.page.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">
            {status.page.summary}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated{' '}
            <time dateTime={status.lastUpdated}>
              {TestingStatus.formatDate(status.lastUpdated)}
            </time>
            {' · '}
            Latest change{' '}
            <time dateTime={status.latestChange}>
              {TestingStatus.formatDate(status.latestChange)}
            </time>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-6 lg:max-w-4xl lg:px-8">
        <p className="text-lg leading-relaxed text-foreground/90">
          {status.page.intro}
        </p>

        <section
          aria-labelledby="what-would-count-against-the-framework"
          className="space-y-5"
        >
          <h2
            id="what-would-count-against-the-framework"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            What would count against the framework
          </h2>
          <Prose>{status.falsification.note}</Prose>
          <div className="space-y-4">
            {status.falsification.predictions.map(prediction => (
              <article
                key={prediction.id}
                id={
                  /^[A-Za-z][\w-]*$/.test(prediction.id)
                    ? prediction.id
                    : undefined
                }
                className="scroll-mt-24 rounded-lg border border-border bg-card p-5"
              >
                <h3 className="text-base font-semibold leading-relaxed text-foreground">
                  {prediction.prediction}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  <span className="font-medium text-foreground">
                    Would count against it:{' '}
                  </span>
                  {prediction.would_count_against}
                </p>
                <p className="mt-3 text-sm">
                  <BasisText basis={prediction.basis} index={index} />
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusChip
                    prefix="Derivation"
                    word={prediction.derivation}
                    definition={
                      status.vocabulary.result_status[prediction.derivation]
                    }
                  />
                  <StatusChip
                    prefix="Evidence"
                    word={prediction.status}
                    definition={
                      status.vocabulary.prediction_status[prediction.status]
                    }
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="what-has-been-checked" className="space-y-5">
          <h2
            id="what-has-been-checked"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            What has been checked
          </h2>
          <Prose>{status.validation.internal.summary}</Prose>
          {resultLine ? (
            <p className="text-sm font-medium text-foreground">{resultLine}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {status.validation.internal.toolchain}
          </p>
          <Results status={status} index={index} />
          <Prose>{status.validation.external.summary}</Prose>
        </section>

        <section
          aria-labelledby="what-still-needs-measuring"
          className="space-y-5"
        >
          <h2
            id="what-still-needs-measuring"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            What still needs measuring
          </h2>
          <Prose>{status.calibration.note}</Prose>
          {taskLine ? (
            <p className="text-sm font-medium text-foreground">{taskLine}</p>
          ) : null}
          <ol className="space-y-5">
            {status.calibration.tasks.map(task => (
              <li
                key={task.title}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-foreground">{task.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {task.detail}
                </p>
                <p className="mt-3 text-sm text-foreground/90">
                  <span className="font-medium text-foreground">
                    Expertise:{' '}
                  </span>
                  {task.expertise}
                </p>
                <div className="mt-3">
                  <StatusChip
                    word={task.status}
                    definition={status.vocabulary.task_status[task.status]}
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="open-problems" className="space-y-5">
          <h2
            id="open-problems"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            Open problems
          </h2>
          <Prose>{status.openProblems.note}</Prose>
          <ol className="space-y-5">
            {status.openProblems.problems.map(problem => (
              <li key={problem.title}>
                <h3 className="font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {problem.detail}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {problem.field}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {status.collaborators.length > 0 ? (
          <section aria-labelledby="collaborators" className="space-y-5">
            <h2
              id="collaborators"
              className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
            >
              Collaborators
            </h2>
            <ul className="space-y-5">
              {status.collaborators.map(person => (
                <li key={person.name}>
                  <h3 className="font-semibold text-foreground">
                    {person.name}
                  </h3>
                  {person.affiliation ? (
                    <p className="text-sm text-muted-foreground">
                      {person.affiliation}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {person.contribution}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="log" className="space-y-5">
          <h2
            id="log"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            Log
          </h2>
          <LogList entries={log.latest} />
          {log.earlier.length > 0 ? (
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer text-sm font-medium text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-300">
                Show earlier entries
              </summary>
              <div className="mt-6">
                <LogList entries={log.earlier} />
              </div>
            </details>
          ) : null}
        </section>

        <section
          aria-labelledby="how-to-read-the-status-labels"
          className="space-y-6"
        >
          <h2
            id="how-to-read-the-status-labels"
            className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
          >
            How to read the status labels
          </h2>
          <VocabularyList
            title="Results"
            entries={status.vocabulary.result_status}
          />
          <VocabularyList
            title="Predictions"
            entries={status.vocabulary.prediction_status}
          />
          <VocabularyList
            title="Tasks"
            entries={status.vocabulary.task_status}
          />
        </section>

        <p className="border-t border-border pt-8 text-lg leading-relaxed">
          Researchers who can test a prediction, take a measurement, or work on
          an open problem are welcome to{' '}
          <a href="/contact" className={linkClass}>
            get in touch
          </a>
          .
        </p>
      </div>
    </div>
  )
}
