import { motion } from "framer-motion";
import { Recycle, Globe, Shield } from "lucide-react";


interface FooterColumnProps {
  title: string;
  links: string[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div>
    <h4 className="text-white font-bold text-lg mb-6">{title}</h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-gray-400 hover:text-emerald-400 transition-colors"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);


const Footer = () => {
  const socialLinks = ["twitter", "linkedin", "github", "facebook"];

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-12 border-t border-gray-700"
        >
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Recycle className="h-10 w-10 text-emerald-400" />
                <span className="text-2xl font-bold text-white">
                  WasteControl
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed">
                Leading the way in smart, sustainable waste management solutions
                for businesses worldwide.
              </p>

              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social}
                    href="#"
                    aria-label={social}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    {social.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <FooterColumn
              title="Product"
              links={["Features", "Pricing", "API", "Documentation", "Status"]}
            />

            {/* Company */}
            <FooterColumn
              title="Company"
              links={["About", "Careers", "Blog", "Press", "Partners"]}
            />

            {/* Legal */}
            <FooterColumn
              title="Legal"
              links={[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "GDPR",
                "Contact",
              ]}
            />
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} WasteControl. All rights reserved.
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Global</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>SOC 2 Type II Certified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
