import React from "react";

const Footer: React.FC = () => (
  <footer className="mt-8 border-t border-white/5 bg-black/95">
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="w-[88px]">
          <img src="/images/logo.svg" alt="XD Platform Logo" className="h-6 w-auto" />
        </div>

        <div className="grid flex-1 grid-cols-3 gap-8 text-xs text-gray-400">
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Company</h4>
            <ul className="space-y-1">
              <li>Community</li>
              <li>About</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Legal</h4>
            <ul className="space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-200">Community</h4>
            <ul className="space-y-1">
              <li>X</li>
              <li>LinkedIn</li>
              <li>Discord</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        © {new Date().getFullYear()} XD Platform. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
