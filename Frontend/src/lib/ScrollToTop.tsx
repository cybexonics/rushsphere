import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Use useLayoutEffect for immediate effect before browser paints
  // or useEffect if you don't mind a slight flicker on very fast navigations
  useLayoutEffect(() => {
    // window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
    // For smooth scrolling, use:
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]); // Re-run this effect whenever the pathname changes

  return null; // This component doesn't render anything visible
};

export default ScrollToTop;
