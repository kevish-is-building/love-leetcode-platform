"use client";

import Link from 'next/link';
import FuzzyText from '@/components/layout/FuzzyText';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* 404 with Fuzzy Effect */}
        <div className="mb-8 flex items-center justify-center">
          <FuzzyText
            fontSize="clamp(4rem, 12vw, 10rem)"
            fontWeight={900}
            color="#fff"
            baseIntensity={0.3}
            hoverIntensity={0.7}
            glitchMode={true}
            glitchInterval={3000}
            glitchDuration={300}
            // gradient={['#8B5CF6', '#3B82F6', '#06B6D4']}
            className="mb-4"
          >
            404
          </FuzzyText>
        </div>

        {/* Page Not Found Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link
            href="/"
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
