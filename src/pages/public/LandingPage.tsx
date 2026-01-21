import React from 'react';
import {
    ArrowRight,
    Check,
    Shield,
    Leaf,
    Zap,
    BarChart3,
    Calendar,
    Clock,
    Truck,
    // Recycle,
    Sparkles,
    TrendingUp,
    Users,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

// import the landing page components
import HeroSection from '../../components/Landing_Page/HeroSection';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PricingPlans from './PricingPlans';


const WasteLandingPage: React.FC = () => {
    const features = [
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Real-time Analytics",
            description: "Track waste metrics and optimize recycling rates",
            linear: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Smart Scheduling",
            description: "Automated pickup scheduling based on capacity",
            linear: "from-emerald-500 to-teal-500"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Compliance Tracking",
            description: "Stay compliant with environmental regulations",
            linear: "from-violet-500 to-purple-500"
        },
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "Carbon Footprint",
            description: "Monitor and reduce your environmental impact",
            linear: "from-green-500 to-emerald-500"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Operations Manager, EcoTech Inc.",
            content: "Reduced our waste management costs by 40% while improving recycling rates. The analytics dashboard is phenomenal!",
            avatar: "SJ",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Sustainability Director, GreenCorp",
            content: "The dashboard provides incredible insights into our waste streams. Implementation was seamless.",
            avatar: "MC",
            rating: 5
        },
        {
            name: "Elena Rodriguez",
            role: "Facility Manager, UrbanMall Group",
            content: "Scheduling pickups has never been easier. Reduced our carbon footprint by 35% in just 3 months!",
            avatar: "ER",
            rating: 5
        }
    ];

    const stats = [
        { value: "5,000+", label: "Businesses Trust Us", icon: <Users className="w-5 h-5" /> },
        { value: "85%", label: "Recycling Rate Increase", icon: <TrendingUp className="w-5 h-5" /> },
        { value: "40%", label: "Avg. Cost Reduction", icon: <Sparkles className="w-5 h-5" /> },
        { value: "24/7", label: "Support Available", icon: <Shield className="w-5 h-5" /> }
    ];

    return (
      <div className="min-h-screen bg-linear-to-br from-white via-blue-50/30 to-white font-sans text-gray-800 overflow-hidden">
        <Navbar />
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <HeroSection />

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-blue-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-emerald-600">{stat.icon}</div>
                    </div>
                    <div className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 mt-3 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 relative bg-linear-to-b from-white to-gray-50/30"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-linear-stops))] from-emerald-100/20 via-transparent to-transparent -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 border-emerald-500/30 text-emerald-600 bg-emerald-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />✨ Powerful Features
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need for{" "}
                <span className="bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Sustainable Waste Management
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                From automated scheduling to detailed analytics, we provide
                comprehensive tools to optimize your waste management process.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
                  <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-emerald-500/30 transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-blue-500"></div>
                    <CardContent className="p-8">
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${feature.linear} mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-0.5 bg-linear-to-r from-emerald-500 to-blue-500"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bento Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 grid lg:grid-cols-3 gap-8"
            >
              <Card className="lg:col-span-2 bg-linear-to-br from-emerald-600 to-blue-700 text-white border-none shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 group-hover:scale-125 transition-transform duration-700"></div>
                <CardContent className="p-10 relative">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Zap className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        Real-time Monitoring
                      </h3>
                      <p className="text-white/90 text-lg">
                        IoT-enabled smart sensors for instant insights
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Track waste levels across all locations in real-time with
                    our advanced IoT sensors. Get instant alerts and predictive
                    analytics to optimize your waste management process.
                  </p>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-xl overflow-hidden group">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-linear-to-br from-blue-100 to-cyan-100 rounded-2xl">
                      <Truck className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Smart Routing
                      </h3>
                      <p className="text-gray-600">
                        Optimized pickup schedules
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8 grow">
                    AI-powered routing algorithms save fuel and reduce carbon
                    emissions by up to 30% while ensuring efficient collection
                    schedules.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        Average time saved: 2.5 hours/day
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-600">
                      <Leaf className="w-5 h-5" />
                      <span className="font-semibold">
                        Carbon reduction: 12 tons/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 border-emerald-500/30 text-emerald-600 bg-emerald-50"
              >
                <Users className="w-4 h-4 mr-2" />
                💬 Customer Stories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trusted by{" "}
                <span className="bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Industry Leaders
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                See how businesses are transforming their waste management with
                our platform
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
                  <Card className="h-full bg-white border border-gray-200 hover:border-emerald-500/30 transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                            {testimonial.avatar}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-emerald-600 font-medium">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 italic text-lg leading-relaxed mb-8">
                        "{testimonial.content}"
                      </p>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 text-amber-500 fill-current"
                          >
                            <svg viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </div>
                        ))}
                      </div>

                      {/* Results Badge */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-50 to-blue-50 text-emerald-700 text-sm font-semibold">
                          <TrendingUp className="w-4 h-4" />
                          Proven Results
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-20"
            >
              <PricingPlans />
            </motion.div>
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-20 bg-white rounded-3xl shadow-xl border border-gray-200 p-8 lg:p-12"
            >
              <div className="text-center mb-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Join Thousands of Satisfied Customers
                </h3>
                <p className="text-gray-600 text-lg">
                  Rated 4.9/5 stars across all review platforms
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "G2", rating: "4.9", reviews: "850+ reviews" },
                  { name: "Capterra", rating: "4.8", reviews: "620+ reviews" },
                  {
                    name: "Trustpilot",
                    rating: "4.9",
                    reviews: "430+ reviews",
                  },
                  { name: "Google", rating: "4.7", reviews: "1.2k+ reviews" },
                ].map((platform, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {platform.rating}
                    </div>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 text-amber-500 fill-current"
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <div className="font-bold text-gray-900">
                      {platform.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {platform.reviews}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <footer className="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Animated Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
                Transform Your Waste Management{" "}
                <span className="bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Today
                </span>
              </h2>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                Join thousands of forward-thinking businesses that are making a
                positive environmental impact while significantly reducing costs
                and improving efficiency.
              </p>
            </motion.div>

            {/* Main CTA Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="bg-white border-none shadow-2xl overflow-hidden">
                <CardContent className="p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                          Ready to Get Started?
                        </h3>
                        <p className="text-gray-600">
                          Begin your journey towards sustainable waste
                          management with our risk-free trial.
                        </p>
                      </div>

                      <div className="space-y-5">
                        {[
                          {
                            text: "14-day free trial",
                            highlight: "No credit card required",
                          },
                          {
                            text: "Full platform access",
                            highlight: "All features included",
                          },
                          {
                            text: "Expert onboarding",
                            highlight: "Dedicated support",
                          },
                          {
                            text: "Cancel anytime",
                            highlight: "No lock-in contracts",
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 group"
                          >
                            <div className="shrink-0 mt-1">
                              <div className="w-8 h-8 rounded-full bg-linear-to-r from-emerald-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {item.text}
                              </div>
                              <div className="text-emerald-600 text-sm font-medium">
                                {item.highlight}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Button
                        size="lg"
                        className="w-full bg-linear-to-r from-emerald-500 to-blue-600 hover:from-blue-600 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <span className="font-bold text-lg">
                          Start Free Trial
                        </span>
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/10 group"
                      >
                        <Calendar className="mr-3 w-5 h-5 text-gray-600 group-hover:text-emerald-500" />
                        <span className="font-semibold">
                          Schedule a Personalized Demo
                        </span>
                      </Button>

                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <Shield className="w-4 h-4" />
                          <span>Enterprise-grade security</span>
                          <Globe className="w-4 h-4" />
                          <span>GDPR compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <Footer />
        </footer>
      </div>
    );
};

export default WasteLandingPage;