import React, { useState } from "react";
import { ContactFormModel } from "../../models/ContactFormModel";

const Contact = () => {
  const [form, setForm] = useState(new ContactFormModel());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(form.updateField(name, value));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const nextFormState = form.submit();
      setForm(nextFormState);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-3xl font-bold text-[#4a1c02] mb-2">Contact Us</h1>
      <p className="text-gray-600 text-sm mb-6">
        Have questions about an order or a recipe? Drop us a message using the form below.
      </p>

      {form.isSent && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-md mb-5 text-sm">
          Thank you! Your message has been submitted successfully.
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Name:</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            className="p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#4a1c02]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email:</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleInputChange}
            placeholder="yourname@example.com"
            className="p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#4a1c02]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message:</label>
          <textarea
            rows="4"
            name="message"
            required
            value={form.message}
            onChange={handleInputChange}
            placeholder="Write your query here..."
            className="p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#4a1c02] resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-[#4a1c02] hover:bg-stone-900 text-white font-bold py-3 px-6 rounded-md text-sm mt-2 transition duration-150 cursor-pointer"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;