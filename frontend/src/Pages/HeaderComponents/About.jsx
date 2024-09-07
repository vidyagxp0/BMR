import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderTop from "../../Components/Header/HeaderTop";
import "./About.css";
import { FaArrowLeft } from "react-icons/fa";

function About() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
      </div>

      <div className="pt-14 mt-5 px-2 flex flex-col items-center">
        <div className="relative w-full mb-6">
          <img
            src="Bck Logo.png"
            alt="Background Image"
            className="w-full object-cover  shadow-lg"
          />
          <p className="family">
            At BMR, we streamline batch manufacturing <br />
            records with precision and innovation,
            <br />
            ensuring compliance and efficiency in <br />
            pharmaceutical production.
            <br />
          </p>
        </div>

        <div className="text-center max-w-full mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
          <p className="text-lg leading-relaxed text-gray-800 font-semibold transition-transform duration-300 hover:scale-105">
            VidyaGxP, formerly known as MSGMP Compliance & Pharma Solutions, is
            a leading global provider of GxP software solutions, empowering
            pharmaceutical and life sciences companies to achieve and maintain
            compliance efficiently. With a deep understanding of GxP regulations
            and industry best practices, we offer a comprehensive suite of
            software solutions designed to streamline:
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-20 items-center justify-between py-8 w-[80%]">
          <div className="md:w-1/2 pr-4 overflow-hidden">
            <img
              src="https://www.pakistantoday.com.pk/wp-content/uploads/2022/11/Gamma-17-696x458.jpg"
              alt="Family walking together"
              className="w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-2xl font-extrabold text-red-500 mb-2">
              Our vision
            </h2>
            <p className="text-3xl font-bold text-blue-800">
              Become the most valued and trusted medicines company in the world.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-20 items-center justify-between py-8 w-[80%]">
          <div className="md:w-1/2 pl-4 overflow-hidden ">
            <img
              src="https://media.istockphoto.com/id/878852718/photo/pharmacist-holding-medicine-box-and-capsule-pack.jpg?s=612x612&w=0&k=20&c=IUWVv0S2_iOBsgn0PGXNxLuzdDuF7u0GqpdmX5M51Y0="
              alt="Healthcare workers collaborating"
              className="w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-2xl font-extrabold text-purple-700 mb-2">
              Our strategy
            </h2>
            <p className="text-2xl font-bold text-blue-800">
              Deliver high value medicines that alleviate society's greatest
              disease burdens through technology leadership in R&D and novel
              access approaches.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-20 items-center justify-between py-8 w-[80%]">
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-2xl font-extrabold text-orange-600 mb-2">
              Our Purpose
            </h2>
            <p className="text-2xl font-bold text-blue-800">
              Reimagine medicine to improve and extend people's lives through
              innovation and technology.
            </p>
          </div>
          <div className="md:w-1/2 pl-4 overflow-hidden">
            <img
              src="https://www.eehealth.org/-/media/images/modules/blog/posts/2023/08/hospitalist-checking-patient-750x500.jpg"
              alt="Healthcare workers collaborating"
              className="w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-navy-blue mb-8 text-center">
            Our footprint
          </h2>

          <div className="flex justify-between mb-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-600 mb-2">78k</p>
              <p className="text-blue-600">Employees</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-600 mb-2">140+</p>
              <p className="text-blue-600">Nationalities</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-600 mb-2">284m</p>
              <p className="text-blue-600">Patients reached</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#"
              className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              Download the (BMR) Batch Manufacturing Record, Report 2024 for
              more details (PDF 8.4 MB)
            </a>
          </div>
        </div>

        <footer className="bg-blue-900 text-gray-300 py-8 w-full mb-2">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-black">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Products</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-black">
                      Medicine A
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Medicine B
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Medicine C
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      All Products
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Research</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-black">
                      Clinical Trials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Innovation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Partnerships
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Publications
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-black">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Locations
                    </a>
                  </li>
                </ul>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="text-white hover:text-black">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-black">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-black">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">
                &copy; 2024 Your Company Name. All rights reserved.
              </p>
              <nav className="mt-4 md:mt-0">
                <ul className="flex space-x-4 text-sm">
                  <li>
                    <a href="#" className="hover:text-black">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Terms of Use
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Cookie Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </footer>
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
  );
}

export default About;
