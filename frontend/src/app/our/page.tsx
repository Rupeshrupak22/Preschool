export default function OurAppPage() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/our.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="Adyapan Smart Learning Ecosystem"
      />
    </div>
  );
}
