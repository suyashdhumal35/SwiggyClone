import { useState } from 'react';

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    addresses: [
      {
        id: 1,
        type: 'Home',
        address: '123 Main St, Apt 4B, Bangalore, Karnataka 560001',
        isDefault: true
      },
      {
        id: 2,
        type: 'Work',
        address: '456 Tech Park, Sector 5, Bangalore, Karnataka 560034',
        isDefault: false
      }
    ],
    newAddress: {
      type: '',
      address: '',
      isDefault: false
    },
    preferences: {
      vegOnly: false,
      notification: true,
      newsletter: true
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('preferences.')) {
      const prefField = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefField]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      newAddress: {
        ...formData.newAddress,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    if (!formData.newAddress.type || !formData.newAddress.address) return;
    
    const newAddress = {
      id: Date.now(),
      ...formData.newAddress
    };
    
    // If setting as default, remove default from others
    const updatedAddresses = formData.newAddress.isDefault
      ? formData.addresses.map(addr => ({ ...addr, isDefault: false }))
      : [...formData.addresses];
    
    setFormData({
      ...formData,
      addresses: [...updatedAddresses, newAddress],
      newAddress: {
        type: '',
        address: '',
        isDefault: false
      }
    });
  };

  const setDefaultAddress = (id) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    });
  };

  const deleteAddress = (id) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter(addr => addr.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">My Profile</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'personal' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Details
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'addresses' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('addresses')}
        >
          My Addresses
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'preferences' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>
      
      {/* Personal Details Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <button
              type="submit"
              className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
      
      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
          
          <div className="space-y-4 mb-6">
            {formData.addresses.map(address => (
              <div key={address.id} className="border border-gray-200 p-4 rounded-lg relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!address.isDefault && (
                      <button 
                        onClick={() => setDefaultAddress(address.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAddress(address.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{address.address}</p>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-medium mb-3">Add New Address</h3>
          <form onSubmit={addNewAddress}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="addressType">
                Address Type
              </label>
              <select
                id="addressType"
                name="type"
                value={formData.newAddress.type}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select type</option>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="address">
                Complete Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.newAddress.address}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.newAddress.isDefault}
                onChange={handleAddressChange}
                className="mr-2"
              />
              <label htmlFor="isDefault" className="text-gray-700">
                Set as default address
              </label>
            </div>
            
            <button
              type="submit"
              className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700 transition duration-200"
            >
              Save Address
            </button>
          </form>
        </div>
      )}
      
      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Preferences</h2>
          <form>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="vegOnly"
                  name="preferences.vegOnly"
                  checked={formData.preferences.vegOnly}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="vegOnly" className="text-gray-700">
                  Show only vegetarian restaurants
                </label>
              </div>
              <p className="text-sm text-gray-500">When enabled, only vegetarian restaurants will be shown in search results</p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="notification"
                  name="preferences.notification"
                  checked={formData.preferences.notification}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="notification" className="text-gray-700">
                  Receive order notifications
                </label>
              </div>
              <p className="text-sm text-gray-500">Get real-time updates about your order status</p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="preferences.newsletter"
                  checked={formData.preferences.newsletter}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="newsletter" className="text-gray-700">
                  Subscribe to newsletter
                </label>
              </div>
              <p className="text-sm text-gray-500">Get updates about new restaurants and offers in your area</p>
            </div>
            
            <button
              type="submit"
              className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700 transition duration-200"
            >
              Save Preferences
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyProfile;