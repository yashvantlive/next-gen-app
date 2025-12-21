'use client';

import { useState } from 'react';

export default function SkillsSection({ data, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        <p className="text-sm text-gray-500 mt-1">Add skills by typing and pressing Enter</p>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., React, JavaScript, Firebase..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <button
            onClick={addSkill}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet. Start typing to add your first skill!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {data.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-gray-900"
            >
              <span className="font-medium">{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        💡 Add at least 3-5 relevant skills. Use industry-standard names (e.g., "React" not "ReactJS")
      </p>
    </div>
  );
}
