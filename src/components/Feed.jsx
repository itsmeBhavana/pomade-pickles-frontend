import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feed.css";
import Loader from "./Loader";

const Feed = () => {
  const [pickles, setPickles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickles = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/pickles`,
          { withCredentials: true }
        );
        setPickles(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pickles:", error);
        setLoading(false);
      }
    };

    fetchPickles();
  }, []);
  if (loading) return <Loader />;

  // Group pickles by category
  const picklesByCategory = pickles.reduce((groups, pickle) => {
    const { category } = pickle;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(pickle);
    return groups;
  }, {});

  return (
    <main className="feed" id="feed">
      <div>
        {Object.keys(picklesByCategory).map((category) => (
          <div key={category} className="category-section">
            <h2 className="category-title">Our {category}s</h2>
            <div className="pickle-grid">
              {picklesByCategory[category].map((pickle) => (
                <div key={pickle.name} className="pickle-card">
                  <img
                    src={pickle.imageUrl}
                    alt={pickle.name}
                    className="pickle-image"
                  />
                  <h3 className="text-xl font-bold">{pickle.name}</h3>
                  <p>{pickle.description}</p>
                  <p className="text-green-700 font-semibold">
                    {pickle.quantity}gms: Rs{pickle.price}/-
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Feed;
