// Reusable Skeleton Loader placeholders to prevent layout shifts on load

export function ProjectSkeleton() {
  return (
    <div className="border border-dark-border rounded-xl overflow-hidden glass p-5 animate-pulse min-h-[220px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-800 rounded w-16" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-800 rounded w-5/6" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-800 rounded w-2/3" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="space-y-4 p-4 border border-dark-border rounded-xl glass animate-pulse">
      <div className="h-5 bg-gray-800 rounded w-1/4 mb-6" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-3 bg-gray-800 rounded w-1/5" />
          <div className="h-3.5 bg-gray-800 rounded w-3/5" />
        </div>
      ))}
    </div>
  );
}

export function CertificatesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border border-dark-border rounded-xl glass">
          <div className="w-12 h-12 bg-gray-800 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIThinkingPulse() {
  return (
    <div className="flex items-center gap-1.5 p-2.5 bg-black/20 border border-dark-border rounded-xl max-w-[60px] animate-pulse">
      <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
    </div>
  );
}
