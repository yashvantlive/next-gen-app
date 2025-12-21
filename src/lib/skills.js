export function getSuggestedSkills(branch) {
  const map = {
    "Computer Science": [
      "Web Development",
      "Data Structures",
      "Algorithms",
      "Machine Learning",
      "Databases",
      "Systems Design",
      "DevOps",
      "Security",
      "Mobile Development",
      "Cloud"
    ],
    IT: ["Networking","Systems","Databases","Web Development","Security","Cloud","DevOps","Mobile","Automation"],
    Electrical: ["Circuits","Embedded Systems","Signal Processing","Power Systems","Control Systems","PCB Design","IoT"],
    Mechanical: ["CAD","Thermodynamics","Mechanics","Manufacturing","SolidWorks","Robotics","Materials"],
    Civil: ["Structural","Geotechnical","Surveying","Construction Management","AutoCAD"],
    Chemical: ["Process Design","Thermodynamics","Material Science","Control Systems"],
    Electronics: ["Embedded","Signal Processing","VLSI","IoT","Analog Design"],
    Biotechnology: ["Molecular Biology","Bioinformatics","Genetics","Lab Techniques"],
    Other: ["Research","Project Management","Communication","Problem Solving"]
  };
  return map[branch] || map["Computer Science"];
}