import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  CheckSquare,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";

const FEATURES = [
  {
    icon: <FolderOpen className="w-8 h-8 text-yellow-400" />,
    title: "Project Organization",
    desc: "Create and organize projects with clear goals and timelines",
  },
  {
    icon: <CheckSquare className="w-8 h-8 text-yellow-400" />,
    title: "Task Management",
    desc: "Break down projects into manageable tasks with priorities and deadlines",
  },
  {
    icon: <Users className="w-8 h-8 text-yellow-400" />,
    title: "Team Collaboration",
    desc: "Assign tasks, track progress, and collaborate with your team",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
    title: "Real-time Analytics",
    desc: "Track progress with detailed analytics and reporting",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/home");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#161616] text-yellow-50 flex flex-col items-center">
      {/* Navbar or header if you have one */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-[#101010]">
        <span className="text-xl font-bold text-yellow-400 tracking-wide">
          JEERA
        </span>
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            className="text-yellow-200 font-semibold hover:bg-yellow-900/40"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
          <Button
            className="bg-yellow-500 text-[#161616] font-semibold hover:bg-yellow-400 rounded-xl px-4"
            onClick={() => navigate("/register")}
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center mt-16 mb-10 px-4">
        <Badge className="bg-yellow-700/30 border border-yellow-600 text-yellow-300 font-semibold mb-6">
          ✦ Streamline your workflow
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 mb-4 tracking-tight text-center drop-shadow-md">
          Jeera
        </h1>
        <p className="text-lg md:text-xl text-yellow-100 max-w-2xl mb-8 text-center font-medium">
          The ultimate project management platform for teams.
          <br />
          Organize tasks, collaborate seamlessly, and deliver results faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            size="lg"
            className="bg-yellow-500 font-bold text-[#161616] text-lg py-3 px-8 rounded-lg shadow hover:bg-yellow-400 transition"
            onClick={() => navigate("/register")}
          >
            <Zap className="w-5 h-5 mr-2" /> Join now
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="font-bold text-yellow-300 border border-yellow-600 hover:bg-yellow-800 hover:text-yellow-100 text-lg py-3 px-8 rounded-lg transition"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>
      </section>

      {/* Features headline */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-200 mb-4 text-center">
          Everything you need to manage projects
        </h2>
        <p className="text-md text-yellow-100 text-center mb-8 opacity-90">
          Powerful features designed to make project management effortless
        </p>
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="bg-[#212121] rounded-xl shadow-xl p-3 flex flex-col items-center group hover:scale-[1.03] transition-all duration-200"
            >
              <CardContent className="flex flex-col items-center p-0">
                {f.icon}
                <span className="my-3 block text-yellow-500 font-bold text-lg text-center">
                  {f.title}
                </span>
                <span className="text-yellow-100/90 text-center text-sm">
                  {f.desc}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer banner */}
      <footer className="w-full flex flex-col items-center mt-16 mb-4">
        <div className="text-center text-yellow-600 text-xs mt-2">
          &copy; {new Date().getFullYear()} Jeera — Effortless project management for everyone.
        </div>
      </footer>
    </div>
  );
};

export default Index;
