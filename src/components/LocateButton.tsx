import React from 'react';
import { LocateFixed } from 'lucide-react';

interface LocateButtonProps {
  onClick: () => void;
}

const LocateButton: React.FC<LocateButtonProps> = ({ onClick }) => {
  return (
    <div className="absolute bottom-36 right-4 z-40">
      <button
        onClick={onClick}
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl active:scale-95 transition-all duration-200 hover:text-indigo-300"
        title="定位到目前位置"
      >
        <LocateFixed className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LocateButton;
