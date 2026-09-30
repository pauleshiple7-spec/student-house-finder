"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  bedrooms: number;
  description: string;
  image_urls: string[];
  status: string;
};

const supabase = createClient();

export default function AdminPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading properties:", error);
      setProperties([]);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProperties();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProperties]);

  async function updateStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    setActionLoading(id);

    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Could not update property: " + error.message);
      setActionLoading(null);
      return;
    }

    setProperties((current) =>
      current.map((property) =>
        property.id === id
          ? { ...property, status }
          : property
      )
    );

    setActionLoading(null);
  }

  async function deleteProperty(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(id);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Could not delete property: " + error.message);
      setActionLoading(null);
      return;
    }

    setProperties((current) =>
      current.filter((property) => property.id !== id)
    );

    setActionLoading(null);
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1>StudentStay Admin</h1>

      <p style={{ marginTop: "10px" }}>
        Manage property listings and approval status.
      </p>

      <h2 style={{ marginTop: "40px" }}>
        Property Listings
      </h2>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "25px",
                background: "#fff",
              }}
            >
              {property.image_urls?.length > 0 && (
                <img
                  src={property.image_urls[0]}
                  alt={property.title}
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
              )}

              <h3>{property.title}</h3>

              <p>📍 {property.location}</p>

              <p>
                ₦{Number(property.price).toLocaleString()} / year
              </p>

              <p>
                {property.property_type} ·{" "}
                {property.bedrooms} bedroom
                {property.bedrooms !== 1 ? "s" : ""}
              </p>

              <p>{property.description}</p>

              <p>
                <strong>Status: </strong>
                {property.status}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >
                  <Link
                    href={`/admin/edit/${property.id}`}
                    style={{
                      display: "inline-block",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      background: "#333",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Edit
                  </Link>
              

                {property.status !== "approved" && (
                  <button
                    onClick={() =>
                      updateStatus(property.id, "approved")
                    }
                    disabled={actionLoading === property.id}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "8px",
                      background: "green",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {actionLoading === property.id
                      ? "Please wait..."
                      : "Approve"}
                  </button>
                )}

                {property.status !== "rejected" && (
                  <button
                    onClick={() =>
                      updateStatus(property.id, "rejected")
                    }
                    disabled={actionLoading === property.id}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "8px",
                      background: "orange",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {actionLoading === property.id
                      ? "Please wait..."
                      : "Reject"}
                  </button>
                )}

                <button
                  onClick={() => deleteProperty(property.id)}
                  disabled={actionLoading === property.id}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#b91c1c",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {actionLoading === property.id
                    ? "Please wait..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}