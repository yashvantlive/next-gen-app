'use client';

export default function ResumePreview({ data }) {
  return (
    <div className="w-full bg-white text-gray-900" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
      {/* A4 Page Container */}
      <div style={{ width: '210mm', height: '297mm', margin: '0 auto', padding: '20mm', boxSizing: 'border-box', backgroundColor: 'white' }}>
        
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
          <div className="text-center text-xs text-gray-700 space-x-2">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.email && data.personalInfo.phone && <span>|</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {(data.personalInfo.email || data.personalInfo.phone) && data.personalInfo.location && <span>|</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          </div>
          {(data.personalInfo.linkedIn || data.personalInfo.github) && (
            <div className="text-center text-xs text-gray-700 space-x-2 mt-1">
              {data.personalInfo.linkedIn && (
                <a href={data.personalInfo.linkedIn} className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.linkedIn && data.personalInfo.github && <span>|</span>}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} className="text-blue-600 hover:underline">
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1 mb-2" style={{ fontSize: '11px' }}>SUMMARY</h2>
            <p className="text-xs text-gray-800 leading-tight">{data.summary}</p>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && data.projects.some(p => p.title) && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1 mb-2" style={{ fontSize: '11px' }}>PROJECTS</h2>
            <div className="space-y-2">
              {data.projects.map((project, idx) => (
                project.title && (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-900">{project.title}</span>
                      {project.link && (
                        <a href={project.link} className="text-blue-600 hover:underline text-xs">
                          Link
                        </a>
                      )}
                    </div>
                    {project.techStack.length > 0 && (
                      <div className="text-gray-700">
                        <span className="font-semibold">Tech Stack Used :</span> - {project.techStack.join(', ')}
                      </div>
                    )}
                    {project.description && (
                      <div>
                        <ul className="list-disc list-inside text-gray-800 ml-2 mt-1">
                          {project.description.split('\n').map((line, i) => (
                            line.trim() && (
                              <li key={i} className="text-gray-800">
                                {line.trim()}
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1 mb-2" style={{ fontSize: '11px' }}>TECHNICAL SKILLS</h2>
            <div className="text-xs text-gray-800 space-y-1">
              {Object.entries({
                'Languages': ['JavaScript', 'TypeScript', 'Python', 'C/C++'],
                'Front-End': ['Next.js', 'React.js', 'React Native', 'Tailwind CSS'],
                'Back-End': ['Node.js', 'Express.js', 'RESTful APIs'],
                'Database': ['MongoDB', 'Firebase', 'Supabase'],
                'Tools & Platforms': ['GitHub', 'Postman', 'Canva'],
                'Other': ['Authentication (JWT)', 'Server-Side Rendering (EJS)', 'Performance Optimization', 'AI Integration']
              }).map(([category, items]) => (
                <div key={category}>
                  <span className="font-bold">{category}:</span> {data.skills.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && data.education.some(e => e.degree) && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1 mb-2" style={{ fontSize: '11px' }}>EDUCATION</h2>
            <div className="space-y-1">
              {data.education.map((edu, idx) => (
                edu.degree && (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-900">{edu.degree}</span>
                      {edu.year && <span className="text-gray-700">{edu.year}</span>}
                    </div>
                    <div className="text-gray-800">
                      {edu.institution}
                      {edu.university && ` | ${edu.university}`}
                    </div>
                    {edu.cgpa && <div className="text-gray-700">{edu.cgpa}</div>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 bg-gray-200 px-2 py-1 mb-2" style={{ fontSize: '11px' }}>EXPERIENCE</h2>
            <div className="space-y-2">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900">{exp.role}</span>
                    {exp.duration && <span className="text-gray-700">{exp.duration}</span>}
                  </div>
                  <p className="text-gray-800">{exp.company}</p>
                  {exp.description && <p className="text-gray-800 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
