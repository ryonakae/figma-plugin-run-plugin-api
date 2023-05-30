import { Global, css } from '@emotion/react';
import React from 'react';

function resizeWindow(e: MouseEvent) {
  const size = {
    width: Math.max(50, Math.floor(e.clientX + 5)),
    height: Math.max(50, Math.floor(e.clientY + 5)),
  };

  parent.postMessage({ pluginMessage: { type: 'resize', size: size } }, '*');
}

const Corner: React.FC = () => {

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.onpointermove = resizeWindow;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.onpointermove = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  <svg id="corner" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0V16H0L16 0Z" fill="white"/>
    <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C"/>
    <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C"/>
  </svg>

  return (
    <>
      <Global
        styles={css`
        * {
          overflow: hidden;
        }
        #corner{
          position: fixed;
          right: 1px;
          bottom: 2px;
          cursor: nwse-resize;
        }
        `}
      />
    <div id='corner' onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0V16H0L16 0Z" fill="white"/>
        <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#b5b5b5"/>
        <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#a5a5a5"/>
      </svg>
    </div>
  </>);
};

export default Corner;
