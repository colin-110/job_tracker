import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { token, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  const fetchApplications = async () => {
    const response = await fetch("http://127.0.0.1:5000/applications", {
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

    await fetch("http://127.0.0.1:5000/applications", {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Briefcase className="text-blue-600" />
            Job Tracker
          </h1>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>

        {/* Add Application */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">Add Application</h2>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              className="border p-3 rounded-lg"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <input
              type="date"
              className="border p-3 rounded-lg"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              required
            />

            <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Add
            </button>
          </form>
        </motion.div>

        {/* Applications */}
        <div className="grid gap-5">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{app.company}</h3>
                <p className="text-gray-600">{app.role}</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="border rounded-lg p-2"
                  value={app.status}
                  onChange={async (e) => {
                    await fetch(
                      `http://127.0.0.1:5000/applications/${app.id}`,
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
                      `http://127.0.0.1:5000/applications/${app.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    fetchApplications();
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
