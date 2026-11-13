export default function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-neutral-900 rounded-sm overflow-hidden"
          style={{ height: `${260 + (index % 3) * 60}px` }}
        >
          <div className="w-full h-full bg-neutral-800/40" />
        </div>
      ))}
    </div>
  );
}
