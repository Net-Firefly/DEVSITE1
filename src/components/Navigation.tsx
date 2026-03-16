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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"}`}
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
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl border px-4 sm:px-5 py-3 transition-all duration-300 ${isScrolled
              ? "bg-card/90 backdrop-blur-xl border-primary/25 shadow-2xl"
              : "bg-card/70 backdrop-blur-lg border-border/40"
            }`}
          style={{ boxShadow: "0 0 40px rgba(255, 193, 77, 0.15)" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.04 }}
              transition={{ duration: 0.25 }}
              className="w-10 h-10 rounded-full border border-primary/60 bg-primary/10 flex items-center justify-center group-hover:border-primary transition-colors duration-300 flex-shrink-0"
            >
              <Scissors className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base lg:text-lg font-bold text-gold-gradient">
                Tripple Kay
              </span>
              <span className="font-body text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                CUTTS & SPA
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative ${isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold-glow px-5 py-2.5 rounded-full font-body font-semibold text-primary-foreground text-sm"
              >
                Book Now
              </motion.button>
            </Link>
            <Link to="/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary font-body text-sm"
              >
                Take Quiz
              </motion.button>
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border/60">
                <div className="hidden xl:flex items-center gap-2 text-sm px-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground max-w-[130px] truncate">{user?.name}</span>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full bg-accent text-foreground text-sm font-body border border-border/60"
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
                      className="px-4 py-2 rounded-full border border-border hover:bg-accent/60 text-sm font-body"
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
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-border hover:bg-accent/60 text-sm font-body disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border/60">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full border border-border hover:bg-accent/60 text-sm font-body"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-accent text-foreground font-body text-sm border border-border/60"
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
            className="md:hidden w-10 h-10 rounded-full border border-border/70 bg-background/40 flex items-center justify-center text-foreground"
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
              className="md:hidden mt-3 overflow-hidden rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl px-4 py-4 shadow-xl"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`font-body text-base px-3 py-2 rounded-xl transition-colors block ${isActive(link.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-accent/50"}`}
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
                    <button className="btn-gold-glow px-6 py-3 rounded-full font-body font-semibold text-primary-foreground w-full mt-3">
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
                    className="mt-3 pt-3 border-t border-border/50"
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
                    className="flex gap-2 mt-3"
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

