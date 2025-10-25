import Link from 'next/link'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function UnderstandYourselfPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Understanding Your Motivations
          </h1>
          <p className="text-xl text-gray-600">
            Even as a hypothesis, AIM offers a useful lens for understanding yourself and your relationships.
          </p>
        </div>
      </section>

      {/* Three Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          The Three Questions
        </h2>
        
        <div className="bg-white p-8 rounded-xl border-2 border-primary-200">
          <p className="text-lg text-gray-700 mb-6">
            When you want something, ask:
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-amber-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1️⃣ Is my body telling me I need this? (Appetite)
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Am I hungry, tired, cold, uncomfortable?</li>
                <li>• Will satisfying this need make the wanting go away?</li>
                <li>• Is this a recurring cycle?</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-teal-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                2️⃣ Do I genuinely enjoy the process? (Intrinsic)
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Would I want this even if no one knew about it?</li>
                <li>• Is the activity itself rewarding, not just the outcome?</li>
                <li>• Do I lose track of time when I do this?</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3️⃣ Am I wanting this because others have/want it? (Mimetic)
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Did I notice this because someone else was pursuing it?</li>
                <li>• Does the visibility or status matter to me?</li>
                <li>• Would I stop wanting it if it became uncool or common?</li>
              </ul>
            </div>
          </div>
          
          <p className="text-gray-600 mt-6 text-center italic">
            Most wants involve multiple sources. The key is knowing which is driving you.
          </p>
        </div>
      </section>

      {/* Life Domains */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Applying AIM to Your Life
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Career Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💼 In Your Career</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-teal-600 mb-2">Intrinsic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• You&apos;d do this work even if paid less</li>
                    <li>• You get into flow states</li>
                    <li>• You care about craft and mastery</li>
                    <li>• Private satisfaction matters most</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Mimetic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Title and status drive your choices</li>
                    <li>• You compare yourself to peers constantly</li>
                    <li>• Prestige of company/role matters greatly</li>
                    <li>• Recognition is primary motivator</li>
                  </ul>
                </div>
                
                <div className="bg-primary-50 p-3 rounded text-sm">
                  <strong>Test:</strong> &ldquo;Would I want this promotion if it meant more bureaucracy 
                  and less actual work I enjoy?&rdquo;
                </div>
              </div>
            </div>
            
            {/* Relationships Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">❤️ In Relationships</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-teal-600 mb-2">Intrinsic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• You enjoy their company privately</li>
                    <li>• You&apos;d want to be with them even if no one knew</li>
                    <li>• You feel energized, not drained</li>
                    <li>• You appreciate them for who they are</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Mimetic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• You want to be seen with them</li>
                    <li>• Their status or attractiveness matters most</li>
                    <li>• You compare them to others constantly</li>
                    <li>• You&apos;re more interested in what others think</li>
                  </ul>
                </div>
                
                <div className="bg-primary-50 p-3 rounded text-sm">
                  <strong>Test:</strong> &ldquo;Would I still want this relationship if it had to be completely private?&rdquo;
                </div>
              </div>
            </div>
            
            {/* Purchases Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🛍️ In Purchases</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-teal-600 mb-2">Intrinsic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• You care about quality and functionality</li>
                    <li>• You&apos;d buy it even if no one saw it</li>
                    <li>• You research features and reviews</li>
                    <li>• You use it regularly and get value</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Mimetic Signs:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• You want the latest/best version</li>
                    <li>• Brand name matters more than function</li>
                    <li>• You buy to impress others</li>
                    <li>• You rarely use it after buying</li>
                  </ul>
                </div>
                
                <div className="bg-primary-50 p-3 rounded text-sm">
                  <strong>Test:</strong> &ldquo;Would I buy this if I could never show it to anyone?&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          When Mimetic Desire Becomes Problematic
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              <HiCheckCircle className="mr-2" /> Healthy Mimesis
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Learning from role models</li>
              <li>• Cultural transmission</li>
              <li>• Healthy aspiration</li>
              <li>• Social learning and adaptation</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
              <HiXCircle className="mr-2" /> Unhealthy Mimesis
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Rivalry and resentment</li>
              <li>• Never-ending comparison</li>
              <li>• Losing intrinsic aims</li>
              <li>• Status anxiety and burnout</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Warning Signs</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>□ Constantly comparing yourself to others</li>
              <li>□ Resentment toward successful peers</li>
              <li>□ Can&apos;t enjoy achievements</li>
              <li>□ Changing goals based on prestige</li>
            </ul>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>□ Feeling hollow after status wins</li>
              <li>□ Chronic dissatisfaction despite success</li>
              <li>□ Losing interest in activities you used to love</li>
              <li>□ Anxiety about falling behind</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Relationships & Rivalry */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Relationships & Rivalry
          </h2>
          
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
            <p className="text-lg text-gray-700 mb-6">
              AIM suggests that mimetic desire can create rivalry when two people want the same thing 
              for status reasons. This can damage relationships and create unnecessary competition.
            </p>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Recognizing Rivalry
                </h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• You feel competitive about the same goals</li>
                  <li>• You resent their success in your field</li>
                  <li>• You compare your progress to theirs</li>
                  <li>• You feel threatened by their achievements</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Healthy Alternatives
                </h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Focus on your own intrinsic motivations</li>
                  <li>• Celebrate others&apos; success genuinely</li>
                  <li>• Collaborate instead of competing</li>
                  <li>• Find your unique path and purpose</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Remember:</strong> If you&apos;re both pursuing something for intrinsic reasons, 
                there&apos;s generally no rivalry—you can both succeed - even if it means sharing a tool. 
                Rivalry mostly exists when you&apos;re competing for status, recognition or you simply want 
                to beat someone you see as your rival.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
