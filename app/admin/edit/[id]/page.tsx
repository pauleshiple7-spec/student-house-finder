"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function AdminEditPropertyPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    async function loadProperty() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Check that the logged-in user is an admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      // Load the property
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Property could not be found.");
        router.replace("/admin");
        return;
      }

      setTitle(data.title || "");
      setLocation(data.location || "");
      setPrice(String(data.price || ""));
      setPropertyType(data.property_type || "");
      setBedrooms(String(data.bedrooms || 1));
      setDescription(data.description || "");
      setStatus(data.status || "pending");

      setLoading(false);
    }

    if (id) {
      loadProperty();
    }
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("properties")
      .update({
        title,
        location,
        price: Number(price),
        property_type: propertyType,
        bedrooms: Number(bedrooms),
        description,
        status,
      })
      .eq("id", id);

    if (error) {
      alert("Could not update property: " + error.message);
      setSaving(false);
      return;
    }

    alert("Property updated successfully!");

    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Loading property...</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1>Edit Property</h1>

      <p style={{ marginBottom: "30px" }}>
        Update this property from the admin panel.
      </p>

      <form onSubmit={handleSave}>
        <label>Property Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Location</label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Price per year</label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Property Type</label>

        <input
          type="text"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Bedrooms</label>

        <input
          type="number"
          min="1"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          style={inputStyle}
        />

        <label>Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#333",
              color: "white",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            style={{
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
};