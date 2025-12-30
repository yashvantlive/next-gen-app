import React from 'react';

export default function PersonalInfo({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  // Helper for Toggle Switch
  const Toggle = ({ field, label }) => (
    <div className="flex items-center gap-2 mb-1">
      <label htmlFor={`show-${field.toLowerCase()}`} className="relative inline-flex items-center cursor-pointer">
        <input 
          id={`show-${field.toLowerCase()}`}
          name={`show-${field.toLowerCase()}`}
          type="checkbox" 
          className="sr-only peer"
          checked={data[`show${field}`] !== false} // Default true
          onChange={(e) => handleChange(`show${field}`, e.target.checked)}
        />
        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
      <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-1">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="full-name" className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
          <input
            id="full-name"
            name="full-name"
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="user-email" className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
          <input
            id="user-email"
            name="user-email"
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone-number" className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
          <input
            id="phone-number"
            name="phone-number"
            type="text"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Links with Toggles */}
        <div>
          <Toggle field="Linkedin" label="LinkedIn URL" />
          <input
            id="linkedin-url"
            name="linkedin-url"
            type="text"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            disabled={data.showLinkedin === false}
            className={`w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 ${data.showLinkedin === false ? 'bg-gray-100 text-gray-400' : ''}`}
          />
        </div>
        <div>
          <Toggle field="Github" label="GitHub URL" />
          <input
            id="github-url"
            name="github-url"
            type="text"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            disabled={data.showGithub === false}
            className={`w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 ${data.showGithub === false ? 'bg-gray-100 text-gray-400' : ''}`}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Toggle field="Portfolio" label="Portfolio / Website" />
          <input
            id="portfolio-url"
            name="portfolio-url"
            type="text"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            disabled={data.showPortfolio === false}
            className={`w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 ${data.showPortfolio === false ? 'bg-gray-100 text-gray-400' : ''}`}
          />
        </div>
        <div>
           <label htmlFor="location" className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
           <input
            id="location"
            name="location"
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}