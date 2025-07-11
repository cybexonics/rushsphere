
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X,ChevronDown,User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useAuth } from "@/context/AuthProvider"
import { useCart } from "@/context/CartProvider"
import { getData } from "@/lib/getData"
import axios from 'axios'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [categories,setCategories] = useState([])
  const navigate = useNavigate();
  const { user,vendor } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
  console.log("isVenode",vendor)
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
  const fetchCategories = async () => {
  try {
    const response = await axios.get('https://rushsphere.onrender.com/api/categories?populate=subcategories');
    const formatted = response?.data?.data.map(cat => {
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image, // optional, if you need it
        subcategories: cat.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug
        }))
      };
    });
    console.log("formmted:",formatted)
    setCategories(formatted);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};


  fetchCategories();
}, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { // Use the 'search' state variable
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/products'); // Navigate to base products page if search input is empty
    }
    setIsMenuOpen(false); // Close mobile menu after search (optional, but good UX)
  };


  // Define category menu structure
 

  return (
    <header 
      className={`w-full bg-white fixed top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              RushSphere
            </span>
            <span>Buy it & Feel it </span>
          </Link>
          
          {/* Desktop Search */}
           <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full">
              <Input
                type="text"
                value={search} // Bind to the 'search' state
                onChange={(e) => setSearch(e.target.value)} // Update the 'search' state
                placeholder="Search for products..."
                className="w-full pr-10 border-slate-300 focus:border-indigo-500 rounded-l-lg"
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 h-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-none rounded-r-lg"
              >
                <Search size={18} />
              </Button>
            </div>
          </form>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
          {!user &&(
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-indigo-700"
            >
              Customer Login
            </Button>
            )}
            <Button
              onClick={() => navigate('/vendor-register')}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Become a Seller
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            </Button>
            {(user || vendor) && (
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
    if (vendor) {
      navigate('/vendor');
    } else if (user) {
      navigate('/profile');
    }
  }}
        >
          <User size={25} />
        </Button>
      )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Search (always visible) */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-l-lg border-slate-300"
            />
            <Button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-none rounded-r-lg"
            >
              <Search size={18} />
            </Button>
          </form>
        </div>
        
        {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="md:hidden mt-3 py-4 border-t border-slate-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Button variant="ghost" className="justify-start px-2 py-3 hover:bg-slate-100 hover:text-indigo-700" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                Customer Login
              </Button>
              <Button className="justify-start px-2 py-3 bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { navigate('/vendor-register'); setIsMenuOpen(false); }}>
                Become a Seller
              </Button>
              <Button variant="ghost" className="justify-start px-2 py-3 hover:bg-slate-100" onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}>
                Cart ({cart.length})
              </Button>
               {(user || vendor) && (
                    <Button variant="ghost" className="justify-start px-2 py-3 hover:bg-slate-100" onClick={() => {
                if (vendor) {
                  navigate('/vendor');
                } else if (user) {
                  navigate('/profile');
                }
                setIsMenuOpen(false);
              }}>
                My Account
              </Button>
      )}
             

              <div className="py-3 border-t border-slate-200">
                <h3 className="font-semibold mb-2 px-2">Categories</h3>
                {categories.map((category, index) => {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div key={index}>
      <button
        className="w-full flex justify-between items-center px-3 py-2 text-left font-medium hover:bg-slate-100"
        onClick={() => {
          if (hasSubcategories) {
            setExpandedCategory(expandedCategory === index ? null : index);
          }
        }}
      >
        {category.name}
        {hasSubcategories && (
          <ChevronDown
            size={18}
            className={
              expandedCategory === index
                ? 'rotate-180 transition-transform'
                : 'transition-transform'
            }
          />
        )}
      </button>

      {expandedCategory === index && hasSubcategories && (
        <div className="pl-5 pb-2">
          {category.subcategories.map((subcategory, idx) => (
            <button
              key={idx}
              className="block w-full text-left py-1 px-2 text-sm hover:text-indigo-600"
              onClick={() => {
                navigate(`/category/${category.slug}/${subcategory.slug}`);
                setIsMenuOpen(false);
              }}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
})}

              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Categories Navigation Menu */}
        <div className="hidden md:block border-b border-slate-200 pt-3">
        <div className="hidden md:flex space-x-6 pt-3 border-b border-slate-200 flex items-center justify-center space-x-8">
  {categories.map((category, idx) => {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div key={idx} className="relative group">
      <Link to={`/category/${category.slug}`}>
      <button className="text-slate-700 hover:text-indigo-600 font-medium py-2" >
        {category.name}
      </button>
      </Link>

      {/* Dropdown menu only if subcategories exist */}
      {hasSubcategories && (
        <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md border border-slate-200 min-w-[200px] z-50">
          <ul className="py-2">
            {category.subcategories.map((subcategory, subIdx) => (
              <li key={subIdx}>
                <Link
                  to={`/category/${category.slug}/${subcategory.slug}`}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
                >
                  {subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
})}

</div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
