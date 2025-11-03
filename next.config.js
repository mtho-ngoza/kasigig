/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+, no experimental flag needed

  // Generate a unique build ID for each deployment to prevent caching issues
  generateBuildId: async () => {
    // Use timestamp + random string for unique build ID
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`
  },

  // Disable static optimization for dynamic pages
  // This ensures pages are always regenerated on deployment
  experimental: {
    // Use modern fetch cache behavior
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
}

module.exports = nextConfig