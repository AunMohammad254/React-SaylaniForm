import { Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialLinks() {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/saylanimassitraining',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      label: 'Follow us on Facebook'
    },
    {
      name: 'Instagram', 
      url: 'https://www.instagram.com/saylanimassitraining',
      icon: Instagram,
      color: 'bg-pink-600 hover:bg-pink-700',
      label: 'Follow us on Instagram'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/c/SaylaniMassITTraining',
      icon: Youtube,
      color: 'bg-red-600 hover:bg-red-700',
      label: 'Subscribe to our YouTube channel'
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="responsive-container max-w-6xl mx-auto py-3 sm:py-4 md:py-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Social Media Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm sm:text-base font-medium text-gray-700 hidden sm:block">
            Follow us:
          </span>
          <div className="flex gap-2 sm:gap-3">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <motion.a 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    touch-target
                    w-10 h-10 sm:w-12 sm:h-12
                    ${social.color}
                    rounded-full 
                    flex items-center justify-center 
                    text-white 
                    transition-colors duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                    shadow-md hover:shadow-lg
                  `}
                  aria-label={social.label}
                >
                  <IconComponent 
                    size={20} 
                    className="sm:w-6 sm:h-6" 
                  />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Additional Info or CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Stay connected for updates
          </span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              hidden md:flex items-center gap-2 
              px-3 py-2 
              text-sm text-green-600 
              border border-green-200 
              rounded-lg 
              hover:bg-green-50 
              transition-all duration-200
              touch-target
            "
          >
            <ExternalLink size={16} />
            Website
          </motion.button>
        </div>
      </div>

      {/* Mobile-only additional info */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-xs text-gray-500">
          Connect with Saylani Mass IT Training for latest updates and opportunities
        </p>
      </div>
    </motion.section>
  );
}