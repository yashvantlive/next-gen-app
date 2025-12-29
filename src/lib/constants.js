export const FULL_FORMS = {
  "ME": "Mechanical Engineering",
  "CSE": "Computer Science & Eng.",
  "ECE": "Electronics & Comm. Eng.",
  "EEE": "Electrical & Electronics Eng.",
  "CE": "Civil Engineering",
  "IT": "Information Technology",
  "AKU": "Aryabhatta Knowledge University"
};

export const getFullForm = (short) => FULL_FORMS[short] || short;