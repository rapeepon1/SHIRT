const NavItem = ({ label, isActive, onClick, className = "" }) => (
  <div
    className={`nav-item-custom ${isActive ? "active" : ""} ${className}`}
    onClick={onClick}
  >
    {label}
  </div>
);

export default NavItem;
