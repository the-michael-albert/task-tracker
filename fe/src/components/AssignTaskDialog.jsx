import React, { useState } from 'react';

const AssignTaskDialog = ({ isOpen, onClose, onAssign }) => {
  const [assignee, setAssignee] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(assignee);
    setAssignee('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-72">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Assign Task</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Assignee</label>
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
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
            >
              Ok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskDialog;