export default function OurAppPage() {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <iframe
        src="/our.html?embedded=1"
        style={{
          width: '100%',
          height: 'calc(100vh - 80px)',
          border: 'none',
          display: 'block',
        }}
        title="Adyapan Smart Learning Ecosystem"
      />
    </div>
  );
}
