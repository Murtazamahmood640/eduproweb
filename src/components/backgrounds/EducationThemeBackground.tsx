'use client';

import React, { useEffect, useRef } from 'react';

export const EducationThemeBackground = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Create animated book icons
    const createBook = (x: number, y: number, delay: number) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      g.setAttribute('opacity', '0.15');

      const book = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      book.setAttribute(
        'd',
        'M4 2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'
      );
      book.setAttribute('fill', 'none');
      book.setAttribute('stroke', '#003366');
      book.setAttribute('stroke-width', '1.5');

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '9');
      line.setAttribute('y1', '2');
      line.setAttribute('x2', '9');
      line.setAttribute('y2', '16');
      line.setAttribute('stroke', '#003366');
      line.setAttribute('stroke-width', '1.5');

      g.appendChild(book);
      g.appendChild(line);

      // Animate book
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
      animate.setAttribute('attributeName', 'transform');
      animate.setAttribute('type', 'translate');
      animate.setAttribute('values', `${x},${y}; ${x},${y - 20}; ${x},${y}`);
      animate.setAttribute('dur', '6s');
      animate.setAttribute('begin', `${delay}s`);
      animate.setAttribute('repeatCount', 'indefinite');
      animate.setAttribute('additive', 'sum');

      g.appendChild(animate);
      svg.appendChild(g);
    };

    // Create graduation caps
    const createGraduationCap = (x: number, y: number, delay: number) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      g.setAttribute('opacity', '0.12');

      const cap = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cap.setAttribute('d', 'M12 4L4 8v3c0 2.2 4 4 8 4s8-1.8 8-4V8l-8-4z');
      cap.setAttribute('fill', 'none');
      cap.setAttribute('stroke', '#0066cc');
      cap.setAttribute('stroke-width', '1.2');

      const tassel = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tassel.setAttribute('x1', '12');
      tassel.setAttribute('y1', '11');
      tassel.setAttribute('x2', '12');
      tassel.setAttribute('y2', '18');
      tassel.setAttribute('stroke', '#0066cc');
      tassel.setAttribute('stroke-width', '1.2');

      g.appendChild(cap);
      g.appendChild(tassel);

      // Animate cap
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
      animate.setAttribute('attributeName', 'transform');
      animate.setAttribute('type', 'translate');
      animate.setAttribute('values', `${x},${y}; ${x},${y - 25}; ${x},${y}`);
      animate.setAttribute('dur', '8s');
      animate.setAttribute('begin', `${delay}s`);
      animate.setAttribute('repeatCount', 'indefinite');
      animate.setAttribute('additive', 'sum');

      g.appendChild(animate);
      svg.appendChild(g);
    };

    // Add elements
    createBook(150, 100, 0);
    createBook(300, 200, 1);
    createBook(400, 150, 0.5);
    createBook(550, 250, 1.5);
    createBook(700, 100, 0.8);

    createGraduationCap(200, 300, 0.3);
    createGraduationCap(450, 350, 1.2);
    createGraduationCap(600, 280, 0.7);

  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
