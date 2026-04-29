type BadgeProps = {
  children: React.ReactNode;
  tone?: "blue" | "neutral" | "green" | "orange";
};

const tones = {
  blue: "bg-[#f2f9ff] text-[#097fe8]",
  neutral: "bg-[#f6f5f4] text-[#615d59]",
  green: "bg-[#effaf1] text-[#1c7c32]",
  orange: "bg-[#fff4eb] text-[#b64700]",
};

export function Badge({ children, tone = "blue" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold tracking-[0.125px] ${tones[tone]}`}>
      {children}
    </span>
  );
}
