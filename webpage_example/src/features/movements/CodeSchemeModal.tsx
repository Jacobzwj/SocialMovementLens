import React from 'react';
import { X } from 'lucide-react';
import './CodeSchemeModal.css';

interface CodeSchemeModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const CodeSchemeModal: React.FC<CodeSchemeModalProps> = ({ title, content, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Code Scheme: {title}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <pre className="scheme-text">{content}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSchemeModal;
