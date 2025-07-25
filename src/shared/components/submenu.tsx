"use client";

import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { interMedium } from "../styles/fonts";
import Image from "next/image";

export default function WellnessDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

return (
  <div className="w-full">
    <div className="relative">
      {/* Three Dot Menu Button - Hidden on mobile since we have hamburger menu */}
      <div className="flex justify-end">
        <div
          onClick={toggleMenu}
          className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Dropdown Content - Responsive */}
      {menuOpen && (
        <div className="absolute top-[-15px] right-0 p-[1rem] bg-white shadow-lg rounded-[12px] z-10 w-64 sm:w-72 gap-[1rem] flex flex-col">
          {/* Items */}
          <div className="hover:bg-gray-50 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
<Image 
            src="/svg/prompt.svg"
            alt="notes"
            width={24}
            height={24}
            />            </div>
            <span className={`${interMedium.className} text-[#1A202C] text-[1rem] flex-1`}>
              Prompt Mood Check-in Action
            </span>
          </div>

          <div className="hover:bg-gray-50 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Image 
                          src="/svg/note.svg"
                          alt="notes"
                          width={24}
                          height={24}
                          />
            </div>
            <span className={`${interMedium.className} text-[#1A202C] text-[1rem] flex-1`}>
              Add Note
            </span>
          </div>
          <div className="hover:bg-gray-50 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Image 
                          src="/svg/check-session.svg"
                          alt="notes"
                          width={24}
                          height={24}
                          />
            </div>
            <span className={`${interMedium.className} text-[#1A202C] text-[1rem] flex-1`}>
              Schedule Session
            </span>
          </div>
          <div className="hover:bg-gray-50 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Image 
                          src="/svg/mail.svg"
                          alt="notes"
                          width={24}
                          height={24}
                          />
            </div>
            <span className={`${interMedium.className} text-[#1A202C] text-[1rem] flex-1`}>
              Send Mail
            </span>
          </div>


          <div className="hover:bg-gray-50 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
<Image 
            src="/svg/download.svg"
            alt="notes"
            width={24}
            height={24}
            />            </div>
            <span className={`${interMedium.className} text-[#1A202C] text-[1rem] flex-1`}>
              Download Report
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
