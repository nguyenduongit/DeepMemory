import React from 'react';
import {
  Hash,
  Flag,
  Map,
  Landmark,
  Globe,
  Atom,
  Sun,
  Languages,
  Club,
  Castle,
  Brain,
  HelpCircle,
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name.toLowerCase()) {
    case 'hash':
    case 'numbers':
      return <Hash className={className} />;
    case 'flag':
      return <Flag className={className} />;
    case 'map':
      return <Map className={className} />;
    case 'landmark':
      return <Landmark className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'atom':
      return <Atom className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'languages':
      return <Languages className={className} />;
    case 'club':
      return <Club className={className} />;
    case 'castle':
      return <Castle className={className} />;
    case 'brain':
      return <Brain className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
