import React from 'react';
import Header from './Header'; // Import the Header component
import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaPhone } from 'react-icons/fa';

function HomePage() {
  return (
    <div className="relative">
      <Header />

      {/* Home section */}
      <section
        id="home"
        className="h-screen bg-fixed bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80')` }}
      >
        <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto p-4">
          {/* Left - Description */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-5xl font-bold">Welcome to AMS College</h1>
            <p className="text-lg">
              AMS College is dedicated to fostering innovation, excellence, and leadership. We offer
              top-tier education with world-class infrastructure and experienced faculty.
            </p>
          </div>

          {/* Right - Image */}
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80"
              alt="College Building"
              className="w-80 h-80 object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Branch Section */}
      <section id="branch" className="py-20 bg-green-50">
        <h2 className="text-4xl font-bold text-center mb-12">Our Branches</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 p-4">
          
          {/* CSE */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              alt="CSE Branch"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">CSE</h3>
            <p>
              Computer Science Engineering focuses on software, algorithms, and technologies shaping the future.
              <span className="text-blue-500 cursor-pointer ml-2">Some more...</span>
            </p>
          </div>

          {/* CSM */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <img
              src="https://images.unsplash.com/photo-1581090700227-1c075d9e67f8?auto=format&fit=crop&w=800&q=80"
              alt="CSM Branch"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">CSM</h3>
            <p>
              Computer Science & Machine Learning is all about AI, data science, and modern intelligent systems.
              <span className="text-blue-500 cursor-pointer ml-2">Some more...</span>
            </p>
          </div>

          {/* MECH */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <img
              src="https://images.unsplash.com/photo-1581091870619-cb8f23f03b41?auto=format&fit=crop&w=800&q=80"
              alt="MECH Branch"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">MECH</h3>
            <p>
              Mechanical Engineering shapes industries with expertise in design, materials, and mechanics.
              <span className="text-blue-500 cursor-pointer ml-2">Some more...</span>
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10">About Us</h2>
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <p className="text-lg">
            AMS College has been a beacon of excellence for over 25 years, nurturing young minds into future leaders.
            Our vision is to empower students with practical knowledge and ethical values to thrive in today's world.
          </p>

          {/* Professors */}
          <div className="flex flex-col md:flex-row justify-center gap-12 mt-12">
            {/* Professor 1 */}
            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Professor 1"
                className="w-40 h-40 object-cover rounded-full shadow-md"
              />
              <h4 className="mt-4 text-xl font-semibold">Dr. John Doe</h4>
              <p className="text-gray-600">Head of CSE Department</p>
            </div>

            {/* Professor 2 */}
            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Professor 2"
                className="w-40 h-40 object-cover rounded-full shadow-md"
              />
              <h4 className="mt-4 text-xl font-semibold">Dr. Jane Smith</h4>
              <p className="text-gray-600">Head of Mechanical Department</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-10">Contact Us</h2>
        <div className="max-w-4xl mx-auto space-y-6 text-center text-lg text-gray-700">
          
          <div className="flex flex-col items-center space-y-2">
            <FaEnvelope className="text-3xl" />
            <p>amscollege@example.com</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaPhone className="text-3xl" />
            <p>Principal Phone: +91 9876543210</p>
          </div>

          <div className="flex justify-center space-x-6 text-3xl mt-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaFacebook />
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}

export default HomePage;
