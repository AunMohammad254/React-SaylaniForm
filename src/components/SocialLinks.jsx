import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function SocialLinks() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex gap-3">
        <a 
          href="#" 
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition"
        >
          <Facebook size={20} />
        </a>
        <a 
          href="#" 
          className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="#" 
          className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition"
        >
          <Youtube size={20} />
        </a>
      </div>
    </div>
  );
}