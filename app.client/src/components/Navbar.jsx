import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/customers">Customers</Link>
      <Link to="/products">Products</Link>
      <Link to="/stores">Stores</Link>
      <Link to="/sales">Sales</Link>
    </nav>
  );
}

export default Navbar;
