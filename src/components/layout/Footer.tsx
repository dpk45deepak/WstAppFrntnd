import { motion } from "framer-motion";
import {
  Recycle,
  Globe,
  Shield,
  Leaf,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
  Heart,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

interface FooterColumnProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
    new?: boolean;
    featured?: boolean;
  }>;
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div>
    <h4 className="text-white font-bold text-xl mb-8 relative inline-block">
      {title}
      <motion.div
        className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
    </h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <motion.li
          key={link.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <a
            href={link.href}
            className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
          >
            <span
              className={`${link.featured ? "font-bold text-teal-300" : ""}`}
            >
              {link.label}
            </span>
            {link.new && (
              <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-indigo-500 text-xs rounded-full">
                New
              </span>
            )}
            <ArrowUpRight className="ml-2 w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:bg-blue-500" },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "#",
      color: "hover:bg-blue-700",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "#",
      color: "hover:bg-blue-600",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "#",
      color: "hover:bg-pink-600",
    },
    { icon: Youtube, label: "YouTube", href: "#", color: "hover:bg-red-600" },
  ];

  const certifications = [
    { label: "ISO 14001", icon: CheckCircle },
    { label: "Carbon Neutral", icon: Leaf },
    { label: "Green Business", icon: Award },
    { label: "SOC 2 Type II", icon: Shield },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "500K+", label: "Tonnes Diverted" },
    { value: "24/7", label: "Support" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-b border-gray-800"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-300 mt-2 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16"
        >
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <Recycle className="h-16 w-16 text-teal-400" />
                  <div className="absolute inset-0 animate-ping bg-teal-500/20 rounded-full"></div>
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      EcoTrack
                    </span>
                    <Sparkles className="w-5 h-5 text-teal-400" />
                  </div>
                  <p className="text-gray-400 mt-1">
                    Sustainable Waste Management
                  </p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed text-lg">
                Leading the transformation towards a circular economy with
                innovative waste management solutions that are smart,
                sustainable, and scalable.
              </p>

              {/* Newsletter Subscription */}
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg">
                  Stay Updated with Eco News
                </h3>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      subscribed
                        ? "bg-gradient-to-r from-green-500 to-teal-500"
                        : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500"
                    } text-white`}
                  >
                    {subscribed ? "Subscribed!" : "Subscribe"}
                  </motion.button>
                </form>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-teal-400 text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Welcome to our eco-community!
                  </motion.p>
                )}
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.label}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <cert.icon className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-gray-300">{cert.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <FooterColumn
              title="Solutions"
              links={[
                { label: "Smart Waste Collection", href: "#", featured: true },
                { label: "Recycling Analytics", href: "#" },
                { label: "Circular Economy", href: "#" },
                { label: "Waste Tracking", href: "#", new: true },
                { label: "Compost Solutions", href: "#" },
                { label: "E-Waste Management", href: "#" },
              ]}
            />

            {/* Company */}
            <FooterColumn
              title="Company"
              links={[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#", new: true },
                { label: "Eco Blog", href: "#", featured: true },
                { label: "Case Studies", href: "#" },
                { label: "Partnerships", href: "#" },
                { label: "Press Kit", href: "#" },
              ]}
            />

            {/* Resources */}
            <FooterColumn
              title="Resources"
              links={[
                { label: "Documentation", href: "#" },
                { label: "API Reference", href: "#" },
                { label: "Help Center", href: "#" },
                { label: "Community", href: "#" },
                { label: "Status", href: "#" },
                { label: "Contact Sales", href: "#" },
              ]}
            />
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-800"
          >
            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Us</p>
                <p className="text-white font-medium">support@ecotrack.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call Us</p>
                <p className="text-white font-medium">1-800-ECO-TRACK</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Visit Us</p>
                <p className="text-white font-medium">San Francisco, CA</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-800"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-left">
              <div className="flex items-center gap-2">
                © {new Date().getFullYear()} EcoTrack. All rights reserved.
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              </div>
              <p className="mt-2 text-gray-500">
                Committed to a cleaner, greener planet.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -4 }}
                  className={`w-12 h-12 rounded-xl bg-gray-800 ${social.color} flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 border border-gray-700 hover:border-transparent`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Operating in 50+ countries</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Carbon Negative Since 2022</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
            <a href="#" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              GDPR Compliance
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>

      {/* Back to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-all duration-300"
        aria-label="Back to top"
      >
        <ArrowUpRight className="w-6 h-6 rotate-45" />
      </motion.button>
    </footer>
  );
};

export default Footer;
