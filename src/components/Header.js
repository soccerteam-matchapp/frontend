export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      <h2 className="brand">
        <span>S</span>
        <span className="dark">p</span>
        <span>o</span>
        <span className="dark">r</span>
        <span>t</span>
        <span className="dark">l</span>
        <span>y</span>
      </h2>{' '}
      <span style={{ fontSize: '1.3rem' }}>🔔</span>
    </header>
  );
}
