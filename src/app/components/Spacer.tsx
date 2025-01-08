import React from 'react';

interface SpacerProps {
  children: React.ReactNode;
}

const Spacer: React.FC<SpacerProps> = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-1/6 hidden lg:block"></div>
      <div className="w-full lg:w-4/6">
        {children}
      </div>
      <div className="w-1/6 hidden lg:block"></div>
    </div>
  );
};

export default Spacer;
