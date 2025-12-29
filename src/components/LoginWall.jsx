// components/LoginWall.jsx
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Check } from 'lucide-react';

export default function LoginWall() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in-95 duration-300">
      {/* Lock Icon */}
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock size={32} className="text-red-500" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
        Free Preview Ended
      </h2>

      {/* Message */}
      <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
        You've viewed this content once as a guest. To view it again and access more features, please login. It's free!
      </p>

      {/* Benefits */}
      <div className="space-y-3 mb-8">
        {[
          'Unlimited syllabus access',
          'Save notes & bookmarks',
          'Track your progress',
          'Access PYQs & practice tests'
        ].map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Check size={14} className="text-green-600" />
            </div>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => router.push('/auth/login')}
        className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        Login / Signup
      </button>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 text-center mt-6">
        100% Free • No Credit Card Required
      </p>
    </div>
  );
}