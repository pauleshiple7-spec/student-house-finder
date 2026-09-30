"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProperties(data);
      }

      setLoading(false);
    }

    loadProperties();
  }, [router, supabase]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Could not delete the property.");
      setDeletingId(null);
      return;
    }

    setProperties((current) =>
      current.filter((property) => property.id !== id)
    );

    setDeletingId(null);
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Welcome to StudentStay</h1>

      <p>
        Manage your properties and track their approval status.
      </p>

      <h2 style={{ marginTop: "40px" }}>My Properties</h2>

      {loading ? (
        <p>Loading your properties...</p>
      ) : properties.length === 0 ? (
        <p>You have not posted any properties yet.</p>
      ) : (
     <div style={{ marginTop: "20px" }}>
  {properties.map((property) => (
    <div
      key={property.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
     {property.image_urls?.length > 0 && (
  <img
    src={property.image_urls[0]}
    alt={property.title}
    style={{
      width: "100%",
      height: "220px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "15px",
    }}
  />
)}
      <h3>{property.title}</h3>

      <p>{property.location}</p>

      <p>₦{property.price.toLocaleString()} / year</p>

      <p>
        {property.property_type} · {property.bedrooms} bedroom
        {property.bedrooms !== 1 ? "s" : ""}
      </p>

      <p>{property.description}</p>

      <strong>Status: {property.status}</strong>

      <div style={{ marginTop: "15px" }}>
        <a
          href={`/dashboard/edit/${property.id}`}
          style={{
            display: "inline-block",
            marginRight: "10px",
            padding: "10px 16px",
            background: "#333",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Edit Property
        </a>

        <button
          onClick={() => handleDelete(property.id)}
          disabled={deletingId === property.id}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor:
              deletingId === property.id ? "not-allowed" : "pointer",
            backgroundColor: "#b91c1c",
            color: "white",
          }}
        >
          {deletingId === property.id
            ? "Deleting..."
            : "Delete Property"}
        </button>
      </div>
    </div>
  ))}
</div>
      )}
</main>
  );
}
      