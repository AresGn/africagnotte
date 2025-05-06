'use client';

type ImagePlaceholderProps = {
  text?: string;
  subtext?: string;
  className?: string;
  textColor?: string;
  backgroundColor?: string;
};

export default function ImagePlaceholder({
  text = "AfricaGnotte",
  subtext,
  className = "w-full h-full",
  textColor = "var(--dark-color)",
  backgroundColor = "var(--light-color)"
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`${className} flex items-center justify-center`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="text-center px-4">
        {text && <div className="font-bold">{text}</div>}
        {subtext && <div className="text-sm mt-1">{subtext}</div>}
      </div>
    </div>
  );
} 