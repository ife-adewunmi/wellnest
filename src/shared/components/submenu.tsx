"use client";

import React, { useState } from "react";
import { MessageSquare, FileText, Download, MoreHorizontal } from "lucide-react";

export default function WellnessDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="p-4">
      <div className=" relative">
        {/* Three Dot Menu Button */}
        <div className="flex justify-end">
          <div
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Dropdown Content */}
        {menuOpen && (
          <div className="absolute top-12 right-4 w-80 bg-white shadow-lg rounded-xl border z-10">
            {/* Item 1 */}
            <div className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-base font-medium">Prompt Mood Check-in Action</span>
            </div>

            {/* Item 2 */}
            <div className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-base font-medium">Add Note</span>
            </div>

            {/* Item 3 */}
            <div className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-base font-medium">Download Report</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
