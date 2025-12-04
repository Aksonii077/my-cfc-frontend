import React, { useState } from 'react';
import { StartupCard as StartupCardType } from '../../types/fef';
import { COLORS } from '../../constants/fef';
import ResponsiveButton from './ResponsiveButton';
import GuessFundingModal from '../Modals/GuessFundingModal';

const StartupCard: React.FC<StartupCardType> = ({
  startup_name,
  description,
  founder,
  whyStandsOut,
  image,
  website,
  startup_valuation,
  id,
  brandIcon,
  representing,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGuessClick = () => {
    // Open the funding prediction modal directly (no login required)
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleVisitWebsite = () => {
    if (website) {
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col h-full border border-gray-600 transition-transform duration-300 hover:scale-105"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="aspect-video bg-gray-800 mb-6">
        {image ? (
          <img
            src={`/fef/${image}`}
            alt={`${startup_name} Image`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <h3
          className="text-lg md:text-xl font-bold mb-2"
          style={{ color: COLORS.primary }}
        >
          {startup_name}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm mb-4">
          ABOUT THE STARTUP
        </p>
        <p className="text-white text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
          {description || "No description available"}
        </p>

        {founder && (
          <div className="mb-4 md:mb-6">
            <p className="text-gray-400 text-xs mb-2">FOUNDER(S)</p>
            <p className="text-white text-xs md:text-sm">{founder}</p>
          </div>
        )}

        {whyStandsOut && (
          <div className="mb-4 md:mb-6">
            <p className="text-gray-400 text-xs mb-2">WHY IT STANDS OUT</p>
            <p
              className="text-xs md:text-sm font-bold"
              style={{ color: COLORS.primary }}
            >
              {whyStandsOut}
            </p>
          </div>
        )}

        <div className="space-y-3 mt-auto">
          {website && (
            <ResponsiveButton
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleVisitWebsite}
            >
              VISIT WEBSITE
              <img
                src="/fef/external-link.svg"
                alt="External link"
                className="w-3 h-3 md:w-4 md:h-4"
              />
            </ResponsiveButton>
          )}
          <ResponsiveButton
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleGuessClick}
          >
            GUESS FUNDING / VALUATION & WIN!
          </ResponsiveButton>
        </div>
      </div>

      {/* Guess Funding Modal */}
      <GuessFundingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        companyName={startup_name}
        fundingAmount={startup_valuation || 10000000}
        startupId={id}
      />
    </div>
  );
};

export default StartupCard;