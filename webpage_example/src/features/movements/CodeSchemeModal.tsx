import React from 'react';
import { X } from 'lucide-react';
import './CodeSchemeModal.css';

interface CodeSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const CodeSchemeModal: React.FC<CodeSchemeModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <pre className="modal-text">{content}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSchemeModal;
