import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaWallet, FaChartLine, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../public/logo.png";

export default function MerchantDashboard() {
  const [merchant, setMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const data = localStorage.getItem("merchant");
    if (data) setMerchant(JSON.parse(data));
  }, []);

  if (!merchant) return <p>Loading merchant data...</p>;

  const KPI_CARDS = [
    { label: "Total Revenue", value: "$0" },
    { label: "Total Transactions", value: "0" },
    { label: "Active Invoices", value: "0" },
    { label: "KYC Status", value: merchant.kycApproved ? "Approved" : "Pending" },
  ];

  const TABS = [
    { name: "dashboard", icon: <FaHome />, label: "Dashboard" },
    { name: "profile", icon: <FaUser />, label: "Profile" },
    { name: "payments", icon: <FaWallet />, label: "Payments" },
    { name: "analytics", icon: <FaChartLine />, label: "Analytics" },
    { name: "notifications", icon: <FaBell />, label: "Notifications" },
    { name: "settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <img src={logo} alt="Logo" className="h-12 mb-6 mx-auto" />
        <div className="flex-1">
          {TABS.map((tab) => (
            <div
              key={tab.name}
              className={`flex items-center space-x-3 mb-4 p-2 rounded cursor-pointer hover:bg-green-50 ${
                activeTab === tab.name ? "bg-green-100 font-bold" : ""
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon} <span>{tab.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-3 mt-6 cursor-pointer hover:text-red-600">
          <FaSignOutAlt /> <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">
          Welcome, {merchant.name}
        </h1>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {KPI_CARDS.map((card) => (
              <div key={card.label} className="bg-white p-6 rounded-xl shadow text-center">
                <div className="text-2xl font-bold text-green-600">{card.value}</div>
                <div className="mt-2 font-semibold text-gray-700">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-4">Profile Info</h2>
            <p><strong>Merchant Name:</strong> {merchant.name}</p>
            <p><strong>Business Name:</strong> {merchant.businessName}</p>
            <p><strong>Email:</strong> {merchant.email}</p>
            <p><strong>Wallet:</strong> {merchant.xpub}</p>
            <p><strong>API Key:</strong> {merchant.apiKey}</p>
          </div>
        )}

        {activeTab === "payments" && <div>Payments & Payouts Section</div>}
        {activeTab === "analytics" && <div>Analytics & Charts Section</div>}
        {activeTab === "notifications" && <div>Notifications Section</div>}
        {activeTab === "settings" && <div>Settings & API Section</div>}
      </main>
    </div>
  );
}
