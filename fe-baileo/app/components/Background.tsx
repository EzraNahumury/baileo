export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-5%,#1c1710_0%,#0b0a07_45%,#050505_80%)]" />

      {/* faint grid */}
      <div className="bg-grid absolute inset-0" />

      {/* circuit ornament (top) */}
      <svg
        className="absolute left-0 right-0 top-0 h-[640px] w-full opacity-[0.18]"
        viewBox="0 0 1440 640"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
      >
        <g stroke="#d6a84f" strokeWidth="1">
          <path d="M120 0v140h120v90h160" />
          <path d="M1320 0v180h-140v120h-180" />
          <path d="M0 90h80v120h120" />
          <path d="M1440 70h-90v100h-140" />
          <path d="M360 0v60h60v80" />
          <path d="M1080 0v40h-80v90" />
        </g>
        <g fill="#f6d27a">
          <circle cx="240" cy="230" r="3" />
          <circle cx="400" cy="230" r="3" />
          <circle cx="1180" cy="300" r="3" />
          <circle cx="200" cy="210" r="3" />
          <circle cx="420" cy="140" r="3" />
          <circle cx="1000" cy="130" r="3" />
        </g>
      </svg>

      {/* gold glows */}
      <div className="glow-blob absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 opacity-60" />
      <div className="glow-blob absolute right-[-120px] top-[18%] h-80 w-80 opacity-40" />
      <div className="glow-blob absolute left-[-120px] top-[42%] h-80 w-80 opacity-30" />

      {/* bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}
