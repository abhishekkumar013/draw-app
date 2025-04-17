"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    photo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/user/signin`, {
          email: formData.email,
          password: formData.password,
        });
        console.log(response);

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          router.push("/canvas/123");
        } else {
          alert(response.data.message);
        }
      } else {
        const response = await axios.post(`${HTTP_BACKEND}/user/signup`, {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          photo: formData.photo,
        });

        if (response.success) {
          router.push("/signin");
        } else {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isSignin ? "Welcome Back 👋" : "Create an Account ✨"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          {!isSignin && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  name="photo"
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer"
          >
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
