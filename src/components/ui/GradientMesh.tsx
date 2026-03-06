"use client";

export default function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large animated blobs */}
      <div
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #3b82f6, transparent 70%)",
          animation: "blob-1 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
          animation: "blob-2 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #06b6d4, transparent 70%)",
          animation: "blob-1 20s ease-in-out infinite reverse",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
