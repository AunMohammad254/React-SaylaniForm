import { User } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white shadow-sm rounded-b-3xl">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
              alt="Saylani" 
              className="h-16" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
            <User size={20} />
            Student portal
          </button>
        </div>
      </div>
    </div>
  );
}