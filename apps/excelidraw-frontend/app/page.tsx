"use client";

import {
  Pencil,
  Share2,
  Users2,
  Sparkles,
  Github,
  Download,
} from "lucide-react";
import Link from "next/link";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Collaborative Whiteboarding
            <span className="block text-indigo-600 mt-1">Made Simple</span>
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-600">
            Create, collaborate, and share beautiful diagrams and sketches with
            our intuitive drawing tool. No sign-up required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signin">
              <button className="inline-flex items-center justify-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg shadow">
                Sign In <Pencil className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="/signup">
              <button className="inline-flex items-center justify-center px-6 py-3 text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg shadow">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Real-time Collaboration",
                description:
                  "Work together with your team in real-time. Share your drawings instantly with a simple link.",
                icon: <Share2 className="h-6 w-6 text-indigo-600" />,
              },
              {
                title: "Multiplayer Editing",
                description:
                  "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time.",
                icon: <Users2 className="h-6 w-6 text-indigo-600" />,
              },
              {
                title: "Smart Drawing",
                description:
                  "Intelligent shape recognition and drawing assistance helps you create perfect diagrams.",
                icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 text-white rounded-t-3xl">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">Ready to start creating?</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto text-indigo-100">
            Join thousands of users already crafting amazing diagrams and
            sketches with ease.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100">
              Open Canvas <Pencil className="ml-2 h-5 w-5 inline" />
            </button>
            <button className="px-6 py-3 border border-white text-white hover:bg-white hover:text-indigo-600 font-semibold rounded-lg">
              View Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-white">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2024 Excalidraw Clone. All rights reserved.
          </p>
          <div className="flex gap-5 mt-4 sm:mt-0">
            <a
              href="https://github.com"
              className="text-gray-500 hover:text-indigo-600 transition"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-indigo-600 transition"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
