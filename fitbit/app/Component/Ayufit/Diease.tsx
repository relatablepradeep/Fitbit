"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import disease_data from "./scraped_diseases.json";

export default function Disease() {
  const params = useParams();
  const router = useRouter();
  const diseaseId = params?.diseaseId;

  const [disease, setDisease] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("overview");

  const overviewRef = useRef(null);
  const keyFactsRef = useRef(null);
  const symptomsRef = useRef(null);
  const diagnosisRef = useRef(null);
  const preventionRef = useRef(null);
  const specialistsRef = useRef(null);
  const homeCareRef = useRef(null);
  const dosAndDontsRef = useRef(null);
  const alternativeTherapiesRef = useRef(null);

  // Load disease from JSON
  useEffect(() => {
    if (!diseaseId) return;

    const decodedId = decodeURIComponent(diseaseId as string).toLowerCase();

    const found = disease_data.find(
      (d: any) =>
        d.alt_text?.toLowerCase() === decodedId ||
        d.disease_name?.toLowerCase() === decodedId
    );

    setDisease(found);
  }, [diseaseId]);

  // Intersection Observer for side navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-section") || "");
          }
        });
      },
      { threshold: 0.5 }
    );

    const refs = [
      { ref: overviewRef, id: "overview" },
      { ref: keyFactsRef, id: "keyFacts" },
      { ref: symptomsRef, id: "symptoms" },
      { ref: diagnosisRef, id: "diagnosis" },
      { ref: preventionRef, id: "prevention" },
      { ref: specialistsRef, id: "specialists" },
      { ref: homeCareRef, id: "homeCare" },
      { ref: dosAndDontsRef, id: "dosAndDonts" },
      { ref: alternativeTherapiesRef, id: "alternativeTherapies" },
    ];

    refs.forEach(({ ref, id }) => {
      if (ref.current) {
        (ref.current as any).dataset.section = id;
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [disease]);

  const scrollToSection = (sectionRef: any) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!disease) {
    return (
      <div className="p-6 text-center text-amber-700 font-semibold bg-amber-50 min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-2xl mb-4">Disease Not Found</h2>
          <button
            onClick={() => router.push("/fitness")}
            className="px-4 py-2 bg-amber-600 text-white rounded"
          >
            Back to Fitness
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", title: "Overview", ref: overviewRef, condition: disease.overview_text },
    { id: "keyFacts", title: "Key Facts", ref: keyFactsRef, condition: disease.keyfacts?.length },
    { id: "symptoms", title: "Symptoms", ref: symptomsRef, condition: disease.symptoms?.length },
    { id: "diagnosis", title: "Diagnosis", ref: diagnosisRef, condition: disease.diagnosis_text },
    { id: "prevention", title: "Prevention", ref: preventionRef, condition: disease.prevention_text },
    { id: "specialists", title: "Specialists", ref: specialistsRef, condition: disease.specialists?.length },
    { id: "homeCare", title: "Home Care", ref: homeCareRef, condition: disease.home_care_text },
    { id: "dosAndDonts", title: "Do's & Don'ts", ref: dosAndDontsRef, condition: disease.dos?.length },
    {
      id: "alternativeTherapies",
      title: "Alternative Therapies",
      ref: alternativeTherapiesRef,
      condition: disease.alternative_therapies_text,
    },
  ];

  const availableSections = sections.filter((s) => s.condition);

  return (
    <div className="flex flex-col md:flex-row bg-amber-50 min-h-screen font-serif">

      {/* LEFT NAVIGATION */}
      <div className="md:w-72 bg-amber-100 p-4 shadow-inner md:sticky md:top-0 md:h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold text-amber-800 mb-6 border-b border-amber-300 pb-2">
          Treatment Journey
        </h3>

        {availableSections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.ref)}
            className={`block w-full text-left p-3 rounded-lg mb-2 ${
              activeSection === section.id
                ? "bg-amber-500 text-white"
                : "text-amber-800 hover:bg-amber-200"
            }`}
          >
            {index + 1}. {section.title}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow p-6 md:p-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center mb-10 border-b border-amber-200 pb-8">
          <img
            src={disease.image_url || "/placeholder.png"}
            className="w-40 h-40 object-cover rounded-full border-4 border-amber-300 shadow-lg"
          />

          <div className="md:ml-8 text-center md:text-left">
            <h1 className="text-4xl font-bold text-amber-800">
              {disease.alt_text}
            </h1>

            <p className="text-xl text-amber-700">{disease.disease_name}</p>

            <p className="text-amber-600 mt-3">{disease.brief_text}</p>
          </div>
        </div>

        {/* OVERVIEW */}
        {disease.overview_text && (
          <section ref={overviewRef} className="mb-10">
            <h2 className="text-2xl font-semibold text-amber-800 mb-4">
              Overview
            </h2>
            <p className="text-amber-900 text-lg">{disease.overview_text}</p>
          </section>
        )}

        {/* SYMPTOMS */}
        {disease.symptoms?.length > 0 && (
          <section ref={symptomsRef} className="mb-10">
            <h2 className="text-2xl font-semibold text-amber-800 mb-4">
              Symptoms
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-amber-800">
              {disease.symptoms.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {/* DOS */}
        {disease.dos?.length > 0 && (
          <section ref={dosAndDontsRef} className="mb-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Do's
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              {disease.dos.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </section>
        )}

        {/* DON'TS */}
        {disease.donts?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Don'ts
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              {disease.donts.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}