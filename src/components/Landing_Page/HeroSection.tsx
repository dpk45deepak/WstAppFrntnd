import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  PlayCircle,
  TrendingUp,
  Award,
  BarChart3,
  Leaf,
  Zap,
  Shield,
  CloudLightning,
} from "lucide-react";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const HeroSection = () => {
  const features = [
    {
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      text: "Real-time Analytics",
    },
    {
      icon: <Shield className="w-4 h-4 text-emerald-600" />,
      text: "Secure & Compliant",
    },
    {
      icon: <Leaf className="w-4 h-4 text-green-600" />,
      text: "Carbon Tracking",
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-cyan-600" />,
      text: "Predictive Insights",
    },
  ];

  return (
    <header className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden bg-slate-50 py-2">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
        {/* LEFT COLUMN */}
        <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 py-4"
        >
          <Badge className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-100 text-emerald-700 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              AI-Powered Waste Solutions
            </span>
          </Badge>

          <h1 className="text-4xl md:text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] mb-8">
            <span className="block text-slate-900">Smart Waste</span>
            <span className="block py-2 bg-linear-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
              Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10">
            Revolutionize your sustainability goals with{" "}
            <span className="text-emerald-700 font-semibold">
              autonomous tracking
            </span>{" "}
            and AI analytics. Efficiency meets ecology.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 bg-teal-100 border border-slate-200 rounded-2xl px-5 py-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
              >
                <div className="p-2 rounded-lg bg-slate-50">{f.icon}</div>
                <span className="text-slate-700 font-semibold text-sm">
                  {f.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button className="w-full sm:w-auto h-16 px-8 text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 text-lg font-semibold rounded-2xl text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
            >
              <PlayCircle className="mr-2 w-5 h-5 text-emerald-600" />
              See It In Action
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold"
                >
                  UN
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-slate-900 font-bold block">
                Trusted by 5,000+ Leaders
              </span>
              <span className="text-slate-500">
                Global environmental impact partners
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - DASHBOARD VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative perspective-1000 hidden lg:block"
        >
          {/* Floating Decorative Card */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 z-20 bg-teal-700 text-white p-6 rounded-3xl shadow-2xl hidden xl:block"
          >
            <Award className="w-8 h-8 mb-2 text-emerald-400" />
            <p className="font-black text-xl leading-tight">
              #1 Green Tech
              <br />
              Award 2025
            </p>
          </motion.div>

          <div className="relative z-10 p-1 bg-linear-to-br from-emerald-100 to-cyan-100 rounded-[42px] border border-white shadow-2xl">
            <div className="bg-white rounded-[40px] overflow-hidden p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-slate-900 text-xl font-bold tracking-tight">
                    System Monitor
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest font-semibold">
                      Live: Facility_04
                    </span>
                  </div>
                </div>
                <CloudLightning className="text-cyan-500 w-6 h-6" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <span className="text-slate-500 text-xs font-semibold block mb-1">
                    Recycling Rate
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">
                      88.4%
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-600 mb-1" />
                  </div>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <span className="text-slate-500 text-xs font-semibold block mb-1">
                    Cost Saved
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">
                      $12.4k
                    </span>
                    <span className="text-[10px] text-cyan-600 font-bold mb-1">
                      MONTHLY
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                {[
                  {
                    label: "Plastic",
                    val: 85,
                    color: "from-emerald-500 to-emerald-400",
                  },
                  {
                    label: "Glass & Metal",
                    val: 62,
                    color: "from-blue-500 to-blue-400",
                  },
                  {
                    label: "Organic Waste",
                    val: 94,
                    color: "from-lime-500 to-emerald-500",
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-slate-900 font-black">
                        {item.val}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + idx * 0.2 }}
                        className={cn(
                          "h-full rounded-full bg-linear-to-r",
                          item.color
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
                  <Zap className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-900 text-sm font-bold">
                    Optimization Alert
                  </p>
                  <p className="text-slate-600 text-xs">
                    Route 4 pickup efficiency increased by 22%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;
