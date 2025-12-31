'use client';

// components/ShareButton.jsx
import { Share2 } from 'lucide-react';

export default function ShareButton({ type, data, urlId, customClass = "" }) {
  
  const handleShare = async () => {
    const baseUrl = window.location.origin;
    let shareUrl = '';
    let shareTitle = '';
    let shareText = '';

    if (type === 'syllabus') {
      shareUrl = `${baseUrl}/syllabus?id=${urlId}`;
      shareTitle = `${data.subjectName} - Syllabus`;
      shareText = `Check out ${data.subjectName} syllabus on ConnectInfinity!`;
    } else if (type === 'pyq') {
      shareUrl = `${baseUrl}/pyq?id=${urlId}`;
      shareTitle = `${data.subjectName} - Previous Year Questions`;
      shareText = `Check out ${data.subjectName} PYQs on ConnectInfinity!`;
    } else {
      shareUrl = window.location.href;
      shareTitle = 'ConnectInfinity';
      shareText = 'Check this out on ConnectInfinity!';
    }

    // Native Share API (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={customClass || "flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"}
    >
      <Share2 size={16} />
    </button>
  );
}