import React, { useState } from 'react';
import { Folder, File, ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import MockupScreengrabs from './MockupScreengrabs';
import { 
  createComponent, 
  deleteComponent, 
  addChildComponent,
  deleteChildComponent 
} from '../api';

const ComponentTreeView = ({ components, selectingComponents, onSelect, onAddChild }) => {
  const [expandedComponents, setExpandedComponents] = useState({});

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedComponents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderComponentTree = (component, level = 0) => {
    const isExpanded = expandedComponents[component._id] !== false;
    const hasChildren = component.children && component.children.length > 0;
    
    return (
      <li key={component._id} className="mb-1">
        <div className="flex items-center p-1 hover:bg-gray-50 rounded">
          {selectingComponents && (
            <input 
              type="checkbox" 
              className="checkbox checkbox-sm mr-2" 
              onChange={() => onSelect(component._id)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          {hasChildren && (
            <button 
              className="mr-1 focus:outline-none"
              onClick={(e) => toggleExpand(component._id, e)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          {!hasChildren && <span className="w-5"></span>}
          
          {component.type === 'context' || component.type === 'provider' ? (
            <Folder size={16} className="mr-1 text-blue-500" />
          ) : (
            <File size={16} className="mr-1 text-gray-500" />
          )}
          
          <span className="font-medium">{component.name}</span>
          
          {(component.type === 'context' || component.type === 'provider') && !selectingComponents && (
            <button 
              className="ml-2 text-gray-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(component._id);
              }}
            >
              <Plus size={14} />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <ul className="list-none pl-6 mt-1">
            {component.children.map(child => renderComponentTree(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul className="list-none">
      {components.map(component => renderComponentTree(component))}
    </ul>
  );
};

const EnhancedComponentsList = ({ components, endpoints, onComponentsChange }) => {
  const [selectingComponents, setSelectingComponents] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: 'component'
  });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [error, setError] = useState('');
  
  const handleSelect = (id) => {
    setSelectedComponents(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAddComponent = async () => {
    if (!newComponent.name) {
      setError('Component name is required');
      return;
    }

    try {
      if (selectedParentId) {
        // Adding child component
        const updatedParent = await addChildComponent(selectedParentId, newComponent);
        // Update the components list to reflect the changes
        if (onComponentsChange) {
          onComponentsChange(components.map(comp => 
            comp._id === selectedParentId ? updatedParent : comp
          ));
        }
      } else {
        // Adding root component
        const newComp = await createComponent(newComponent);
        if (onComponentsChange) {
          onComponentsChange([...components, newComp]);
        }
      }
      
      // Reset form
      setNewComponent({ name: '', type: 'component' });
      setIsAddingComponent(false);
      setSelectedParentId(null);
      setError('');
    } catch (err) {
      console.error('Error adding component:', err);
      setError('Failed to add component');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedComponents.length === 0) return;
    
    try {
      // Process all selected components
      const deletePromises = selectedComponents.map(async (id) => {
        // Check if this is a root component or a child component
        const isRoot = components.some(comp => comp._id === id);
        
        if (isRoot) {
          // Delete root component
          await deleteComponent(id);
          return { id, isRoot: true };
        } else {
          // Find the parent component that contains this child
          for (const comp of components) {
            if (comp.children && comp.children.some(child => child._id === id)) {
              await deleteChildComponent(comp._id, id);
              return { id, isRoot: false, parentId: comp._id };
            }
            
            // Check nested children (for components that might be nested deeply)
            if (comp.children) {
              for (const child of comp.children) {
                if (child.children && child.children.some(grandchild => grandchild._id === id)) {
                  await deleteChildComponent(child._id, id);
                  return { id, isRoot: false, parentId: child._id };
                }
              }
            }
          }
        }
      });
      
      await Promise.all(deletePromises);
      
      // Update components state by refetching or filtering out deleted components
      if (onComponentsChange) {
        // For simplicity, we'll just refetch all components
        // In a real app, you might want to update the state more efficiently
        onComponentsChange(components.filter(comp => !selectedComponents.includes(comp._id)));
      }
      
      // Clear selection
      setSelectedComponents([]);
      setSelectingComponents(false);
    } catch (err) {
      console.error('Error deleting components:', err);
      setError('Failed to delete selected components');
    }
  };

  const handleAddButtonClick = (parentId = null) => {
    setSelectedParentId(parentId);
    setIsAddingComponent(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-md font-medium">Components</h3>
          <div className="flex items-center">
            <button 
              className={`btn btn-sm ${selectingComponents ? 'btn-error' : 'btn-ghost'}`}
              onClick={() => setSelectingComponents(!selectingComponents)}
            >
              {selectingComponents ? 'Cancel' : 'Select'}
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded overflow-auto" style={{ maxHeight: '400px' }}>
          {components.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No components available</div>
          ) : (
            <ComponentTreeView 
              components={components} 
              selectingComponents={selectingComponents}
              onSelect={handleSelect}
              onAddChild={handleAddButtonClick}
            />
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
        
        {isAddingComponent && (
          <div className="mt-2 border border-gray-200 rounded p-3">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Component Name:
              </label>
              <input 
                type="text" 
                className="input input-sm input-bordered w-full"
                value={newComponent.name}
                onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                placeholder="Enter component name"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Type:
              </label>
              <select 
                className="select select-sm select-bordered w-full"
                value={newComponent.type}
                onChange={(e) => setNewComponent({...newComponent, type: e.target.value})}
              >
                <option value="component">Component</option>
                <option value="context">Context</option>
                <option value="provider">Provider</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setIsAddingComponent(false);
                  setError('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleAddComponent}
              >
                Add Component
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex space-x-2">
          <button 
            className="btn btn-sm btn-outline btn-error flex-1" 
            disabled={!selectingComponents || selectedComponents.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </button>
          <button 
            className="btn btn-sm btn-outline btn-primary flex-1"
            onClick={() => handleAddButtonClick()}
          >
            <Plus size={14} className="mr-1" /> Add
          </button>
        </div>
      </div>
      
      <div className="col-span-1">
        <MockupScreengrabs />
      </div>
    </div>
  );
};

export default EnhancedComponentsList;