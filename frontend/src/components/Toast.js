import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const toastVariant = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 }
};

export default function Toast({ messages = [], onClose }) {
  if (!messages || messages.length === 0) return null;
  return (
    <div style={styles.container} aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={toastVariant}
            transition={{ duration: 0.18 }}
            style={{
              ...styles.toast,
              background: m.type === 'error' ? '#fff6f6' : m.type === 'success' ? '#f0fff4' : '#f4f8ff',
              borderColor: m.type === 'error' ? '#ffd7d9' : m.type === 'success' ? '#c8f6d4' : '#cfe3ff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{m.title || (m.type === 'error' ? 'Error' : 'Notice')}</div>
                <div style={{ fontSize: 14 }}>{m.body || m.message}</div>
              </div>
              <div style={{ marginLeft: 8 }}>
                <button onClick={() => onClose && onClose(i)} style={styles.btn}>✕</button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    right: 20,
    top: 20,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 360,
  },
  toast: {
    padding: 14,
    borderRadius: 12,
    border: '1px solid #ddd',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
  },
  btn: {
    background: 'transparent',
    border: 'none',
    color: '#0066cc',
    cursor: 'pointer',
    fontWeight: 700
  }
};
