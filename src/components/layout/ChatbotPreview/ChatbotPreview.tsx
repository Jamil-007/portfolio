export function ChatbotPreview() {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-5 md:right-5">
      <button
        type="button"
        aria-label="AI chatbot"
        disabled
        className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#8bc8ff] bg-[#0075de] text-sm font-bold leading-none text-white shadow-[0_0_18px_6px_rgba(0,117,222,0.22),0_18px_45px_rgba(0,117,222,0.2)]"
      >
        <span>AI</span>
      </button>
    </div>
  );
}
