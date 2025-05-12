import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, User, Mail, Phone, Check, X, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // Default to 'all' status
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/user/getApplicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err.message);
    }
  };

  const handleDecision = (id, decision) => {
    setSelectedAppId(id);
    setSelectedDecision(decision);
    setConfirmOpen(true);
  };

  const confirmDecision = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:4000/user/${selectedDecision}/${selectedAppId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to update application status");
      }

      fetchApplications(); // Refresh list
      setConfirmOpen(false);
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Error updating application status.");
      setConfirmOpen(false);
    }
  };

  // Filter applications based on the selected status
  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Applicant Submissions
          </h1>
          <p className="text-md md:text-lg text-gray-600 mb-8">
            Review and manage all job applications submitted by candidates
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 text-sm md:text-base text-gray-700 font-medium">
          <Button
            variant={statusFilter === "all" ? "primary" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All ({applications.length})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "primary" : "outline"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending ({applications.filter((a) => a.status === "pending").length}
            )
          </Button>
          <Button
            variant={statusFilter === "accepted" ? "primary" : "outline"}
            onClick={() => setStatusFilter("accepted")}
          >
            Accepted (
            {applications.filter((a) => a.status === "accepted").length})
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "primary" : "outline"}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected (
            {applications.filter((a) => a.status === "rejected").length})
          </Button>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications available
            </h3>
            <p className="text-gray-500">
              When candidates apply, their submissions will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app) => (
              <Card key={app._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{app.company}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {app.status === "accepted" ? (
                      <Badge variant="success">Accepted</Badge>
                    ) : app.status === "rejected" ? (
                      <Badge variant="destructive">Rejected</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{app.userId?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{app.userId?.email || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{app.PhoneNo || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        View Resume
                      </a>
                    </Button>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => handleDecision(app._id, "accepted")}
                      className="flex-1 gap-2"
                      variant={
                        app.status === "accepted" ? "default" : "success"
                      }
                      disabled={app.status === "accepted"}
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDecision(app._id, "rejected")}
                      className="flex-1 gap-2"
                      variant={
                        app.status === "rejected" ? "default" : "destructive"
                      }
                      disabled={app.status === "rejected"}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">
              Confirm{" "}
              {selectedDecision === "accepted" ? "Acceptance" : "Rejection"}
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to <strong>{selectedDecision}</strong> this
            application?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDecision}
              variant={
                selectedDecision === "accepted" ? "success" : "destructive"
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
