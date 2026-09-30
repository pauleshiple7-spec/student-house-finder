"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    async function loadProperty() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMessage("Property not found.");
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setLocation(data.location || "");
      setPrice(String(data.price || ""));
      setPropertyType(data.property_type || "");
      setBedrooms(String(data.bedrooms || 1));
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setWhatsapp(data.whatsapp || "");

      setLoading(false);
    }

    loadProperty();
  }, [id,router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("properties")
      .update({
        title,
        location,
        price: Number(price),
        property_type: propertyType,
        bedrooms: Number(bedrooms),
        description,
        phone,
        whatsapp,
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Property updated successfully!");
    setSaving(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        <p>Loading property...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1>Edit Property</h1>

      <p style={{ marginBottom: "30px" }}>
        Update the information for your property.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Property title</label>
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

        <label>Property type</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">Select property type</option>
          <option value="Room">Room</option>
          <option value="Self Contain">Self Contain</option>
          <option value="1 Bedroom">1 Bedroom</option>
          <option value="2 Bedroom">2 Bedroom</option>
          <option value="3 Bedroom">3 Bedroom</option>
          <option value="Flat">Flat</option>
          <option value="Duplex">Duplex</option>
        </select>

        <label>Number of bedrooms</label>
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

        <label>Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <label>WhatsApp number</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p style={{ marginTop: "20px" }}>
            {message}
          </p>
        )}
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
  boxSizing: "border-box" as const,
};