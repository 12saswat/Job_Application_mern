import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Mail, Lock, Check, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Simple password strength calculation
    let strength = 0;
    if (value.length > 0) strength += 1;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || password.length < 8) {
      alert(
        "Please fill in all fields and ensure password is at least 8 characters."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://job-application-mern.onrender.com/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,

            email,

            password,

            role: isAdmin ? "admin" : "user",
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",

        JSON.stringify({ email: data.user.email, role: data.user.role })
      );
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Something went wrong during signup. Please try again.");
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left side - Benefits section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                JobConnect
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Start Your Career Journey
            </h1>
            <p className="text-lg text-gray-600">
              Join our community of professionals and unlock access to thousands
              of job opportunities.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Personalized Job Matches
                </h3>
                <p className="text-sm text-gray-500">
                  Get recommendations based on your skills and preferences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Application Tracking
                </h3>
                <p className="text-sm text-gray-500">
                  Monitor all your applications in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Resume Builder</h3>
                <p className="text-sm text-gray-500">
                  Create a professional resume in minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full md:w-1/2">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Join JobConnect
              </CardTitle>
              <CardDescription className="text-gray-500">
                Create your account in just a few steps
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="w-full pl-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  <div className="grid grid-cols-5 gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full ${
                          passwordStrength >= i
                            ? i <= 2
                              ? "bg-red-400"
                              : i <= 3
                              ? "bg-yellow-400"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {password.length > 0 && (
                      <ul className="space-y-1">
                        <li
                          className={`flex items-center ${
                            password.length >= 8
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          <Check className="w-3 h-3 mr-1" /> At least 8
                          characters
                        </li>
                        <li
                          className={`flex items-center ${
                            /[A-Z]/.test(password)
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          <Check className="w-3 h-3 mr-1" /> At least one
                          uppercase letter
                        </li>
                        <li
                          className={`flex items-center ${
                            /[0-9]/.test(password)
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          <Check className="w-3 h-3 mr-1" /> At least one number
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                {/* ✅ Admin checkbox */}

                <div className="mt-2 ml-3 flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={() => setIsAdmin(!isAdmin)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="isAdmin"
                    className="text-sm ml-3 text-gray-700"
                  >
                    Sign up as Admin
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Create Account
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
