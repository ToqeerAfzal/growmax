import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TwoFactorAuthByApps from "./Settings/TwoFactorAuthByApps";
import NavBar from "../components/NavBar";

const Security = () => {

  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      });
    }
    return stars;
  };

  const stars = generateStars();

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: "2s",
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl z-[-1]"></div>
      <NavBar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">Security Center</h1>
          <p className="text-muted-foreground">
            Monitor system security and threats
          </p>
        </div>
        <Card className="card-glow w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-center">
              2 Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TwoFactorAuthByApps />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
