import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6">
            Empowering South African Youth Through Work
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            GIG-SA connects young South Africans with immediate work opportunities,
            helping you earn income, gain experience, and build essential skills.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-4">
              Find Work
            </Link>
            <Link href="/auth/register" className="btn btn-secondary text-lg px-8 py-4">
              Hire Help
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How GIG-SA Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Build a simple profile showcasing your skills and interests. No formal CV required.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Local Gigs</h3>
              <p className="text-gray-600">
                Browse gigs in your area using our map-based feed. Apply to jobs that match your skills.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn & Learn</h3>
              <p className="text-gray-600">
                Complete gigs, earn money, and gain valuable work experience and skills.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-blue-50 py-16 rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Making a Difference</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600">5000+</div>
                <div className="text-gray-600">Youth Connected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">10,000+</div>
                <div className="text-gray-600">Gigs Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">R2M+</div>
                <div className="text-gray-600">Earned by Youth</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 mt-16 border-t">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 GIG-SA. Empowering South African Youth.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}