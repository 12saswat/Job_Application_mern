import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Rocket, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://job-application-mern.onrender.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // ✅ Save user info and token
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.user.email,
            role: data.user.role, // "admin" or "user"
          })
        );
        // ✅ Save token
        localStorage.setItem("token", data.token);
        // Redirect
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left side - Welcome section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                JobConnect
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg text-gray-600">
              Join thousands of professionals who found their perfect career
              match through our platform.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Instant Updates</h3>
                <p className="text-sm text-gray-500">
                  Get notified when employers view your resume
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Easy Application</h3>
                <p className="text-sm text-gray-500">
                  One-click apply to multiple jobs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-500">
                Log in to access your dashboard and continue your job search
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Login to Continue
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create now
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
