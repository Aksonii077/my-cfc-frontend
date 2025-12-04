import React, { useState } from "react";
import { Modal, message } from "antd";
import { COLORS } from "../../constants/fef";
import axios from "axios";
import { logger } from '@/utils/logger';

interface GuessFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  fundingAmount?: number; // Amount in rupees (e.g., 10000000 for 1 CR)
  startupId?: string;
}

const GuessFundingModal: React.FC<GuessFundingModalProps> = ({
  isOpen,
  onClose,
  companyName = "Startup",
  fundingAmount = 10000000, // Default to 1 CR
  startupId = "",
}) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Choose prediction, Step 2: Enter details
  const [selectedChoice, setSelectedChoice] = useState<"higher" | "lower" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChoiceSelect = (choice: "higher" | "lower") => {
    setSelectedChoice(choice);
    setStep(2); // Move to form step
  };

  const handleSubmit = async () => {
    if (!selectedChoice || !name.trim() || !phone.trim()) {
      message.error("Please fill in all fields");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone.trim())) {
      message.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        startup_id: startupId,
        startup_name: companyName,
        prediction: selectedChoice === "higher" ? "high" : "low",
      };

      // Get the API base URL from environment or use default
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";
      
      const response = await axios.post(
        `${apiBaseUrl}/gamification/predict-by-contact`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      logger.info('GuessFundingModal: Prediction submitted', { startupId, companyName, prediction: selectedChoice });
      message.success("Your prediction has been submitted successfully!");
      setIsSubmitted(true);
    } catch (error: any) {
      logger.error('GuessFundingModal: Error submitting prediction', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to submit prediction. Please try again.";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after a short delay to allow modal to close smoothly
    setTimeout(() => {
      setStep(1);
      setSelectedChoice(null);
      setName("");
      setPhone("");
      setIsSubmitting(false);
      setIsSubmitted(false);
    }, 300);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedChoice(null);
  };

  const modalStyles = {
    header: {
      backgroundColor: "#000000",
      borderBottom: "none",
    },
    body: {
      backgroundColor: "#000000",
      color: "#fff",
    },
    footer: {
      backgroundColor: "#000000",
      borderTop: "none",
    },
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width="95%"
      style={{ maxWidth: "800px", margin: "0 auto" }}
      centered
      styles={{
        header: modalStyles.header,
        body: modalStyles.body,
        footer: modalStyles.footer,
      }}
      className="custom-funding-modal"
      destroyOnClose={true}
    >
      <div className="text-white px-3 sm:px-6">
        {!isSubmitted ? (
          <>
            {/* Header with Trophy and Title */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 flex-1">
                <div className="text-xl sm:text-2xl">🏆</div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                    {step === 1
                      ? `Guess ${companyName}'s Funding`
                      : "Complete Your Entry"}
                  </h2>
                  <p
                    className="text-xs sm:text-sm md:text-base mt-1"
                    style={{ color: COLORS.primary }}
                  >
                    For a chance to win exciting prizes!
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-300 text-xl sm:text-2xl leading-none ml-2 flex-shrink-0"
              >
                ×
              </button>
            </div>

            {step === 1 ? (
              /* Step 1: Choose Prediction */
              <div className="text-left mb-6 sm:mb-8">
                <h3 className="text-white text-sm sm:text-lg md:text-xl font-normal mb-4 sm:mb-6 leading-relaxed">
                  Is {companyName}'s actual funding higher or lower than
                </h3>
                <div className="flex items-end justify-start gap-1 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
                  <span className="text-[#f9ac03] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                    ₹
                  </span>
                  <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                    {(fundingAmount / 10000000).toFixed(1)}
                  </span>
                  <span className="text-white text-xl sm:text-xl md:text-xl font-bold">
                    Crore?
                  </span>
                </div>

                {/* Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleChoiceSelect("higher")}
                    className="py-3 sm:py-4 px-4 sm:px-6 rounded-lg border-2 transition-all duration-200 font-bold text-sm sm:text-base hover:border-[#f9ac03]"
                    style={{
                      borderColor: "#666666",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="/fef/trendingUp.svg"
                        alt="Trending Up"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span className="text-white">HIGHER</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleChoiceSelect("lower")}
                    className="py-3 sm:py-4 px-4 sm:px-6 rounded-lg border-2 transition-all duration-200 font-bold text-sm sm:text-base hover:border-[#f9ac03]"
                    style={{
                      borderColor: "#666666",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="/fef/trending-up.svg"
                        alt="Trending Down"
                        className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-180"
                      />
                      <span className="text-white">LOWER</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Enter Name and Phone */
              <div className="text-left mb-6 sm:mb-8">
                <div className="mb-6">
                  <p className="text-gray-300 text-sm mb-4">
                    You selected:{" "}
                    <span
                      className="font-bold text-base"
                      style={{ color: COLORS.primary }}
                    >
                      {selectedChoice?.toUpperCase()}
                    </span>
                  </p>

                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    className="text-sm mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.primary }}
                  >
                    <span>←</span> Change prediction
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-300 text-sm mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-[#f9ac03] transition-all"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                      }}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-300 text-sm mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-[#f9ac03] transition-all"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || !phone.trim() || isSubmitting}
                  className={`w-full mt-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 ${
                    name.trim() && phone.trim() && !isSubmitting
                      ? "hover:opacity-90 text-black"
                      : "opacity-50 cursor-not-allowed text-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      name.trim() && phone.trim() && !isSubmitting
                        ? "#f9ac03"
                        : "#333333",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit My Prediction"}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <>
            {/* Header with Trophy and Title */}
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3 flex-1">
                <div className="text-xl sm:text-2xl">🏆</div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                    Prediction Submitted!
                  </h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-300 text-xl sm:text-2xl leading-none ml-2 flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Success Content */}
            <div className="mb-6 sm:mb-8">
              {/* Prediction Details Box */}
              <div
                className="border-2 rounded-lg p-4 sm:p-6 mb-6"
                style={{ borderColor: "#f9ac03" }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <span
                      className="text-base sm:text-lg font-bold"
                      style={{ color: "#f9ac03" }}
                    >
                      Startup:{" "}
                    </span>
                    <span className="text-white text-base sm:text-lg">
                      {companyName}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-base sm:text-lg font-bold"
                      style={{ color: "#f9ac03" }}
                    >
                      Your Prediction:{" "}
                    </span>
                    <span className="text-white text-base sm:text-lg">
                      {selectedChoice?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <img
                      src="/fef/Vector 3.svg"
                      alt="Divider"
                      className="h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-6">
                    <div className="text-lg sm:text-xl">🎉</div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Thank you for participating! We'll contact winners soon.
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-full py-2 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 hover:opacity-90 border-2 text-white"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#666666",
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-funding-modal .ant-modal-content {
          background-color: #000000 !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
        }

        .custom-funding-modal .ant-modal-close-x {
          display: none !important;
        }

        .custom-funding-modal .ant-modal-body {
          padding: 8px !important;
        }

        @media (min-width: 640px) {
          .custom-funding-modal .ant-modal-body {
            padding: 8px !important;
          }
        }

        .custom-funding-modal input:focus {
          border-color: #f9ac03 !important;
        }
      `}</style>
    </Modal>
  );
};

export default GuessFundingModal;
