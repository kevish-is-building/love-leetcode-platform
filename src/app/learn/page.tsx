"use client";

import { useState, useEffect } from "react";
import { Sparkles, Rocket, Target, TrendingUp, BookOpen, Code2, Brain, Zap, Lock } from "lucide-react";

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Target,
      title: "Beginner to Pro",
      description: "Structured paths from zero to hero",
      details: "Start from basics, master advanced concepts",
      color: "from-green-400 to-emerald-600",
      stat: "3 Paths"
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "AI-powered personalized curriculum",
      details: "Adaptive content that learns with you",
      color: "from-purple-400 to-pink-600",
      stat: "AI-Driven"
    },
    {
      icon: TrendingUp,
      title: "Progressive Levels",
      description: "Beginner, Intermediate, Advanced",
      details: "Level up systematically with clear milestones",
      color: "from-blue-400 to-cyan-600",
      stat: "100+ Topics"
    },
    {
      icon: Code2,
      title: "Real DSA Mastery",
      description: "Master algorithms like never before",
      details: "Theory + Practice + Real-world applications",
      color: "from-orange-400 to-red-600",
      stat: "500+ Problems"
    }
  ];

  const pathways = [
    { name: "Beginner", level: "Start your journey", emoji: "🌱", locked: true },
    { name: "Intermediate", level: "Level up your skills", emoji: "🚀", locked: true },
    { name: "Advanced", level: "Master the craft", emoji: "⚡", locked: true }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/40 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
            <span className="text-sm font-medium text-purple-200">Coming Soon</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient-x">
            The Future of DSA Learning
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get ready for a <span className="text-transparent bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text font-bold">revolutionary</span> learning experience that will transform the way you master Data Structures & Algorithms
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>In Active Development</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span>Launching Soon</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-3">
            What Makes This <span className="text-transparent bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text">Insanely Powerful</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            A complete learning ecosystem designed to accelerate your DSA mastery
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`animate-fade-in-up delay-${index + 1}00`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-full p-6 hover:scale-105 transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Stat badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white">{feature.stat}</span>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon with animated ring */}
                    <div className="relative mb-4">
                      <div className={`absolute inset-0 bg-linear-to-br ${feature.color} rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className={`relative w-14 h-14 rounded-lg bg-linear-to-br ${feature.color} p-3 group-hover:scale-110  transition-all duration-500`}>
                        <feature.icon className="w-full h-full text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2 font-medium">{feature.description}</p>
                    <p className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors duration-300">
                      {feature.details}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-2 h-2 rounded-full bg-linear-to-r ${feature.color}`} />
                      <span className="text-xs text-gray-400">Coming soon</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Pathways */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Structured Learning Pathways
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose your path and progress at your own pace with carefully curated content for every skill level
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pathways.map((pathway, index) => (
              <div
                key={index}
                className="p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300 rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl"
              >
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{pathway.emoji}</div>
                  <h3 className="text-2xl font-bold text-white">{pathway.name}</h3>
                  <p className="text-gray-400">{pathway.level}</p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-medium">Unlocking Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Coming Section */}
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white">What's Coming?</h2>
              
              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Interactive Learning Modules</h4>
                    <p className="text-gray-400 text-sm">Step-by-step guided tutorials with real-time code execution</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-600 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Personalized Learning Paths</h4>
                    <p className="text-gray-400 text-sm">AI-driven curriculum that adapts to your learning style and pace</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Progress Tracking & Analytics</h4>
                    <p className="text-gray-400 text-sm">Detailed insights into your learning journey and skill development</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-red-600 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Practice Problems & Challenges</h4>
                    <p className="text-gray-400 text-sm">Curated problems aligned with each learning module</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <p className="text-gray-300 text-lg font-medium">
                  Be the first to know when we launch! 🎉
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Something extraordinary is being built. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-400">
            In the meantime, check out our{" "}
            <a href="/problems" className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">
              problem sets
            </a>
            {" "}and{" "}
            <a href="/playlists" className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">
              curated playlists
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
}
