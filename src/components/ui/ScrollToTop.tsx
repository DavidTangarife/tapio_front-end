// Import necessary hooks from React and React Router
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define a functional component named ScrollToTop
const ScrollToTop = () => {
  // Extract the current pathname from the location object
  const { pathname } = useLocation();

  // useEffect hook to perform side effects
  useEffect(() => {
    // Scroll the window to the top whenever the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]); // The effect runs whenever 'pathname' changes

  // The component doesn't render any visible UI, so it returns null
  return null;
};

// Export the ScrollToTop component as the default export
export default ScrollToTop;