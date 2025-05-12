import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UploadCloud,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function UploadResumePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    resume: null,
  });

  const [jobDetails, setJobDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Load job details from localStorage on mount
  useEffect(() => {
    const job = localStorage.getItem("selectedJob");
    if (job) {
      const parsedJob = JSON.parse(job);
      setJobDetails(parsedJob);
      setFormData((prev) => ({ ...prev, role: parsedJob.title }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("fullName", formData.name);
    data.append("PhoneNo", formData.phone);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (formData.resume) {
      data.append("resume", formData.resume);
    }

    // Include job meta if available
    if (jobDetails) {
      data.append("jobTitle", jobDetails.title);
      data.append("company", jobDetails.company);
      data.append("location", jobDetails.location);
      data.append("description", jobDetails.description);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://job-application-mern.onrender.com/user/apply_job",
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("selectedJob");
        navigate("/profile");
      } else {
        const result = await response.json();
        alert(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {jobDetails ? "Apply for this position" : "Submit your application"}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Fill out the form below to apply for the position
          </p>
        </div>

        <Card className="overflow-hidden shadow-lg">
          {jobDetails && (
            <CardHeader className="bg-blue-50 border-b border-blue-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Badge variant="secondary">{jobDetails.location}</Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <Badge variant="secondary">{jobDetails.company}</Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {jobDetails.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-gray-700">
                    {jobDetails.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          )}

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  Job Role
                </Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.role}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend Developer">
                      Frontend Developer
                    </SelectItem>
                    <SelectItem value="Backend Developer">
                      Backend Developer
                    </SelectItem>
                    <SelectItem value="Full Stack Engineer">
                      Full Stack Developer
                    </SelectItem>
                    <SelectItem value="UI/UX Designer">
                      UI/UX Designer
                    </SelectItem>
                    <SelectItem value="Software Intern">
                      Software Intern
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Resume Upload
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or DOCX (Max. 5MB)
                      </p>
                    </div>
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                </div>
                {formData.resume && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {formData.resume.name}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full py-4 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Your information is secure and will only be used for this
            application.
          </p>
        </div>
      </div>
    </div>
  );
}
