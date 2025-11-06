import { Link } from "react-router-dom";

const Footer = () => {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  return (
    <>
      <footer className="py-5 px-6 border-t border-white/10 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span>© {year} GrowmaxGlobal. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link
                to="/#home"
                onClick={() => window.location.href()}
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Home
              </Link>
              <Link
                to="/#packages"
                onClick={() => window.location.href()}
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Staking Packages
              </Link>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Link
                to="/#"
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Twitter
              </Link>
              |
              <Link
                to="/#"
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Telegram
              </Link>
              |
              <Link
                to="/#"
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Instagram
              </Link>
              |
              <Link
                to="/#"
                className="text-gray-300 hover:text-[#F9DB9A] transition-colors"
              >
                Facebook
              </Link>
              |
              <a href="mailto:info@growmaxglobal.io" className="text-gray-300 hover:text-[#F9DB9A] transition-colors">info@growmaxglobal.io </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
