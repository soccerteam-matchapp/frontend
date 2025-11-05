import { useState } from 'react';

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`ë¡œê·¸?¸ ?‹œ?„: ${id}`);
  };

  return (
    <div className="screen">
      <div className="statusbar" />

      <div className="hand">?Š¤?¬ì¸ ë?? ?†?‰½ê²?</div>

      <h1 className="brand">
        <span>S</span>
        <span className="dark">p</span>
        <span>o</span>
        <span className="dark">r</span>
        <span>t</span>
        <span className="dark">l</span>
        <span>y</span>
      </h1>
      <div className="sub-brand">?Š¤?¬ì¸¨ë¦¬</div>

      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span className="label">?•„?´?””</span>
          <div className="input-wrap">
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="?•„?´?””"
              autoComplete="username"
            />
            {id && (
              <button type="button" className="clear" onClick={() => setId('')}>
                Ã—
              </button>
            )}
          </div>
        </label>

        {/* ë¹„ë??ë²ˆí˜¸ */}
        <label className="field">
          <span className="label">ë¹„ë??ë²ˆí˜¸</span>
          <div className="input-wrap">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="ë¹„ë??ë²ˆí˜¸"
              autoComplete="current-password"
            />
            {pw && (
              <button type="button" className="clear" onClick={() => setPw('')}>
                Ã—
              </button>
            )}
          </div>
        </label>

        {/* ë¡œê·¸?¸ ë²„íŠ¼ */}
        <button className="primary-btn" type="submit" disabled={!id || !pw}>
          ë¡œê·¸?¸
        </button>
      </form>

      {/* ?šŒ?›ê°??ž… ë§í¬ */}
      <div className="switch-link">
        ?•„?´?””ê°? ?—†?œ¼?‹ ê°??š”? <a href="/signup">?šŒ?›ê°??ž…</a>
      </div>
    </div>
  );
}
