import React, { useState, useEffect } from 'react';
import ActivityService from '../../services/api/ActivityService';

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  // Fetch activities when component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const activitiesData = await ActivityService.getActivities();
      setActivities(activitiesData.results || []); 
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('No se pudo cargar la información. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete activity
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta actividad?')) return;

    try {
      await ActivityService.deleteActivity(id);
      setActivities(prevActivities => prevActivities.filter(activity => activity.id !== id));
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('No se pudo eliminar la actividad. Por favor, intente de nuevo.');
    }
  };

  // Open modal for editing an activity
  const handleEdit = (activity) => {
    setCurrentActivity({...activity});
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Open modal for adding a new activity
  const handleAdd = () => {
    setCurrentActivity({
      name: '',
      description: '',
      cost: ''
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Handle save (create or update) activity
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // Create new activity
        const newActivity = await ActivityService.createActivity(currentActivity);
        setActivities(prev => [...prev, newActivity]);
      } else {
        // Update existing activity
        const updatedActivity = await ActivityService.updateActivity(
          currentActivity.id, 
          currentActivity
        );
        setActivities(prev => 
          prev.map(activity => 
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        );
      }
      
      // Close modal
      setIsModalOpen(false);
      setCurrentActivity(null);
    } catch (err) {
      console.error('Error saving activity:', err);
      setError('No se pudo guardar la actividad. Por favor, intente de nuevo.');
    }
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Cargando actividades...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Error: </strong>
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activities-container">
      <div className="actions-header">
        <button 
          onClick={handleAdd}
          className="add-activity-btn"
        >
          Añadir Actividad
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="no-activities">
          No hay actividades disponibles
        </div>
      ) : (
        <table className="activities-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>{activity.description}</td>
                <td>${Number(activity.cost).toFixed(2)}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(activity)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="delete-btn"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Activity Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              {modalMode === 'add' ? 'Añadir Actividad' : 'Editar Actividad'}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="close-modal-btn"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentActivity.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentActivity.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cost">Costo</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={currentActivity.cost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="save-btn"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}