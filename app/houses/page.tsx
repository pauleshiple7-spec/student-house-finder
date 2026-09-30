import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  bedrooms: number;
  description: string | null;
  image_urls: string[];
  status: string;
};

type HousesPageProps = {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    propertyType?: string;
    bedrooms?: string;
  }>;
};

export default async function HousesPage({
  searchParams,
}: HousesPageProps) {
  const supabase = await createClient();

  const params = await searchParams;

  const location = params.location || "";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const propertyType = params.propertyType || "";
  const bedrooms = params.bedrooms || "";

  let query = supabase
    .from("properties")
    .select(
      "id, title, location, price, property_type, bedrooms, description, image_urls, status"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (minPrice) {
    query = query.gte("price", Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte("price", Number(maxPrice));
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  if (bedrooms) {
    query = query.gte("bedrooms", Number(bedrooms));
  }

  const { data: properties, error } = await query;

  if (error) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Find Houses</h1>
        <p>Unable to load houses at the moment.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Find your next home.</h1>

      {/* SEARCH AND FILTERS */}
      <form
        method="GET"
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="location"
            placeholder="Location e.g. Calabar"
            defaultValue={location}
            style={inputStyle}
          />

          <input
            type="number"
            name="minPrice"
            placeholder="Minimum price"
            defaultValue={minPrice}
            style={inputStyle}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Maximum price"
            defaultValue={maxPrice}
            style={inputStyle}
          />

          <select
            name="propertyType"
            defaultValue={propertyType}
            style={inputStyle}
          >
            <option value="">All property types</option>
            <option value="Room">Room</option>
            <option value="Self Contain">Self Contain</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedroom">2 Bedroom</option>
            <option value="3 Bedroom">3 Bedroom</option>
            <option value="Apartment">Apartment</option>
          </select>

          <select
            name="bedrooms"
            defaultValue={bedrooms}
            style={inputStyle}
          >
            <option value="">Any bedrooms</option>
            <option value="1">1+ bedroom</option>
            <option value="2">2+ bedrooms</option>
            <option value="3">3+ bedrooms</option>
            <option value="4">4+ bedrooms</option>
          </select>
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button type="submit" style={buttonStyle}>
            Search Houses
          </button>

          <Link href="/houses" style={clearButtonStyle}>
            Clear Filters
          </Link>
        </div>
      </form>

      {/* PROPERTY RESULTS */}
      {properties && properties.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "30px",
          }}
        >
          {properties.map((property: Property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
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

              <h2>{property.title}</h2>

              <p>📍 {property.location}</p>

              <p>
                ₦{property.price.toLocaleString()} / year
              </p>

              <p>
                {property.property_type} · {property.bedrooms} bedroom
                {property.bedrooms !== 1 ? "s" : ""}
              </p>

              {property.description && (
                <p>{property.description}</p>
              )}

              <Link href={`/houses/${property.id}`}>
                View Property →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: "30px" }}>
          No approved properties match your search.
        </p>
      )}
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
};

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  background: "#333",
  color: "white",
  cursor: "pointer",
};

const clearButtonStyle = {
  padding: "12px 20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#333",
  background: "white",
};