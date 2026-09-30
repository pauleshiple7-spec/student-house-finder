"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

export default function PostHouse() {
  const supabase = createClient();

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const form = new FormData(e.currentTarget);

    const title = form.get("title") as string;
    const location = form.get("location") as string;
    const area = form.get("area") as string;
    const price = Number(form.get("price"));
    const propertyType = form.get("propertyType") as string;
    const bedrooms = Number(form.get("bedrooms"));
    const description = form.get("description") as string;
    const whatsapp = form.get("whatsapp") as string;
    const imageFiles = form.getAll("images") as File[];

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be logged in to post a property.");
      setLoading(false);
      return;
    }
    const imageUrls: string[] = [];

for (const file of imageFiles) {
  if (!file || file.size === 0) continue;

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(filePath, file);

  if (uploadError) {
    setErrorMessage(uploadError.message);
    setLoading(false);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(filePath);

  imageUrls.push(publicUrlData.publicUrl);
}

    const { error } = await supabase.from("properties").insert({
      agent_id: user.id,
      title,
      location,
      area,
      price,
      property_type: propertyType,
      bedrooms,
      description,
      image_urls: imageUrls,
      phone: whatsapp,
      whatsapp,
      status: "pending",
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="postPage">
      <nav className="navbar">
        <Link href="/" className="logo">
          🏠 StudentStay
        </Link>

        <Link href="/" className="browseButton">
          Browse Houses
        </Link>
      </nav>

      <section className="postContainer">
        <p className="smallText">LIST YOUR PROPERTY</p>

        <h1>Post a House</h1>

        <p className="postIntro">
          Add your property details so students can discover your
          accommodation.
        </p>

        {submitted ? (
          <div className="successMessage">
            <h2>House submitted successfully! 🎉</h2>

            <p>
              Your property has been submitted and is waiting for review.
            </p>

            <Link href="/" className="browseButton">
              Back to StudentStay
            </Link>
          </div>
        ) : (
          <form className="houseForm" onSubmit={handleSubmit}>
            <label>
              Property Name
              <input
                name="title"
                type="text"
                placeholder="e.g. Modern Self-Contain"
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                type="text"
                placeholder="e.g. Calabar, Cross River State"
                required
              />
            </label>
            
            <label>
  Area / Neighborhood
  <input
    name="area"
    type="text"
    placeholder="e.g. Marian, 8 Miles, Big Qua Town"
    required
  />
</label>

            <label>
              Price per Year
              <input
                name="price"
                type="number"
                placeholder="e.g. 650000"
                min="0"
                required
              />
            </label>

            <label>
              Property Type
              <select name="propertyType" required defaultValue="">
                <option value="" disabled>
                  Select property type
                </option>

                <option value="Room">Room</option>
                <option value="Self Contain">Self Contain</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
                <option value="Flat">Flat</option>
              </select>
            </label>

            <label>
              Number of Bedrooms
              <input
                name="bedrooms"
                type="number"
                min="1"
                placeholder="e.g. 1"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                placeholder="Describe the property..."
                rows={5}
                required
              />
            </label>
            <label>
  Property Images
  <input
    name="images"
    type="file"
    accept="image/*"
    multiple
  />
</label>

            <label>
              Landlord WhatsApp Number
              <input
                name="whatsapp"
                type="tel"
                placeholder="e.g. 08123456789"
                required
              />
            </label>

            {errorMessage && (
              <p style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="postButton"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Property →"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}