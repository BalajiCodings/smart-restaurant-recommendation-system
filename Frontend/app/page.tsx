import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Star, MapPin, Users, TrendingUp, Search } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-200 to-orange-200 rounded-full opacity-20 transform -translate-x-32 translate-y-32"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-30 transform -translate-y-1/2"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
                Favorite Restaurant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get personalized restaurant recommendations, read authentic reviews, and track your dining experiences with
              <span className="font-semibold text-orange-600"> TastyTrack</span>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/restaurants">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-200"
              >
                <Search className="h-6 w-6 mr-2" />
                Explore Restaurants
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:border-orange-300"
              >
                <Users className="h-6 w-6 mr-2" />
                Join TastyTrack
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Restaurants</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-red-600 mb-2">5000+</div>
              <div className="text-gray-600 font-medium">Reviews</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Happy Users</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-yellow-600 mb-2">4.8★</div>
              <div className="text-gray-600 font-medium">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-100 to-red-100"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> TastyTrack</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing dining experiences with our intelligent recommendation system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Get personalized restaurant suggestions powered by AI, based on your preferences and dining history.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                  Authentic Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Read and write genuine reviews from real diners to make informed dining decisions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Local Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Find hidden gems and popular spots in your area with our comprehensive restaurant database.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Community Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Join a vibrant community of food lovers sharing their experiences and discoveries.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-32 translate-y-32"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your 
            <span className="block text-yellow-300">Food Journey?</span>
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of food enthusiasts discovering amazing restaurants every day with personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              >
                <Users className="h-6 w-6 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/restaurants">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-2xl font-bold transition-all duration-300 hover:scale-105"
              >
                <Search className="h-6 w-6 mr-2" />
                Explore Now
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300 fill-current" />
              <span className="text-lg">4.8/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-lg">500+ Happy Users</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">1000+ Restaurants</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
