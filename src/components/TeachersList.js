import { useState, useEffect } from 'react';
import styles from './TeachersList.module.css';
import { useUser } from "@/utils/useUser";
import { Rating } from '@mui/material';
import CitySelect from "./CitySelect";
import DeleteIcon from '@mui/icons-material/Delete';
import { generateRandomId } from '@/utils/generateId';
import StarIcon from '@mui/icons-material/Star';
import { useLanguage } from '@/context/LanguageContext';

export default function TeachersList() {
  const { user, setAuthOpenedFrom } = useUser();
  const { lang } = useLanguage();
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
  const MAX_DESCRIPTION_LENGTH = 350;
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [tempUserId, setTempUserId] = useState(() => {
    // Check if window exists (we're in browser)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('teacherTempId') || '';
    }
    return '';
  });
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    // Load teachers and cities only when component mounts
    loadTeachers();
    loadCities();
  }, []); // Empty dependency array means this runs once on mount

  // Create a separate effect for loading user ratings
  useEffect(() => {
    // Only fetch ratings when user is logged in AND we have teachers loaded
    if (user && teachers.length > 0) {
      loadUserRatings();
    }
  }, [user, teachers.length]); // Only re-run if user changes or number of teachers changes

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

  async function loadUserRatings() {
    if (!user) return;
    
    try {
      // Only load ratings once when user is available
      const userIds = {};
      for (const teacher of teachers) {
        if (!userRatings[teacher.id]) { // Only fetch ratings we don't already have
          const response = await fetch(`/api/teachers/rate?teacherId=${teacher.id}&userId=${user.id}`);
          const data = await response.json();
          if (data) {
            userIds[teacher.id] = data;
          }
        }
      }
      
      // Only update state if we have new ratings
      if (Object.keys(userIds).length > 0) {
        setUserRatings(prev => ({
          ...prev,
          ...userIds
        }));
      }
    } catch (error) {
      console.error('Error loading user ratings:', error);
    }
  }

  async function handleRating(teacherId, newValue) {
    if (!user) {
      setAuthOpenedFrom('teachers');
      return;
    }

    try {
      const response = await fetch('/api/teachers/rate', {
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
      
      const result = await response.json();
      
      // Update just this teacher in the state
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === teacherId ? 
          { 
            ...teacher, 
            averageRating: result.teacherRating.averageRating, 
            ratingCount: result.teacherRating.ratingCount 
          } : 
          teacher
        )
      );
      
      // Update user ratings
      setUserRatings(prev => ({
        ...prev,
        [teacherId]: newValue
      }));
      
    } catch (error) {
      console.error('Rating error:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.city.trim()) {
      setFormError(lang.select_city);
      return;
    }

    if (formData.mobile.trim() && !/^\d{9}$/.test(formData.mobile)) {
      setFormError(lang.enter_9_digit_mobile);
      return;
    }

    const submitUserId = user ? user.id : (tempUserId || generateRandomId());
    if (!user && !tempUserId && typeof window !== 'undefined') {
      setTempUserId(submitUserId);
      localStorage.setItem('teacherTempId', submitUserId);
    }

    fetch('/api/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        mobile: formData.mobile.trim(),
        description: formData.description.slice(0, MAX_DESCRIPTION_LENGTH),
        userId: submitUserId
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

  async function handleDelete(teacherId, teacherUserId) {
    if (user && user.id !== teacherUserId) return;
    
    if (!user && typeof window !== 'undefined') {
      const storedTempId = localStorage.getItem('teacherTempId');
      if (!storedTempId || storedTempId !== teacherUserId) {
        alert('თქვენ არ გაქვთ უფლება წაშალოთ ეს მასწავლებელი');
        return;
      }
    }

    if (!confirm('ნამდვილად გსურთ წაშლა?')) return;

    try {
      const response = await fetch('/api/teachers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          userId: teacherUserId
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

  const toggleDescription = (teacherId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [teacherId]: !prev[teacherId]
    }));
  };

  const renderDescription = (teacher) => {
    if (teacher.description.length <= 100) {
      return <p className={styles.description + " mxedruli"}>{teacher.description}</p>;
    }

    return (
      <>
        <p className={styles.description + " mxedruli"}>
          {expandedDescriptions[teacher.id] 
            ? teacher.description 
            : teacher.description.substring(0, 100) + '...'}
        </p>
        <button 
          className={"text-[0.7rem]"}
          onClick={() => toggleDescription(teacher.id)}
        >
          {expandedDescriptions[teacher.id] ? lang.less : lang.more }
        </button>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className=''>{lang.teachers}</h1>
        <div className="text-center max-w-2xl mx-auto my-4 text-sm text-gray-300">
          <p className="mb-2 mxedruli">{lang.add_or_rate_teachers}</p>
        </div>
        
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          {lang.add_teacher}
        </button>
      </div>

      <div className={styles.teachersGrid}>
        {teachers.map(teacher => (
          <div key={teacher.id} className={styles.teacherCard}>
            <div className={styles.teacherHeader}>
              <h3>{teacher.name}</h3>
              {(user?.id === teacher.userId || (!user && typeof window !== 'undefined' && localStorage.getItem('teacherTempId') === teacher.userId)) && (
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(teacher.id, teacher.userId)}
                  aria-label={lang.delete}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
            <p className={styles.city}>{teacher.city}</p>
            {renderDescription(teacher)}
            <p className={styles.mobile}>{teacher.mobile}</p>
            <div className={styles.ratingContainer}>
              <div className={styles.rating}>
                <Rating
                  value={userRatings[teacher.id] || 0}
                  onChange={(event, newValue) => handleRating(teacher.id, newValue)}
                  onClick={() => !user && setAuthOpenedFrom('teachers')}
                  emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'grey' }} fontSize="inherit" />}
                />
                {/* {user && userRatings[teacher.id] ? (
                  <Tooltip title="შენი შეფასება">
                    <span className={styles.userRatingLabel}>შენი: {userRatings[teacher.id]}</span>
                  </Tooltip>
                ) : null} */}
              </div>
              <div className={styles.ratingInfo}>
                <span className={styles.averageRating}>{teacher.averageRating || 0}</span>
                <span className={styles.ratingCount}>({teacher.ratingCount || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>{lang.add_teacher}</h2>
            <form className={"mxedruli"} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={lang.teacher_name}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder={lang.mobile}
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
              {formError && <div className={styles.error}>{formError}</div>}
              <CitySelect
                options={cities}
                value={formData.city}
                onChange={value => setFormData({...formData, city: value})}
                placeholder={lang.select_city}
                required
              />
              <textarea
                placeholder={lang.teacher_info}
                value={formData.description}
                rows={4}
                onChange={e => setFormData({...formData, description: e.target.value})}
                maxLength={MAX_DESCRIPTION_LENGTH}
                required
              />
              <div className={styles.charCount}>
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
              <button type="submit">{lang.add_teacher}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 