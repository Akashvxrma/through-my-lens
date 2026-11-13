export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full min-h-screen bg-[#0A0A0B] text-[#F4F3EF]">
      {children}
    </div>
  );
}
