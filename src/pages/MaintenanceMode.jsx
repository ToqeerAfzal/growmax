import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const MaintenanceMode = () => {
 const reloadNow = () => {
    window.location.reload();
  }
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

        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <Card className="feature-card">
            <CardContent className="p-6">
              <p className="mb-12 text-center" style={{ fontSize: 24 }}>
                Maintenance Mode
              </p>
              <p className="mb-12 text-center" style={{ fontSize: 16 }}>
                Platform upgrade in progress — service will resume shortly.
              </p>
              <Button
                onClick={reloadNow}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold shadow-lg hover:shadow-orange-400/25 transition-all duration-200"
              >
                <Lock className="h-4 w-4 mr-2" />
                Reload Now
              </Button>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default MaintenanceMode;
