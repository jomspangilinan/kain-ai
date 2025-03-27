import { FaFire, FaShareAlt } from 'react-icons/fa'; // Import icons from react-icons
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-green-500 to-green-700 text-white pb-12">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-500 to-green-700 clip-header"></div>
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        {/* Streak Icon */}
        <NavLink to="/streak" className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-white-500'} hover:text-orange-600`}>
          <div className="flex items-center">
            <FaFire className="text-xl mr-2" />
          </div>
        </NavLink>


        {/* App Name */}
        <h1 className="text-2xl font-bold">Kali</h1>

        {/* Share Icon */}
        <NavLink to="/share" className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-white-500'} hover:text-orange-600`}>
          <div className="flex items-center">
            <FaShareAlt className="text-xl" />
          </div>
        </NavLink>
      </div>
    </header >
  );
};

export default Header;