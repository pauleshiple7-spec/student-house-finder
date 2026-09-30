import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";

export default async function HouseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: house, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !house) {
    return (
      <main className="detailsPage">
        <h1>House not found</h1>
        <p>The property you are looking for does not exist.</p>

        <Link href="/">← Back to StudentStay</Link>
      </main>
    );
  }

  const image =
    house.image_urls && house.image_urls.length > 0
      ? house.image_urls[0]
      : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";

  const whatsappNumber = house.whatsapp || house.phone || "";

  const whatsappMessage = `Hello, I'm interested in the ${house.title} in ${house.location}. Is it still available?`;

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "#";

  return (
    <main className="detailsPage">
      <nav className="navbar">
        <div className="logo">🏠 StudentStay</div>

        <div className="navLinks">
          <Link href="/">Home</Link>
          <Link href="/#houses">Find Houses</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </div>

        <Link href="/post" className="postButton">
          Post a House
        </Link>
      </nav>

      <section className="detailsContainer">
        <Link href="/" className="backLink">
          ← Back to houses
        </Link>

        <div className="detailsCard">
          <div className="detailsImage">
            <img src={image} alt={house.title} />
          </div>

          <div className="detailsInfo">
            <span className="tag">{house.property_type}</span>

            <h1>{house.title}</h1>

            <p className="location">📍 {house.location}</p>

            <h2>₦{Number(house.price).toLocaleString()} / year</h2>

            <div className="propertyFacts">
              <div>
                <strong>{house.bedrooms}</strong>
                <span>Bedroom</span>
              </div>

              <div>
                <strong>{house.property_type}</strong>
                <span>Property Type</span>
              </div>
            </div>

            <div className="description">
              <h3>About this property</h3>

              <p>
                {house.description ||
                  "Contact the agent for more information about this property."}
              </p>
            </div>

            <div className="detailsActions">
              {house.phone && (
                <>
                  <p>
                    <strong>Agent Phone:</strong> {house.phone}
                  </p>

                  <a
                    href={`tel:${house.phone}`}
                    className="contactButton"
                  >
                    📞 Call Agent
                  </a>
                </>
              )}

              {whatsappNumber ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="contactButton"
                >
                  💬 Contact Agent on WhatsApp
                </a>
              ) : (
                <p>No WhatsApp number provided.</p>
              )}

              <Link href="/" className="browseButton">
                Browse More Houses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div>🏠 StudentStay</div>

        <p>Student housing made simple.</p>

        <p>© {new Date().getFullYear()} StudentStay</p>
      </footer>
    </main>
  );
}