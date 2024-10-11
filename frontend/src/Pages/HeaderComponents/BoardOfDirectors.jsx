import React from "react";
import { Briefcase, Users, Star } from "lucide-react"; // Icons for different sections
import HeaderTop from "../../Components/Header/HeaderTop";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const boardMembers = [
  {
    name: "Mohammed Farhan Khan",
    position: "Team Lead",
    bio: "Farhan has over 20 years of experience in Full Stack development and Planning.",
    photo:
      "https://static.vecteezy.com/system/resources/previews/030/690/466/non_2x/office-worker-2d-cartoon-illustraton-on-white-background-h-free-photo.jpg",
  },
  {
    name: "Mayank Rathore",
    position: "Senior React Developer",
    bio: "Mayank is a visionary leader with a strong background in technology and business development.",
    photo:
      "https://t4.ftcdn.net/jpg/01/26/18/79/360_F_126187913_Jbtv4rUBcRzlYfCjwX4SnF5Spdk5K4bT.jpg",
  },
  {
    name: "Anshul Thakur",
    position: "React Developer",
    bio: "Anshul excels in financial strategy and risk management with extensive experience in the finance sector.",
    photo:
      "https://t4.ftcdn.net/jpg/06/36/36/01/360_F_636360143_g6f0Pp843joz8EdUVsMnKVujyLS9vZ7f.jpg",
  },
  {
    name: "Nickshay Chouhan",
    position: "React Developer",
    bio: "Niclshay brings a wealth of knowledge in technology innovation and systems architecture.",
    photo:
      "https://img.freepik.com/free-photo/fun-3d-cartoon-illustration-indian-businessman_183364-114456.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1725321600&semt=ais_hybrid",
  },
];

const BoardOfDirectors = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen text-gray-800 p-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
      </div>
      <div className="relative top-16">
        {/* <img
          src="https://via.placeholder.com/1600x400" // Decorative header image
          alt="Board of Directors Banner"
          className="absolute inset-0 w-full h-60 object-cover opacity-40"
        /> */}
        <div className="relative max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
            Board of Directors
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-contain mb-4 border-4 border-blue-200"
                />
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {member.name}
                </h2>
                <p className="text-lg mb-4 text-gray-600">{member.position}</p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default BoardOfDirectors;
