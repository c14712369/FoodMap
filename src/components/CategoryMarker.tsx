import React from 'react';
import { typeConfig } from '../constants/categories';
import { AVAILABLE_ICONS } from '../constants/categories';
import type { AvailableIconName } from '../constants/categories';

interface CategoryMarkerProps {
  type: string;
  customIconName?: AvailableIconName;
}

const CategoryMarker: React.FC<CategoryMarkerProps> = ({ type, customIconName }) => {
  const config = typeConfig[type] || typeConfig['預設'];
  const color = config.hex;

  // 決定要渲染的 Icon
  let IconComponent = config.icon;
  if (customIconName) {
    const found = AVAILABLE_ICONS.find(i => i.name === customIconName);
    if (found) IconComponent = found.icon;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        backgroundColor: color,
        border: '2.5px solid white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      }}>
        <IconComponent size={17} color="white" strokeWidth={2.5} />
      </div>
      <div style={{
        width: 0, height: 0, marginTop: -1,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `7px solid ${color}`,
      }} />
    </div>
  );
};

export default React.memo(CategoryMarker);
