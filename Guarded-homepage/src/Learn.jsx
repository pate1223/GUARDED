import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Learn({ onBack }) {
  return (
    <div className="w-screen min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">Learn about Scams</h1>
        <Button
          variant="outline"
          className="rounded-full border-[#5c52ff] text-[#5c52ff] hover:bg-[#e6e3ff]"
          onClick={onBack}
        >
          Back
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Protect yourself by learning about common scams
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* Online Scams */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold mb-4 text-[#5c52ff]">Online Scams</h3>
              <p className="text-gray-600 mb-6">
                Learn how to spot fake websites, phishing attempts, and fraudulent online offers.
              </p>
              <Button className="bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1]">
                Read More
              </Button>
            </CardContent>
          </Card>

          {/* Call Scams */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold mb-4 text-[#5c52ff]">Call Scams</h3>
              <p className="text-gray-600 mb-6">
                Discover how scammers trick people over the phone and what to do if you get a suspicious call.
              </p>
              <Button className="bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1]">
                Read More
              </Button>
            </CardContent>
          </Card>

          {/* Email Scams */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold mb-4 text-[#5c52ff]">Email Scams</h3>
              <p className="text-gray-600 mb-6">
                Understand how to recognize fake emails, attachments, and requests for personal info.
              </p>
              <Button className="bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1]">
                Read More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
