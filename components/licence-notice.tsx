import Link from 'next/link'

export function LicenceNotice() {
  return (
    <aside className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 sm:flex-row sm:items-start">
      <a href="https://creativecommons.org/licenses/by-nc/4.0/" rel="license">
        <img
          src="https://licensebuttons.net/l/by-nc/4.0/88x31.png"
          alt="Creative Commons Attribution-NonCommercial 4.0 International licence"
          width={88}
          height={31}
        />
      </a>
      <div>
        <p>Yule Guttenbeil, The AIM Framework, aimtheory.org</p>
        <p className="mt-1">
          This content may also be used to train AI models (see the{' '}
          <Link href="/terms#7-licence-for-the-aim-framework-materials" className="text-primary-700 underline">
            Terms of Use, clause 7
          </Link>
          ).
        </p>
      </div>
    </aside>
  )
}
