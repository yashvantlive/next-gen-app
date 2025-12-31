const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing SSR issues...\n');

const filesToFix = [
  'src/app/exams/page.js',
  'src/app/pyq/page.js',
  'src/app/syllabus/page.js',
  'src/app/todo-study-planner/page.js',
  'src/components/home/StickyBrain.jsx',
  'src/components/InstallPWA.js',
  'src/hooks/useMoodPersistence.js',
  'src/hooks/useStreakEngine.js',
  'src/app/resume/page.js',
  'src/components/ShareButton.jsx',
];

function wrapLocalStorage(content) {
  // Fix localStorage.getItem
  content = content.replace(
    /localStorage\.getItem\(([^)]+)\)/g,
    '(typeof window !== "undefined" ? localStorage.getItem($1) : null)'
  );

  // Fix localStorage.setItem
  content = content.replace(
    /localStorage\.setItem\(([^)]+)\)/g,
    '(typeof window !== "undefined" && localStorage.setItem($1))'
  );

  return content;
}

function wrapWindow(content) {
  // Fix window.print()
  content = content.replace(
    /window\.print\(\)/g,
    '(typeof window !== "undefined" && window.print())'
  );

  // Add more window fixes as needed
  return content;
}

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes
    content = wrapLocalStorage(content);
    content = wrapWindow(content);
    
    // Add "use client" if not present and using browser APIs
    if ((content.includes('localStorage') || content.includes('window.')) 
        && !content.includes('"use client"') 
        && !content.includes("'use client'")) {
      content = `'use client';\n\n${content}`;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⚠️  Not found: ${filePath}`);
  }
});

console.log('\n✅ All files fixed!');