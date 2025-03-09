import { useState, useEffect } from 'react';
import styles from './TeachersList.module.css';
import { useUser } from "@/utils/useUser";
import { Rating } from '@mui/material';
import CustomSelect from "./CustomSelect";
import CitySelect from "./CitySelect";
import DeleteIcon from '@mui/icons-material/Delete';

export default function TeachersList() {
  const { user, setAuthOpenedFrom } = useUser();
  const [teachers, setTeachers] = useState([]);
  const [cities, setCities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    description: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadTeachers();
    loadCities();
  }, []);

  async function loadTeachers() {
    const response = await fetch('/api/teachers');
    const data = await response.json();
    setTeachers(data);
  }

  async function loadCities() {
    const response = await fetch('/api/teachers/cities');
    const data = await response.json();
    setCities(data);
  }

  async function handleRating(teacherId, newValue) {
    if (!user) {
      setAuthOpenedFrom('teachers');
      return;
    }

    try {
      await fetch('/api/teachers/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          rating: newValue,
          userId: user.id
        })
      });
      loadTeachers();
    } catch (error) {
      console.error('Rating error:', error);
    }
  }

  async function handleDelete(teacherId) {
    if (!user) return;
    
    if (!confirm('ნამდვილად გსურთ წაშლა?')) return;

    try {
      const response = await fetch('/api/teachers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          userId: user.id
        })
      });

      if (response.ok) {
        loadTeachers();
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setAuthOpenedFrom('teachers');
      return;
    }

    if (!formData.city.trim()) {
      setFormError('აირჩიეთ ქალაქი');
      return;
    }

    if (!/^\d{9}$/.test(formData.mobile)) {
      setFormError('ჩაწერეთ 9ნიშნა მობილურის ნომერი');
      return;
    }

    fetch('/api/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        userId: user.id
      })
    })
    .then(response => response.json())
    .then(() => {
      setShowAddModal(false);
      loadTeachers();
      setFormData({ name: '', mobile: '', city: '', description: '' });
      setFormError('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className=''>გიტარის მასწავლებლები</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          დაამატე მასწავლებელი
        </button>
      </div>

      <div className={styles.teachersGrid}>
        {teachers.map(teacher => (
          <div key={teacher.id} className={styles.teacherCard}>
            <div className={styles.teacherHeader}>
              <h3>{teacher.name}</h3>
              {user && user.id === teacher.userId && (
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(teacher.id)}
                  aria-label="წაშლა"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
            <p className={styles.city}>{teacher.city}</p>
            <p className={styles.description + " mxedruli"}>{teacher.description}</p>
            <p className={styles.mobile}>{teacher.mobile}</p>
            <div className={styles.rating}>
              <Rating
                value={teacher.averageRating}
                onChange={(event, newValue) => handleRating(teacher.id, newValue)}
                onClick={() => !user && setAuthOpenedFrom('teachers')}
              />
              <span>({teacher.ratingCount})</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>ახალი მასწავლებლის დამატება</h2>
            <form className={"mxedruli"} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="სახელი და გვარი"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="მობილური"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
                required
              />
              {formError && <div className={styles.error}>{formError}</div>}
              <CitySelect
                options={cities}
                value={formData.city}
                onChange={value => setFormData({...formData, city: value})}
                placeholder="აირჩიეთ ან ჩაწერეთ ქალაქი"
                required
              />
              <textarea
                placeholder="ჩაწერეთ ინფორმაცია მასწავლებელზე. რა სახის გიტარაზე დაკვრას ასწავლის, ტერიტორიულად სადაა"
                value={formData.description}
                rows={4}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
              <button type="submit">დამატება</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 