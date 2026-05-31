export default function OurAppPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 80px)', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/our.html?embedded=1"
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
