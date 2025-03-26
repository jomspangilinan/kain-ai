const Header = () => {
    return (
      <header className="relative bg-gradient-to-r from-green-500 to-green-700 text-white pb-12">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-500 to-green-700 clip-header"></div>
        <div className="relative z-10 flex items-center justify-center px-4 py-4">
          {/* App Name */}
          <h1 className="text-2xl font-bold">Kali</h1>
        </div>
      </header>
    );
  };
  
  export default Header;