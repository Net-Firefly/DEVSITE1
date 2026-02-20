import { useState, useEffect } from "react";
import { Menu, X, Scissors, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoggingOut) {
      timer = setTimeout(() => {
        setIsLoggingOut(false);
      }, 30000);
    }
    return () => clearTimeout(timer);
  }, [isLoggingOut]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
    { name: "Quiz", path: "/quiz" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setShowLogoutConfirm(false);
    try {
      await Promise.resolve(logout());
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? "glass-card py-4" : "py-6"
        }`}
    >
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center min-h-screen">
          <div className="bg-card border border-border/50 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Logout</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-full border border-border hover:bg-accent text-sm font-body transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-body hover:bg-primary/90 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="xl" color="#d4a574" />
            <p className="text-foreground font-body text-lg">LOGGING OUT PLEASE WAIT</p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center group-hover:border-primary transition-colors duration-300 flex-shrink-0"
            >
              <Scissors className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-gold-gradient hidden sm:block">
                Tripple Kay
              </span>
              <span className="font-body text-xs text-muted-foreground hidden sm:block">
                CUTTS & SPA
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body transition-colors duration-300 relative group ${isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: isActive(link.path) ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold-glow px-6 py-2.5 rounded-full font-body font-semibold text-primary-foreground text-sm"
              >
                Book Now
              </motion.button>
            </Link>
            <Link to="/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm shadow-md"
              >
                Take Quiz
              </motion.button>
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{user?.name}</span>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full bg-accent text-foreground text-sm font-body"
                    >
                      Admin
                    </motion.button>
                  </Link>
                )}
                {user?.role !== 'admin' && (
                  <Link to="/my-bookings">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full border border-border hover:bg-accent text-sm font-body"
                    >
                      My Bookings
                    </motion.button>
                  </Link>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut || showLogoutConfirm}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-border hover:bg-accent text-sm font-body disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full border border-border hover:bg-accent text-sm font-body"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-accent text-foreground font-body text-sm"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-6 pb-6 border-t border-border/50 pt-6 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`font-body text-lg transition-colors block ${isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link to="/contact">
                    <button className="btn-gold-glow px-6 py-3 rounded-full font-body font-semibold text-primary-foreground w-full mt-4">
                      Book Now
                    </button>
                  </Link>
                </motion.div>

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{user?.name}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {user?.role === 'admin' && (
                        <Link to="/admin">
                          <button className="w-full px-6 py-3 rounded-full bg-accent text-foreground font-body">
                            Admin Dashboard
                          </button>
                        </Link>
                      )}
                      {user?.role !== 'admin' && (
                        <Link to="/my-bookings">
                          <button className="w-full px-6 py-3 rounded-full border border-border hover:bg-accent font-body">
                            My Bookings
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut || showLogoutConfirm}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-border hover:bg-accent font-body disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    className="flex gap-2 mt-4"
                  >
                    <Link to="/login" className="flex-1">
                      <button className="w-full px-6 py-3 rounded-full border border-border hover:bg-accent font-body">
                        Login
                      </button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <button className="w-full px-6 py-3 rounded-full bg-accent text-foreground font-body">
                        Sign Up
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;

