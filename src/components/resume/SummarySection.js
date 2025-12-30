'use client';

export default function SummarySection({ data, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
        <p className="text-sm text-gray-500 mt-1">A brief 2-3 sentence overview of your background and goals</p>
      </div>

      <textarea
        id="professional-summary"
        name="professional-summary"
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Motivated Computer Science student with strong programming skills in React, Node.js, and Firebase. Passionate about building scalable applications and solving real-world problems..."
        rows="5"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      />
      <p className="text-xs text-gray-500 mt-2">💡 Keep it concise and focused on your key skills and achievements</p>
    </div>
  );
}
