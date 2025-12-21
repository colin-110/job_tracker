import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { token, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  const fetchApplications = async () => {
    const response = await fetch("https://job-tracker-m2pb.onrender.com//applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setApplications(data);
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();

    await fetch("https://job-tracker-m2pb.onrender.com//applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company,
        role,
        applied_date: appliedDate,
      }),
    });

    setCompany("");
    setRole("");
    setAppliedDate("");
    fetchApplications();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Add Application */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Add Application
          </h2>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              className="border p-2 rounded"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              className="border p-2 rounded"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <input
              type="date"
              className="border p-2 rounded"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              required
            />

            <button className="bg-blue-600 text-white rounded hover:bg-blue-700">
              Add
            </button>
          </form>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{app.company}</h3>
                <p className="text-gray-600">{app.role}</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="border rounded p-1"
                  value={app.status}
                  onChange={async (e) => {
                    await fetch(
                      `https://job-tracker-m2pb.onrender.com//applications/${app.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: e.target.value }),
                      }
                    );
                    fetchApplications();
                  }}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>

                <button
                  onClick={async () => {
                    await fetch(
                      `https://job-tracker-m2pb.onrender.com//applications/${app.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    fetchApplications();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
