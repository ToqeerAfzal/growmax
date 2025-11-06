import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/lovable-uploads/84bd8140-f22f-46e1-911c-ce0fd5222680.png"
              alt="GrowmaxGlobal"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold gradient-gold-text">
              GrowmaxGlobal
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/#home"
              onClick={() => window.location.href()}
              className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#about"
              onClick={() => window.location.href()}
              className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
              About
            </Link>
            <Link
              to="/#packages"
              onClick={() => window.location.href()}
              className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
            >
              Staking Packages 
            </Link>

            {/* Competitions with Submenu */}
            {/* <div className="relative group">
              <Link
                to="#"
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Competitions
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 overflow-hidden">
                <Link
                  to="/competitions/leaderboard"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#F9DB9A] hover:text-black transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  to="/competitions/live-contest"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#F9DB9A] hover:text-black transition-colors"
                >
                  Live contest
                </Link>
              </div>
            </div> */}
            <Link
              to="/faq"
              className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <button className="btn-outline px-6 py-2">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn-gold px-6 py-2">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
