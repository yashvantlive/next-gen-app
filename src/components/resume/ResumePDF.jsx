import React from 'react';

export default function ResumePDF({ data }) {
  if (!data) return null;

  const { personalInfo, summary, education, skills, projects, experience, extraCurricular } = data;

  const S = {
    page: {
      width: '210mm',
      maxHeight: '290mm',
      padding: '15mm 10mm 15mm 10mm',
      backgroundColor: '#ffffff',
      fontFamily: '"Times New Roman", Times, serif',
      color: '#000000',
      lineHeight: '1.4',
      boxSizing: 'border-box',
      fontSize: '10.5pt',
      overflow: 'hidden',
    },
    header: {
      textAlign: 'center',
      borderBottom: '2px solid #000',
      paddingBottom: '5px',
      marginBottom: '10px',
    },
    name: {
      fontSize: '22pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      margin: '0 0 4px 0',
      lineHeight: '1.2',
    },
    contact: {
      fontSize: '10pt',
      marginBottom: '2px',
    },
    link: {
      color: '#0066cc',
      textDecoration: 'none',
    },
    sectionTitle: {
      fontSize: '12pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      borderBottom: '1px solid #000',
      marginTop: '8px',
      marginBottom: '6px',
      paddingBottom: '6px',
      paddingTop: '2px',
      textAlign: 'center',
      letterSpacing: '0.5px',
    },
    block: {
      marginBottom: '6px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      width: '100%',
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    ul: {
      margin: '3px 0 0 16px',
      padding: 0,
      listStyleType: 'disc',
    },
    li: {
      marginBottom: '2px',
      textAlign: 'justify',
      paddingLeft: '2px',
      fontSize: '10.5pt',
      lineHeight: '1.3',
    },
    skillLine: { marginBottom: '3px', fontSize: '10.5pt' },
    techStack: {
      fontSize: '9.5pt',
      marginTop: '2px',
      fontStyle: 'italic',
      color: '#222',
      marginBottom: '3px',
    },
  };

  return (
    <div id="resume-pdf-content" style={S.page}>
      
      {/* HEADER */}
      <div style={S.header}>
        <h1 style={S.name}>{personalInfo?.fullName}</h1>
        <div style={S.contact}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span> | {personalInfo.phone}</span>}
          {personalInfo?.location && <span> | {personalInfo.location}</span>}
          {personalInfo?.showLinkedin !== false && personalInfo?.linkedin && (
            <span> | <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={S.link}>LinkedIn</a></span>
          )}
          {personalInfo?.showGithub !== false && personalInfo?.github && (
            <span> | <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={S.link}>GitHub</a></span>
          )}
          {personalInfo?.showPortfolio !== false && personalInfo?.portfolio && (
            <span> | <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" style={S.link}>Portfolio</a></span>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={S.block}>
          <div style={S.sectionTitle}>PROFESSIONAL SUMMARY</div>
          <div style={{textAlign:'justify', lineHeight: '1.4', fontSize: '10.5pt'}}>{summary}</div>
        </div>
      )}

      {/* SKILLS */}
      <div style={S.block}>
        <div style={S.sectionTitle}>SKILLS</div>
        {skills?.showtechnical !== false && skills?.technical?.length > 0 && (
          <div style={S.skillLine}>
            <span style={S.bold}>Technical: </span>
            <span>{skills.technical.join(', ')}</span>
          </div>
        )}
        {skills?.showprofessional !== false && skills?.professional?.length > 0 && (
          <div style={S.skillLine}>
            <span style={S.bold}>Professional: </span>
            <span>{skills.professional.join(', ')}</span>
          </div>
        )}
        {skills?.showinterests !== false && skills?.interests?.length > 0 && (
          <div style={S.skillLine}>
            <span style={S.bold}>Interests: </span>
            <span>{skills.interests.join(', ')}</span>
          </div>
        )}
      </div>

      {/* EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div style={S.block}>
          <div style={S.sectionTitle}>EXPERIENCE</div>
          {experience.map((exp, i) => (
            <div key={i} style={{marginBottom: '6px'}}>
              <div style={S.row}>
                <span style={{fontWeight:'bold', fontSize:'11pt'}}>{exp.company}</span>
                <span style={{fontWeight:'bold', fontSize:'10.5pt'}}>{exp.duration}</span>
              </div>
              <div style={{...S.italic, marginBottom:'2px', fontSize:'10.5pt'}}>{exp.role}</div>
              <div style={{textAlign:'justify', fontSize:'10.5pt'}}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <div style={S.block}>
          <div style={S.sectionTitle}>PROJECTS</div>
          {projects.map((proj, i) => (
            <div key={i} style={{marginBottom: '6px'}}>
              <div style={S.row}>
                <span style={{fontWeight:'bold', fontSize:'11pt'}}>{proj.title}</span>
                {proj.link && (
                  <a 
                    href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{...S.link, fontSize:'9.5pt'}}
                  >
                    [Link]
                  </a>
                )}
              </div>
              
              {proj.techStack && proj.techStack.length > 0 && (
                <div style={S.techStack}>
                  <span style={{fontWeight:'bold', fontStyle:'normal'}}>Tech: </span> 
                  {proj.techStack.join(', ')}
                </div>
              )}

              {proj.points && proj.points.length > 0 ? (
                <ul style={S.ul}>
                  {proj.points.map((pt, idx) => (
                    pt.text && <li key={idx} style={S.li}>{pt.text}</li>
                  ))}
                </ul>
              ) : (
                <div style={{textAlign:'justify', marginTop:'2px', fontSize:'10.5pt'}}>{proj.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div style={S.block}>
          <div style={S.sectionTitle}>EDUCATION</div>
          {education.map((edu, i) => (
            <div key={i} style={{marginBottom: '6px'}}>
              <div style={S.row}>
                <span style={{fontWeight:'bold', fontSize:'11pt'}}>{edu.institution}</span>
                <span style={{fontWeight:'bold', fontSize:'10.5pt'}}>{edu.year}</span>
              </div>
              <div style={S.row}>
                <span style={{fontStyle:'italic', fontSize:'10.5pt'}}>
                  {edu.degree} {edu.university ? `| ${edu.university}` : ''}
                </span>
                {edu.cgpa && <span style={{fontSize:'10pt'}}>Score: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {extraCurricular && extraCurricular.length > 0 && (
        <div style={S.block}>
          <div style={S.sectionTitle}>ACHIEVEMENTS & ACTIVITIES</div>
          {extraCurricular.map((item, i) => (
            <div key={i} style={{display:'grid', gridTemplateColumns:'130px 1fr', gap:'8px', marginBottom:'4px'}}>
              <div style={{fontWeight:'bold', fontSize:'10.5pt'}}>{item.heading}</div>
              <div style={{textAlign:'justify', fontSize:'10.5pt'}}>{item.description}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}