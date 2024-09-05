import React from "react";
import { Phone, Mail, MapPin, User } from "lucide-react"; // Additional icon for a default user avatar
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HeaderTop from "../../Components/Header/HeaderTop";

const personnelData = [
  {
    name: "Mayank Rathore",
    position: "Senior Helpdesk Specialist",
    phone: "+91 956-123-4567",
    email: "mayank.rathore@example.com",
    location: "Indore",
    photo:
      "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
  },
  {
    name: "Anshul Thakur",
    position: "Helpdesk Coordinator",
    phone: "+91  987-987-6543",
    email: "anshul.thakur@example.com",
    location: "Indore",
    photo:
      "https://media.istockphoto.com/id/653832634/photo/portrait-of-male-doctor-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=YKusn_UfkRfMdBWJR1thZOaJtMlZsNNf-cA2jlRbtGQ=",
  },
  {
    name: "Anshul Thakur",
    position: "Helpdesk Coordinator",
    phone: "+91  987-987-6543",
    email: "anshul.thakur@example.com",
    location: "Indore",
    photo:
      "https://media.istockphoto.com/id/653832634/photo/portrait-of-male-doctor-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=YKusn_UfkRfMdBWJR1thZOaJtMlZsNNf-cA2jlRbtGQ=",
  },
  {
    name: "Anshul Thakur",
    position: "Helpdesk Coordinator",
    phone: "+91  987-987-6543",
    email: "anshul.thakur@example.com",
    location: "Indore",
    photo:
      "https://media.istockphoto.com/id/653832634/photo/portrait-of-male-doctor-standing-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=YKusn_UfkRfMdBWJR1thZOaJtMlZsNNf-cA2jlRbtGQ=",
  },
];

const HelpdeskPersonnel = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen text-gray-800 p-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
      </div>
      <div className="relative top-24">
        <div className="relative max-w-4xl h-[80vh]  mx-auto bg-gray-100 overflow-y-scroll   bg-opacity-80   rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold bg-white z-50  text-center fixed w-[120vh] h-28  text-blue-800">
            Meet Our Helpdesk Team
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-1 mt-20 gap-8 ">
            {personnelData.map((person, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-28 h-24 rounded-full overflow-hidden">
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-[90px] h-[90px] object-covern rounded-[50%]"
                    />
                  ) : (
                    <User size={100} className="w-full h-full text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-1 text-gray-800">
                    {person.name}
                  </h2>
                  <p className="text-lg mb-2 text-gray-600">
                    {person.position}
                  </p>
                  <div className="flex items-center mb-2">
                    <Phone className="mr-2 text-green-600" />
                    <a
                      href={`tel:${person.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {person.phone}
                    </a>
                  </div>
                  <div className="flex items-center mb-2">
                    <Mail className="mr-2 text-red-600" />
                    <a
                      href={`mailto:${person.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {person.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-gray-600" />
                    <p>{person.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      </div>
    </div>
  );
};

export default HelpdeskPersonnel;
