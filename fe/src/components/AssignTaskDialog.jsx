import React, { useState, useEffect } from 'react';
import { fetchUsers, searchUsers, assignEndpoint, assignDatabaseChange, assignComponent } from '../api';

const AssignTaskDialog = ({ isOpen, onClose, onAssign, itemId, itemType }) => {
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setAssignee(value);
    setSelectedUser(null);
    
    if (value.trim() === '') {
      setFilteredUsers([]);
      setShowDropdown(false);
    } else {
      try {
        // If the search query is short, filter locally
        if (value.length < 3) {
          const filtered = users.filter(user => 
            user.name.toLowerCase().includes(value.toLowerCase()) || 
            user.email.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredUsers(filtered);
        } else {
          // Otherwise, search from the API
          const searchResults = await searchUsers(value);
          setFilteredUsers(searchResults);
        }
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  };

  const handleSelectUser = (user) => {
    setAssignee(user.name);
    setSelectedUser(user);
    setFilteredUsers([]);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignee.trim() || !selectedUser) return;

    try {
      // Call the appropriate assignment function based on item type
      let result;
      
      if (itemType === 'endpoint') {
        result = await assignEndpoint(itemId, selectedUser._id);
      } else if (itemType === 'databaseChange') {
        result = await assignDatabaseChange(itemId, selectedUser._id);
      } else if (itemType === 'component') {
        result = await assignComponent(itemId, selectedUser._id);
      }
      
      if (onAssign) {
        onAssign(selectedUser, itemId, itemType, result);
      }
      
      setAssignee('');
      setSelectedUser(null);
      onClose();
    } catch (error) {
      console.error(`Error assigning ${itemType}:`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Assign Task</h3>
          <p className="text-sm text-gray-500">
            {itemType === 'endpoint' ? 'API Endpoint' : 
             itemType === 'component' ? 'Component' : 
             'Database Change'} will be assigned to the selected user
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={assignee}
              onChange={handleInputChange}
              placeholder="Search users..."
              autoComplete="off"
            />
            
            {loading && (
              <div className="absolute right-3 top-9">
                <span className="loading loading-spinner loading-xs"></span>
              </div>
            )}
            
            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {filteredUsers.map(user => (
                    <li 
                      key={user._id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center">
                        {user.avatar ? (
                          <div className="w-6 h-6 rounded-full bg-blue-500 mr-2 text-white text-xs flex items-center justify-center overflow-hidden">
                            <img src={`/uploads/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-500 mr-2 text-white text-xs flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={!selectedUser}
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskDialog;