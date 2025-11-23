"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Clock,
  Users,
  Building2,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

export default function Recurring() {
  const [showAddModal, setShowAddModal] = useState(false);

  const recurringPayments = [
    {
      id: 1,
      type: "salary",
      recipient: "John Doe",
      email: "john@company.com",
      amount: "0.1500 BCH",
      frequency: "Monthly",
      nextPayment: "Jan 1, 2025",
      icon: Users,
      color: "#3B82F6",
      active: true,
    },
    {
      id: 2,
      type: "salary",
      recipient: "Jane Smith",
      email: "jane@company.com",
      amount: "0.1800 BCH",
      frequency: "Monthly",
      nextPayment: "Jan 1, 2025",
      icon: Users,
      color: "#3B82F6",
      active: true,
    },
    {
      id: 3,
      type: "supplier",
      recipient: "ABC Corp",
      email: "billing@abccorp.com",
      amount: "0.5000 BCH",
      frequency: "Weekly",
      nextPayment: "Dec 28, 2024",
      icon: Building2,
      color: "#8B5CF6",
      active: true,
    },
    {
      id: 4,
      type: "subscription",
      recipient: "Cloud Services",
      email: "billing@cloudco.com",
      amount: "0.0250 BCH",
      frequency: "Monthly",
      nextPayment: "Jan 15, 2025",
      icon: Calendar,
      color: "#10B981",
      active: false,
    },
  ];

  const stats = [
    { label: "Active Payments", value: "12", color: "#3B82F6" },
    { label: "Monthly Total", value: "2.45 BCH", color: "#8B5CF6" },
    { label: "Next Payment", value: "2 days", color: "#10B981" },
    { label: "Total Scheduled", value: "15.2 BCH", color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1A3D64] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </a>
              <div>
                <h1 className="text-3xl font-bold">Recurring Payments</h1>
                <p className="text-blue-200">Automated Payment Scheduling</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Add Payment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center mb-3">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: stat.color }}
                />
                <h3 className="text-sm font-medium text-gray-500">
                  {stat.label}
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Scheduled Payments
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recurringPayments.map((payment) => {
              const Icon = payment.icon;
              return (
                <div
                  key={payment.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${payment.color}15` }}
                      >
                        <Icon size={24} style={{ color: payment.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {payment.recipient}
                        </h3>
                        <p className="text-sm text-gray-500">{payment.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {payment.frequency}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              payment.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {payment.active ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#1A3D64]">
                          {payment.amount}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          <span>Next: {payment.nextPayment}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-8 bg-[#EFF6FF] border border-[#1A3D64] rounded-xl p-6">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-[#1A3D64] rounded-full flex items-center justify-center mr-4 mt-0.5">
              <Clock size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A3D64] mb-2">
                Automated & Secure
              </h3>
              <p className="text-sm text-gray-600">
                All recurring payments are executed automatically by smart
                contracts. No manual intervention needed. Payments are made from
                your vault balance at the scheduled times and can be paused or
                modified at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddModal(false)}
            />

            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Add Recurring Payment
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3D64] focus:border-[#1A3D64]">
                    <option>Salary</option>
                    <option>Supplier</option>
                    <option>Subscription</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3D64] focus:border-[#1A3D64]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BCH Address
                  </label>
                  <input
                    type="text"
                    placeholder="bitcoincash:qp..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3D64] focus:border-[#1A3D64] font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (BCH)
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3D64] focus:border-[#1A3D64]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3D64] focus:border-[#1A3D64]">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#1A3D64] text-white rounded-lg hover:bg-[#2A4D74] transition-colors"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
