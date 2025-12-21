'use client';

export default function ExperienceSection({ data, onAdd, onUpdate, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experience (Optional)</h2>
          <p className="text-sm text-gray-500 mt-1">Add internships, jobs, or work experience</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No experience added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Role/Position</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => onUpdate(exp.id, { ...exp, role: e.target.value })}
                    placeholder="Software Engineer, Data Analyst, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Company/Organization</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => onUpdate(exp.id, { ...exp, company: e.target.value })}
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => onUpdate(exp.id, { ...exp, duration: e.target.value })}
                  placeholder="Jun 2023 - Aug 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => onUpdate(exp.id, { ...exp, description: e.target.value })}
                  placeholder="Key responsibilities and achievements..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <button
                onClick={() => onDelete(exp.id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove Experience
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
