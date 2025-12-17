import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { token, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/applications",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create application");
      }

      setCompany("");
      setRole("");
      setAppliedDate("");
      fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <h2>Add Application</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <br />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <br />

        <input
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
          required
        />

        <br />

        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Applications</h2>

      <ul>
        {applications.map((app) => (
            <li key={app.id}>
            <strong>{app.company}</strong> — {app.role}

            <select
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
            >
                Delete
            </button>
            </li>
        ))}
        </ul>

    </div>
  );
}

export default Dashboard;
