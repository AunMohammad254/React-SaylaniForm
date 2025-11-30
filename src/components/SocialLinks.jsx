import { memo, useMemo } from 'react';
import { Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Social links configuration
 */
const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/saylanimassitraining',
    icon: Facebook,
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    label: 'Follow SMIT on Facebook',
  },
  {
    name: 'Instagram', 
    url: 'https://www.instagram.com/saylanimassitraining',
    icon: Instagram,
    bgColor: 'bg-pink-600 hover:bg-pink-700',
    label: 'Follow SMIT on Instagram',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/c/SaylaniMassITTraining',
    icon: Youtube,
    bgColor: 'bg-red-600 hover:bg-red-700',
    label: 'Subscribe to SMIT YouTube channel',
  },
];

/**
 * Animation variants
 */
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.2, duration: 0.5 }
  },
};

const iconVariants = {
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { type: 'spring', stiffness: 400 }
  },
  tap: { scale: 0.9 },
};

/**
 * Social Icon Link Component
 */
const SocialIconLink = memo(function SocialIconLink({ social }) {
  const IconComponent = social.icon;
  
  return (
    <motion.a 
      variants={iconVariants}
      whileHover="hover"
      whileTap="tap"
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        touch-target
        w-10 h-10 sm:w-12 sm:h-12
        ${social.bgColor}
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
        aria-hidden="true"
      />
    </motion.a>
  );
});

/**
 * SocialLinks Component
 * Displays social media links and website button
 */
function SocialLinks() {
  // Memoize social links to prevent recreation
  const socialLinks = useMemo(() => SOCIAL_LINKS, []);

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="responsive-container max-w-6xl mx-auto py-3 sm:py-4 md:py-6"
      aria-label="Social media links"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Social Media Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm sm:text-base font-medium text-gray-700 hidden sm:block">
            Follow us:
          </span>
          <div className="flex gap-2 sm:gap-3" role="list" aria-label="Social media">
            {socialLinks.map((social) => (
              <SocialIconLink key={social.name} social={social} />
            ))}
          </div>
        </div>

        {/* Additional Info & Website Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Stay connected for updates
          </span>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.saylaniwelfare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:flex items-center gap-2 
              px-3 py-2 
              text-sm text-green-600 
              border border-green-200 
              rounded-lg 
              hover:bg-green-50 
              transition-all duration-200
              touch-target
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            "
          >
            <ExternalLink size={16} aria-hidden="true" />
            <span>Website</span>
          </motion.a>
        </div>
      </div>

      {/* Mobile-only additional info */}
      <p className="sm:hidden mt-4 text-center text-xs text-gray-500">
        Connect with Saylani Mass IT Training for latest updates and opportunities
      </p>
    </motion.section>
  );
}

export default memo(SocialLinks);