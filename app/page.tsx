"use client";

import { useState } from "react";
import Link from "next/link";
const houses = [
  {
    id: 1,
    title: "Modern Self-Contain",
    location: "Yaba, Lagos",
    price: "₦650,000/year",
    type: "Self Contain",
    bedrooms: 1,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
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
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.title.toLowerCase().includes(search.toLowerCase()) ||
      house.location.toLowerCase().includes(search.toLowerCase());

    const matchesType = type === "All" || house.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <main>
      <nav className="navbar">
        <div className="logo">🏠 StudentStay</div>

        <div className="navLinks">
          <a href="#home">Home</a>
          <a href="#houses">Find Houses</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <Link href="/post" className="postButton">
  Post a House
</Link>

        </nav>

      <section className="hero" id="home">
        <div className="heroContent">
          <p className="smallText">STUDENT HOUSING MADE EASY</p>

          <h1>
            Find a place
            <br />
            <span>you can call home.</span>
          </h1>

          <p className="heroText">
            Discover affordable student accommodation near your school,
            campus or preferred location.
          </p>

          <div className="searchBox">
            <input
              type="text"
              placeholder="Search location or property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Room">Room</option>
              <option value="Self Contain">Self Contain</option>
              <option value="2 Bedroom">2 Bedroom</option>
            </select>

            <button>Search</button>
          </div>
        </div>
      </section>

      <section className="houses" id="houses">
        <div className="sectionHeader">
          <div>
            <p className="smallText">AVAILABLE PROPERTIES</p>
            <h2>Find your next home.</h2>
          </div>

          <p>{filteredHouses.length} properties found</p>
        </div>

        <div className="houseGrid">
          {filteredHouses.map((house) => (
            <article className="houseCard" key={house.id}>
              <img
                src={`${house.image}?auto=format&fit=crop&w=900&q=80`}
                alt={house.title}
              />

              <div className="houseInfo">
                <div className="houseTop">
              <span className="tag">{house.type}</span>
                  <span>♡</span>
                </div>

                <h3>{house.title}</h3>

                <p className="location">📍 {house.location}</p>

                <div className="houseBottom">
                  <strong>{house.price}</strong>
                  <span>{house.bedrooms} Bedroom</span>
                </div>

                <Link
  href={`/houses/${house.id}`}
  className="detailsButton"
>
  View Details →
</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="features" id="about">
        <div>
          <p className="smallText">WHY STUDENTSTAY?</p>
          <h2>Housing should be simple.</h2>
        </div>

        <div className="featureGrid">
          <div>
            <span>01</span>
            <h3>Search easily</h3>
            <p>
              Find properties by location, price and property type.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Affordable options</h3>
            <p>
              Discover accommodation designed around student budgets.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Save time</h3>
            <p>
              Compare different properties without visiting every location.
            </p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="smallText">GET STARTED</p>

        <h2>Ready to find your next home?</h2>

        <p>
          StudentStay makes it easier for students to discover suitable
          accommodation.
        </p>

        <button>Explore Houses →</button>
      </section>

      <footer>
        <div>🏠 StudentStay</div>
        <p>Student housing made simple.</p>
        <p>© {new Date().getFullYear()} StudentStay</p>
      </footer>
    </main>
  );
}