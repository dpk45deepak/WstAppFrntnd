import { useState } from "react";
import {
  Calendar,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const SchedulePickup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    wasteType: "general",
    pickupDate: "",
    pickupTime: "",
    specialInstructions: "",
  });

  const wasteTypes = [
    { id: "general", label: "General Waste", icon: "🗑️", color: "bg-teal-100" },
    {
      id: "recyclable",
      label: "Recyclables",
      icon: "♻️",
      color: "bg-blue-100",
    },
    { id: "organic", label: "Organic", icon: "🍃", color: "bg-rose-100" },
    { id: "hazardous", label: "Hazardous", icon: "⚠️", color: "bg-indigo-100" },
    { id: "e-waste", label: "E-Waste", icon: "💻", color: "bg-purple-100" },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  const steps = [
    { number: 1, title: "Address", icon: <MapPin className="w-5 h-5" /> },
    { number: 2, title: "Waste Type", icon: <Package className="w-5 h-5" /> },
    { number: 3, title: "Date & Time", icon: <Calendar className="w-5 h-5" /> },
    { number: 4, title: "Confirm", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Handle form submission
      console.log("Form submitted:", formData);
    }
  };

  return (
    <section
      className="py-20 bg-linear-to-b from-gray-50 to-white"
      id="schedule"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Quick & Easy Scheduling</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Schedule a Pickup
              </span>
              <br />
              <span className="text-gray-800">in 4 Simple Steps</span>
            </h2>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-linear-to-r from-teal-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                      step >= s.number
                        ? "bg-linear-to-r from-teal-500 to-blue-500 text-white scale-110 shadow-lg"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <span
                    className={`font-medium ${step >= s.number ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Address */}
                {step === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <label className="block text-lg font-semibold mb-4 text-gray-800">
                        Where should we pick up?
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter your full address"
                          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Map Preview (Simulated) */}
                    <div className="relative h-48 rounded-xl overflow-hidden bg-linear-to-br from-teal-50 to-blue-50 border-2 border-dashed border-gray-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-teal-500" />
                          </div>
                          <p className="text-gray-600">
                            Your location will appear here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Waste Type */}
                {step === 2 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <label className="block text-lg font-semibold mb-6 text-gray-800">
                        What type of waste do you have?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {wasteTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                              formData.wasteType === type.id
                                ? "border-teal-500 bg-teal-50 transform scale-105"
                                : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              setFormData({ ...formData, wasteType: type.id })
                            }
                          >
                            <div className="text-3xl mb-4">{type.icon}</div>
                            <div className="font-medium text-gray-800">
                              {type.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-lg font-semibold mb-4 text-gray-800">
                        Any special instructions?
                      </label>
                      <textarea
                        placeholder="e.g., Heavy items, special handling requirements, etc."
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all h-32"
                        value={formData.specialInstructions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialInstructions: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Time */}
                {step === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Date Selection */}
                      <div>
                        <label className="block text-lg font-semibold mb-4 text-gray-800">
                          <Calendar className="inline-block w-5 h-5 mr-2" />
                          Select Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                            value={formData.pickupDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pickupDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-lg font-semibold mb-4 text-gray-800">
                          <Clock className="inline-block w-5 h-5 mr-2" />
                          Preferred Time Slot
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className={`p-4 rounded-lg border-2 transition-all ${
                                formData.pickupTime === slot
                                  ? "border-teal-500 bg-teal-50 text-teal-700"
                                  : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                setFormData({ ...formData, pickupTime: slot })
                              }
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Preview */}
                    <div className="bg-linear-to-r from-teal-50 to-blue-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">
                        Your Pickup Schedule
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600">Date</span>
                          <span className="font-semibold">
                            {formData.pickupDate || "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600">Time</span>
                          <span className="font-semibold">
                            {formData.pickupTime || "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-600">Service Type</span>
                          <span className="font-semibold">
                            {
                              wasteTypes.find(
                                (w) => w.id === formData.wasteType,
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="text-center space-y-8 animate-fadeIn">
                    <div className="w-24 h-24 bg-linear-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-4 text-gray-800">
                        Ready to Schedule!
                      </h3>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Review your pickup details and confirm to schedule your
                        waste collection service
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-md mx-auto">
                      <h4 className="font-bold text-lg mb-4 text-gray-800">
                        Order Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Type</span>
                          <span className="font-semibold">
                            {
                              wasteTypes.find(
                                (w) => w.id === formData.wasteType,
                              )?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pickup Date</span>
                          <span className="font-semibold">
                            {formData.pickupDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot</span>
                          <span className="font-semibold">
                            {formData.pickupTime}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-teal-600">$29.99</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="px-8 py-4 rounded-xl font-medium text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="submit"
                    className="group relative bg-linear-to-r from-teal-500 to-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        {step === 4 ? "Confirm & Schedule" : "Continue"}
                      </span>
                      {step < 4 && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-bold mb-2">Same-Day Pickup</h4>
              <p className="text-gray-600 text-sm">
                Schedule before 10 AM for same-day service
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">No Hidden Fees</h4>
              <p className="text-gray-600 text-sm">
                Transparent pricing with no surprises
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-rose-600" />
              </div>
              <h4 className="font-bold mb-2">Eco-Friendly</h4>
              <p className="text-gray-600 text-sm">
                85%+ of collected waste gets recycled
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulePickup;
