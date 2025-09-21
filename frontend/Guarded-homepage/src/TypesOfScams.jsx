import React from "react";
import EmailScamImg from "./assets/Email-scams.png";
import CallScamImg from "./assets/Call-scams.png";
import OnlineScamImg from "./assets/Online-scams.png";

const scams = [
  {
    id: 1,
    title: "EMAIL SCAMS",
    desc: "Fraudsters Disguise As Trusted Sources — One Click And Your Data’s Gone.",
    img: EmailScamImg,
  },
  {
    id: 2,
    title: "CALL SCAMS",
    desc: "Scammers Use Fake Identities To Trick, Scare, Or Emotionally Manipulate You.",
    img: CallScamImg,
  },
  {
    id: 3,
    title: "ONLINE SCAMS",
    desc: "From Fake Websites To Too-Good-To-Be-True Offers — The Internet Is Their Playground.",
    img: OnlineScamImg,
  },
];

export default function TypesOfScams() {
  return (
    <div className="w-full flex flex-col items-center bg-white py-24">
      {/* Section title (unchanged) */}
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
            className="p-[2px] rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition transform hover:-translate-y-2"
          >
            <div className="bg-white rounded-3xl shadow-md p-6 h-full flex flex-col items-center text-center">
              {/* Scam image */}
              <img
                src={scam.img}
                alt={scam.title}
                className="w-full h-70 object-cover rounded-xl mb-4"
              />

              {/* Scam title with gradient border */}
              <div className="px-4 py-1 mb-3 rounded-full border-2 text-lg font-bold text-gray-800
                              border-transparent bg-clip-border bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                {scam.title}
              </div>

              {/* Scam description */}
              <p className="text-gray-600 text-base leading-relaxed">{scam.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
