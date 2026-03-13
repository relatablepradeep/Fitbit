"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import disease_data from "./disease_data.json";
import { useRouter } from "next/navigation";

/* ✅ Define Type */
interface Disease {
  disease_name?: string;
  link?: string;
  image_url?: string;
  alt_text?: string;
  brief_text?: string;
  symptoms?: string[];
}

export default function Fitness() {
  const [diseasesData, setDiseasesData] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    try {
      setLoading(true);

      const data = disease_data as Disease[];

      setDiseasesData(data);
      setFilteredDiseases(data);

      setLoading(false);
    } catch (err) {
      setError("Failed to load disease data");
      setLoading(false);
      console.error("Error loading disease data:", err);
    }
  }, []);

  useEffect(() => {
    if (!diseasesData.length) return;

    if (searchTerm === "") {
      setFilteredDiseases(diseasesData);
    } else {
      const filtered = diseasesData.filter((disease) =>
        disease.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.disease_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredDiseases(filtered);
    }
  }, [searchTerm, diseasesData]);

  const handleCardClick = (disease: Disease) => {
    router.push(
      `/fitness/${encodeURIComponent(disease.alt_text || disease.disease_name || "")}`
    );
  };

  /* click outside suggestions */
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (
    e: React.MouseEvent,
    disease: Disease
  ) => {
    e.stopPropagation();

    setShowSuggestions(false);

    router.push(
      `/fitness/${encodeURIComponent(disease.alt_text || disease.disease_name || "")}`
    );
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSuggestions(true);
  };

  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50 font-serif">
        <div className="animate-pulse flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
          <div className="h-16 w-16 bg-amber-200 rounded-full mb-6 animate-spin"></div>
          <div className="h-6 w-64 bg-amber-100 rounded mb-4"></div>
          <div className="h-4 w-48 bg-amber-50 rounded mb-2"></div>
          <div className="h-4 w-32 bg-amber-50 rounded"></div>
          <div className="mt-6 text-amber-600">
            Loading Ayurvedic remedies...
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Error UI ---------------- */

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50 font-serif">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Error Loading Data
          </h2>
          <p className="text-amber-900 text-lg">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */

  return (
    <div className="p-6 md:p-8 lg:p-12 font-serif bg-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            Ayurvedic Remedies
          </h1>
          <p className="text-lg text-amber-700">
            Discover ancient wisdom for modern healing
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 relative max-w-3xl mx-auto">

          <div
            className="flex items-center bg-white shadow-md rounded-lg py-3 px-4 border-2 border-amber-200"
            onClick={handleSearchClick}
          >
            <Search className="text-amber-500 w-7 h-7 mr-3" />

            <input
              type="text"
              placeholder="Search Ayurvedic remedies..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className="flex-grow outline-none text-lg bg-transparent"
            />
          </div>

          {showSuggestions && (
            <div className="absolute z-10 bg-white w-full mt-2 rounded-lg shadow-xl max-h-80 overflow-auto border-2 border-amber-100">

              {filteredDiseases.slice(0, 10).map((disease, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-amber-50 cursor-pointer flex items-center"
                  onClick={(e) => handleSuggestionClick(e, disease)}
                >
                  <img
                    src={disease.image_url || "/api/placeholder/60/60"}
                    alt={disease.alt_text}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  <span className="text-amber-800 font-medium">
                    {disease.alt_text}
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredDiseases.map((disease, index) => (

            <div
              key={index}
              onClick={() => handleCardClick(disease)}
              className="bg-white border-2 border-amber-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
            >

              <img
                src={disease.image_url || "/api/placeholder/100/100"}
                className="w-20 h-20 rounded-full mb-4"
              />

              <h2 className="text-lg font-bold text-amber-800">
                {disease.alt_text}
              </h2>

              <p className="text-sm text-amber-600">
                {disease.disease_name}
              </p>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}