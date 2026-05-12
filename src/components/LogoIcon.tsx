const LogoIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="currentColor" className="text-primary" />
    <text
      x="32"
      y="44"
      textAnchor="middle"
      fontFamily="DejaVu Sans, Arial Black, Arial, sans-serif"
      fontSize="42"
      fontWeight="800"
      fill="white"
    >
      G
    </text>
  </svg>
);

export { LogoIcon };
