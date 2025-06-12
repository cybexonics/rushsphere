// src/components/ContactUs.jsx
import React, { useState } from "react";
import axios from "axios";
import { MapPin, Phone, Mail } from "react-feather";

const ContactUs = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("https://rushsphere.onrender.com/api/send-email", {
        to: "contactrushphere@gmail.com",
        subject,
        message,
      });

      if (res.status === 200) {
        setStatus("Email sent successfully!");
        setSubject("");
        setMessage("");
      } else {
        setStatus("Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending email.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-black rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Message</label>
          <textarea
            className="w-full px-3 py-2 text-black rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </form>

      {/* Contact Information Section */}
      <div>
        <h4 className="font-semibold text-white mb-4">Registered Office:</h4>

        <p className="flex items-start mb-2">
          <MapPin size={16} className="mr-2 mt-1 text-blue-400" />
          <span>
            RushSphere,
            <br />
            Gadag, 582101
          </span>
        </p>

        <p className="flex items-center mb-2">
          <Phone size={16} className="mr-2 text-blue-400" />
          1-800-RUSH-SPH
        </p>

        <p className="flex items-center mb-2">
          <Mail size={16} className="mr-2 text-blue-400" />
          support@rushsphere.com
        </p>

        <p className="text-sm text-gray-400">Mon - Fri: 9AM - 6PM</p>
      </div>
    </div>
  );
};

export default ContactUs;

