export default function ZGridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[15] overflow-hidden [perspective:1200px]">
      <div className="zgrid-plane" />
    </div>
  );
}