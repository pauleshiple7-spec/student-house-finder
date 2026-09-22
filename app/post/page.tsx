"use client";

import { useState } from "react";
import Link from "next/link";

export default function PostHouse() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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
              Your property has been received and is ready for review.
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
                type="text"
                placeholder="e.g. Modern Self-Contain"
                required
              />
            </label>

            <label>
              Location
              <input
                type="text"
                placeholder="e.g. Yaba, Lagos"
                required
              />
            </label>

            <label>
              Price per Year
              <input
                type="text"
                placeholder="e.g. ₦650,000/year"
                required
              />
            </label>

            <label>
              Property Type
              <select required defaultValue="">
                <option value="" disabled>
                  Select property type
                </option>

                <option value="Room">Room</option>
                <option value="Self Contain">Self Contain</option>
                <option value="2 Bedroom">2 Bedroom</option>
              </select>
            </label>

            <label>
              Number of Bedrooms
              <input
                type="number"
                min="1"
                placeholder="e.g. 1"
                required
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Describe the property..."
                rows={5}
                required
              />
            </label>

            <label>
              Landlord WhatsApp Number
              <input
                type="tel"
                placeholder="e.g. 08123456789"
                required
              />
            </label>

            <button type="submit" className="postButton">
              Submit Property →
            </button>
          </form>
        )}
      </section>
    </main>
  );
}