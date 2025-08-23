import React from "react";

const scams = [
  {
    id: 1,
    title: "EMAIL SCAMS",
    desc: "Fraudsters Disguise As Trusted Sources — One Click And Your Data’s Gone.",
    img: "https://via.placeholder.com/400x250?text=Email+Scam", // replace with your email scam image
  },
  {
    id: 2,
    title: "CALL SCAMS",
    desc: "Scammers Use Fake Identities To Trick, Scare, Or Emotionally Manipulate You.",
    img: "https://via.placeholder.com/400x250?text=Call+Scam", // replace with your call scam image
  },
  {
    id: 3,
    title: "ONLINE SCAMS",
    desc: "From Fake Websites To Too-Good-To-Be-True Offers — The Internet Is Their Playground.",
    img: "https://via.placeholder.com/400x250?text=Online+Scam", // replace with your online scam image
  },
];

export default function TypesOfScams() {
  return (
    <div className="w-full flex flex-col items-center bg-white py-24">
      {/* Section title */}
      <div className="w-[90%] md:w-[70%] bg-[#5c52ff] rounded-full py-4 flex justify-center items-center mb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          TYPES OF SCAMS
        </h2>
      </div>

      {/* Scam cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-[90%] md:w-[80%]">
        {scams.map((scam) => (
          <div
            key={scam.id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col items-center text-center transition transform hover:-translate-y-2"
          >
            <img
              src={scam.img}
              alt={scam.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#5c52ff] mb-2">
                {scam.title}
              </h3>
              <p className="text-gray-500 text-sm">{scam.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
