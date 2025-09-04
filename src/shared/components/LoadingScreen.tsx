export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-50">
      <img
        src="/Pandoo.png"
        alt="Logo"
        className="w-48 h-auto"
      />

      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-gray-800 dark:bg-white rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-gray-800 dark:bg-white rounded-full animate-bounce delay-300"></span>
        <span className="w-3 h-3 bg-gray-800 dark:bg-white rounded-full animate-bounce delay-450"></span>
      </div>

      <style>
        {`
          .animate-bounce {
            display: inline-block;
            animation: bounce 1s infinite;
          }
          .delay-150 { animation-delay: 0.15s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-450 { animation-delay: 0.45s; }

          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
}
