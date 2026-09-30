"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "./utils/supabase/client";
const supabase = createClient();

type House = {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  image: string;
};

export default function Home() {
  const [search, setSearch] = useState("");
const [type, setType] = useState("All");
const [houses, setHouses] = useState<House[]>([]);

useEffect(() => {
  async function loadHouses() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
      console.log("HOUSES DATA:", data, "ERROR:", error);

    if (error) {
      console.error("Error loading houses:", error);
      return;
    }

    const formattedHouses: House[] = (data || []).map((house) => ({
      id: house.id,
      title: house.title,
      location: house.location,
      price: Number(house.price),
      type: house.property_type,
      bedrooms: house.bedrooms,
      image: house.image_urls?.[0] || "",
    }));

    setHouses(formattedHouses);
  }

  loadHouses();
}, []);

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