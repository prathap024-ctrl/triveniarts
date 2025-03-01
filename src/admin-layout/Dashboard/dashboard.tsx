import { useState } from "react";
import {
  FiHome,
  FiUser,
  FiMapPin,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiPackage,
} from "react-icons/fi";


import AddProduct from "../AddProducts/AddProducts";
import DisplayProducts from "../ProductList/DisplayProducts";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const navItems = [
    { icon: <FiHome />, label: "Dashboard", id: "dashboard" },
    { icon: <FiUser />, label: "User Info", id: "user" },
    { icon: <FiMapPin />, label: "Orders", id: "orders" },
    { icon: <FiPackage />, label: "Inventory", id: "inventory" },
    { icon: <FiShoppingBag />, label: "Add Products", id: "addproducts" },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
    </div>
  );

  const renderUsersInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Users Info</h2>
    </div>
  );

  const renderAddProducts = () => (
    <div className="bg-white p-6 rounded-none shadow-md">
      <AddProduct />
    </div>
  );
  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory</h2>
      <DisplayProducts />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "user":
        return renderUsersInfo();
      case "orders":
        return renderOrders();
      case "inventory":
        return renderInventory();
      case "addproducts":
        return renderAddProducts();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-auto bg-gray-50"> 
      <div className="md:hidden bg-white p-4 shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-[#521635]"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex">
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 h-screen w-64 bg-white transition-transform duration-300 ease-in-out z-50 md:z-auto lg:z-auto`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#521635]">
              Triveni Arts Dashboard
            </h1>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-[#521635] hover:text-white transition-colors ${
                  activeSection === item.id ? "bg-[#521635] text-white" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
