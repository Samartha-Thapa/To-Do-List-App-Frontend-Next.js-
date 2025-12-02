"use client"

import React, { useEffect, useState } from "react"
import type { User } from "@/lib/user";
import Cookies from "js-cookie";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user");

        const data: User = await response.json();
        setUser(data);

        // Pre-fill form fields with user data
        setUserName(data.name || "");
        setEmail(data.email || "");
        setPassword("**********");
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!user?.id) return;

    try {
      setSaving(true);
      setError("");

      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          email: email,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  }

  if(loading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {/* Profile Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2 bg-gray-50"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full border rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            aria-disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email is read-only from your auth provider.</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password (hashed)</label>
          <input
            type="text"
            value={password}
            disabled
            className="mt-1 w-full border rounded-lg p-2 bg-gray-100 text-xs font-mono cursor-not-allowed"
            aria-disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            We show the password hash for reference — this is <em>not</em> reversible.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-200 cursor-pointer"
            disabled={saving || loading}
          >
            Disconnect Account
          </button>
        </div>
    </form>
      </section>

      {/* Notifications */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          <span>Email Reminders</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Push Notifications</span>
        </div>
        <p className="text-xs text-gray-500">Example: &quot;Send me an email 1 day before a task is due&quot;.</p>
      </section>
    </div>
  );
}
