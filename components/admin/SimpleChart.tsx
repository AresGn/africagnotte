'use client';

import { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title: string;
  type?: 'pie' | 'donut';
}

export default function SimpleChart({ data, title, type = 'donut' }: SimpleChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculer les angles pour le graphique en secteurs
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      index
    };
  });

  // Créer le path SVG pour chaque segment
  const createPath = (startAngle: number, endAngle: number, innerRadius = 0) => {
    const centerX = 100;
    const centerY = 100;
    const outerRadius = 80;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    if (type === 'donut' && innerRadius > 0) {
      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = centerY + innerRadius * Math.sin(startAngleRad);
      
      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    } else {
      return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Graphique SVG */}
          <svg width="200" height="200" className="transform -rotate-90">
            {segments.map((segment) => (
              <path
                key={segment.index}
                d={createPath(segment.startAngle, segment.endAngle, type === 'donut' ? 40 : 0)}
                fill={segment.color}
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredIndex === segment.index ? 'opacity-80 transform scale-105' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>
          
          {/* Centre du donut avec total */}
          {type === 'donut' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Légende */}
        <div className="ml-8 space-y-2">
          {segments.map((segment) => (
            <div
              key={segment.index}
              className={`flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                hoveredIndex === segment.index ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{segment.label}</div>
                <div className="text-xs text-gray-500">
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
