import React from "react";
import { Search, Wrench, Users, Ticket, Mail, HelpCircle } from "lucide-react";
import HeaderTop from "../../Components/Header/HeaderTop";
import { useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-blue-100 to-cyan-600 min-h-screen text-white p-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
      </div>

      <main className="text-center pt-24">
        <h1 className="text-5xl font-bold mb-6">How Can We Assist You?</h1>
        <p className="text-lg mb-12">
          Find the information you need or get in touch with us.
        </p>

        <div className="relative max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search for questions or topics..."
            className="w-full py-3 px-4 pr-12  h-[45px] rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600">
            <Search size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Wrench size={40} />,
              title: "Using Deskoto",
              description: "Guides on utilizing Deskoto effectively.",
            },
            {
              icon: <Users size={40} />,
              title: "Community Forums",
              description: "Connect with others and share knowledge.",
            },
            {
              icon: <Ticket size={40} />,
              title: "Ticket System",
              description: "Get help quickly through our ticket system.",
            },
            {
              icon: <Mail size={40} />,
              title: "Contact Us",
              description: "Reach out directly for personalized assistance.",
            },
            {
              icon: <HelpCircle size={40} />,
              title: "FAQs",
              description: "Frequently asked questions for quick answers.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white text-purple-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-300 to-purple-600 rounded-full">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end py-8 mr-5 fixed bottom-[65%] z-100">
          <div className="flex justify-center py-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center px-6 py-3 bg-blue-800 text-gray-100 font-semibold rounded-md shadow-xl border-2 border-blue-700 hover:bg-blue-700 hover:border-blue-600 hover:text-white transition duration-300"
            >
              <FaArrowLeft className="mr-2 text-lg" /> {/* Back arrow icon */}
              Back to Main Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
