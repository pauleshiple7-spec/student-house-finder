import Link from "next/link";

type House = {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  image: string;
  description: string;
};

const houses: House[] = [
  {
    id: 1,
    title: "Modern Self-Contain",
    location: "Yaba, Lagos",
    price: "₦650,000/year",
    type: "Self Contain",
    bedrooms: 1,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    description:
      "A modern and comfortable self-contained apartment suitable for students looking for affordable accommodation in Yaba.",
  },
  {
    id: 2,
    title: "2 Bedroom Student Apartment",
    location: "Surulere, Lagos",
    price: "₦900,000/year",
    type: "2 Bedroom",
    bedrooms: 2,
    image:
      "https://images.unsplash.com/photo-1560185008-b033106af5c3",
    description:
      "A spacious two-bedroom apartment suitable for students who want to share accommodation.",
  },
  {
    id: 3,
    title: "Affordable Student Room",
    location: "Akoka, Lagos",
    price: "₦450,000/year",
    type: "Room",
    bedrooms: 1,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    description:
      "An affordable student room located close to schools and other important facilities.",
  },
];

export default async function HouseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const house = houses.find((item) => item.id === Number(id));

  if (!house) {
    return (
      <main className="detailsPage">
        <h1>House not found</h1>
        <p>The property you are looking for does not exist.</p>

        <Link href="/">← Back to StudentStay</Link>
      </main>
    );
  }

  const whatsappMessage = `Hello, I'm interested in the ${house.title} in ${house.location}. Is it still available?`;

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

        <button className="postButton">Post a House</button>
      </nav>

      <section className="detailsContainer">
        <Link href="/" className="backLink">
          ← Back to houses
        </Link>

        <div className="detailsCard">
          <div className="detailsImage">
            <img
              src={`${house.image}?auto=format&fit=crop&w=1200&q=80`}
              alt={house.title}
            />
          </div>

          <div className="detailsInfo">
            <span className="tag">{house.type}</span>

            <h1>{house.title}</h1>

            <p className="location">📍 {house.location}</p>

            <h2>{house.price}</h2>

            <div className="propertyFacts">
              <div>
                <strong>{house.bedrooms}</strong>
                <span>Bedroom</span>
              </div>

              <div>
                <strong>{house.type}</strong>
                <span>Property Type</span>
              </div>
            </div>

            <div className="description">
              <h3>About this property</h3>
              <p>{house.description}</p>
            </div>

            <div className="detailsActions">
              <a
                href={`https://wa.me/2348134783737?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noreferrer"
                className="contactButton"
              >
                Contact Landlord on WhatsApp
              </a>

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