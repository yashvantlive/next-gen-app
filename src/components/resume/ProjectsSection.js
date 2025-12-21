'use client';

export default function ProjectsSection({ data, onAdd, onUpdate, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Showcase your best projects</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => onUpdate(project.id, { ...project, title: e.target.value })}
                  placeholder="E-commerce Platform"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => onUpdate(project.id, { ...project, description: e.target.value })}
                  placeholder="Brief description of the project and what it does..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={project.techStack.join(', ')}
                  onChange={(e) => {
                    const techStack = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                    onUpdate(project.id, { ...project, techStack });
                  }}
                  placeholder="React, Node.js, MongoDB, Firebase"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Project Link (GitHub/Demo)</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => onUpdate(project.id, { ...project, link: e.target.value })}
                  placeholder="https://github.com/... or https://demo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <button
                onClick={() => onDelete(project.id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
