import React from 'react';
import { X } from 'lucide-react';
import './CodeSchemeModal.css';

interface CodeSchemeModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const CodeSchemeModal: React.FC<CodeSchemeModalProps> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Code Scheme Definition</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <h4 className="scheme-title">{title}</h4>
          <div className="scheme-text">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSchemeModal;
