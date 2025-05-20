import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronDown, ChevronRight, Trash2, Plus, Check, Info, Edit } from 'lucide-react';
import ImageGallery from './ImageGallery';
import { 
  createComponent, 
  deleteComponent, 
  addChildComponent,
  deleteChildComponent,
  fetchFeatureImages,
  uploadImage,
  deleteImage,
  toggleComponentCompletion,
  toggleChildComponentCompletion,
  updateComponent
} from '../api';
import { useFeatures } from '../context/FeatureContext';


const ComponentTreeView = ({ components, selectingComponents, onSelect, onAddChild, onToggleCompletion, onToggleChildCompletion, onEdit }) => {
  const [expandedComponents, setExpandedComponents] = useState({});
  const [showDescription, setShowDescription] = useState({});

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedComponents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleInfoClick = (id, e) => {
    e.stopPropagation();
    setShowDescription(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderComponentTree = (component, level = 0, parentId = null) => {
    const isExpanded = expandedComponents[component._id] !== false;
    const hasChildren = component.children && component.children.length > 0;
    const showComponentDesc = showDescription[component._id];
    
    return (
      <li key={component._id} className="mb-1">
        <div className={`flex items-center p-1 hover:bg-gray-50 rounded ${component.completed ? 'bg-green-50' : ''}`}>
          {selectingComponents && (
            <input 
              type="checkbox" 
              className="checkbox checkbox-sm mr-2" 
              onChange={() => onSelect(component._id)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          {!selectingComponents && (
            <button 
              className={`mr-2 ${component.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-500'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (parentId) {
                  onToggleChildCompletion(parentId, component._id);
                } else {
                  onToggleCompletion(component._id);
                }
              }}
            >
              {component.completed ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
              )}
            </button>
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
          
          <span className={`font-medium ${component.completed ? 'line-through text-gray-500' : ''}`}>
            {component.name}
          </span>
          
          <div className="ml-auto flex space-x-1">
            {component.description && !selectingComponents && (
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => handleInfoClick(component._id, e)}
              >
                <Info size={14} />
              </button>
            )}
            
            {!selectingComponents && (
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(component, parentId);
                }}
              >
                <Edit size={14} />
              </button>
            )}
            
            {(component.type === 'context' || component.type === 'provider') && !selectingComponents && (
              <button 
                className="text-gray-400 hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(component._id);
                }}
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
        
        {showComponentDesc && component.description && (
          <div className="ml-8 mt-1 p-2 bg-gray-50 rounded text-sm text-gray-600 border border-gray-200">
            {component.description}
          </div>
        )}
        
        {hasChildren && isExpanded && (
          <ul className="list-none pl-6 mt-1">
            {component.children.map(child => renderComponentTree(child, level + 1, component._id))}
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
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingParentId, setEditingParentId] = useState(null);
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: 'component',
    description: '',
    completed: false
  });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const { currentFeature } = useFeatures();
  
  // Load images when feature changes
  useEffect(() => {
    if (!currentFeature) return;
    
    const loadImages = async () => {
      try {
        const imagesData = await fetchFeatureImages(currentFeature._id);
        setImages(imagesData);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    
    loadImages();
  }, [currentFeature]);
  
  const handleAddImage = async (formData) => {
    try {
      const newImage = await uploadImage(formData);
      setImages(prevImages => [...prevImages, newImage]);
      return newImage;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  const handleDeleteImage = async (id) => {
    try {
      await deleteImage(id);
      setImages(prevImages => prevImages.filter(img => img._id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };
  
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
        const componentData = {
          ...newComponent,
          featureId: currentFeature ? currentFeature._id : null
        };
        const newComp = await createComponent(componentData);
        if (onComponentsChange) {
          onComponentsChange([...components, newComp]);
        }
      }
      
      // Reset form
      setNewComponent({ name: '', type: 'component', description: '', completed: false });
      setIsAddingComponent(false);
      setSelectedParentId(null);
      setError('');
    } catch (err) {
      console.error('Error adding component:', err);
      setError('Failed to add component');
    }
  };

  const handleUpdateComponent = async () => {
    if (!newComponent.name) {
      setError('Component name is required');
      return;
    }

    try {
      if (editingParentId) {
        // We're editing a child component inside a parent
        // First get the parent component
        const parent = components.find(comp => comp._id === editingParentId);
        if (!parent) {
          setError('Parent component not found');
          return;
        }

        // Find the child in the parent's children array
        const childIndex = parent.children.findIndex(child => child._id === editingComponent._id);
        if (childIndex === -1) {
          setError('Child component not found');
          return;
        }

        // Create a new children array with the updated child
        const updatedChildren = [...parent.children];
        updatedChildren[childIndex] = {
          ...updatedChildren[childIndex],
          name: newComponent.name,
          type: newComponent.type,
          description: newComponent.description,
          completed: newComponent.completed
        };

        // Update the parent component with the new children array
        const updatedParent = await updateComponent(editingParentId, {
          ...parent,
          children: updatedChildren
        });

        // Update the components list
        if (onComponentsChange) {
          onComponentsChange(components.map(comp => 
            comp._id === editingParentId ? updatedParent : comp
          ));
        }
      } else {
        // We're editing a root component
        const updatedComponent = await updateComponent(editingComponent._id, newComponent);
        
        // Update the components list
        if (onComponentsChange) {
          onComponentsChange(components.map(comp => 
            comp._id === editingComponent._id ? updatedComponent : comp
          ));
        }
      }
      
      // Reset form
      setNewComponent({ name: '', type: 'component', description: '', completed: false });
      setIsEditingComponent(false);
      setEditingComponent(null);
      setEditingParentId(null);
      setError('');
    } catch (err) {
      console.error('Error updating component:', err);
      setError('Failed to update component');
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      const updatedComponent = await toggleComponentCompletion(id);
      if (onComponentsChange) {
        onComponentsChange(components.map(comp => 
          comp._id === id ? updatedComponent : comp
        ));
      }
    } catch (error) {
      console.error('Error toggling component completion:', error);
    }
  };

  const handleToggleChildCompletion = async (parentId, childId) => {
    try {
      const updatedParent = await toggleChildComponentCompletion(parentId, childId);
      if (onComponentsChange) {
        onComponentsChange(components.map(comp => 
          comp._id === parentId ? updatedParent : comp
        ));
      }
    } catch (error) {
      console.error('Error toggling child component completion:', error);
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
    setIsEditingComponent(false);
    setNewComponent({ name: '', type: 'component', description: '', completed: false });
  };

  const handleEditComponent = (component, parentId = null) => {
    setEditingComponent(component);
    setEditingParentId(parentId);
    setIsEditingComponent(true);
    setIsAddingComponent(false);
    setNewComponent({
      name: component.name,
      type: component.type,
      description: component.description || '',
      completed: component.completed || false
    });
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
            <div className="p-2">
              <ComponentTreeView 
                components={components} 
                selectingComponents={selectingComponents}
                onSelect={handleSelect}
                onAddChild={handleAddButtonClick}
                onToggleCompletion={handleToggleCompletion}
                onToggleChildCompletion={handleToggleChildCompletion}
                onEdit={handleEditComponent}
              />
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
        
        {(isAddingComponent || isEditingComponent) && (
          <div className="mt-2 border border-gray-200 rounded p-3">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Component Name:
              </label>
              <input 
                type="text" 
                className="input input-sm input-bordered w-full mb-2"
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
                className="select select-sm select-bordered w-full mb-2"
                value={newComponent.type}
                onChange={(e) => setNewComponent({...newComponent, type: e.target.value})}
              >
                <option value="component">Component</option>
                <option value="context">Context</option>
                <option value="provider">Provider</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Description:
              </label>
              <textarea 
                className="textarea textarea-bordered textarea-sm w-full mb-2"
                value={newComponent.description}
                onChange={(e) => setNewComponent({...newComponent, description: e.target.value})}
                placeholder="Add a description for this component"
                rows={3}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm mr-2"
                  checked={newComponent.completed}
                  onChange={(e) => setNewComponent({...newComponent, completed: e.target.checked})}
                />
                <span className="text-sm">Mark as Completed</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setIsAddingComponent(false);
                  setIsEditingComponent(false);
                  setEditingComponent(null);
                  setEditingParentId(null);
                  setError('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={isEditingComponent ? handleUpdateComponent : handleAddComponent}
              >
                {isEditingComponent ? 'Update Component' : 'Add Component'}
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
        <ImageGallery 
          images={images}
          onAddImage={handleAddImage}
          onDeleteImage={handleDeleteImage} 
        />
      </div>
    </div>
  );
};

export default EnhancedComponentsList;