import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../store/authSlice';
import { updateUserProfile } from '../store/userSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Account from '../components/Account';
import Button from '../components/Button';
import Loader from '../components/Loader';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { isLoading: authLoading } = useSelector((state) => state.auth);
  const { firstName, lastName, isLoading: userLoading, error } = useSelector((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (firstName && lastName) {
      setEditedName({ firstName, lastName });
    }
  }, [firstName, lastName]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedName({ firstName, lastName });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(editedName)).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const accounts = [
    {
      title: 'Argent Bank Checking (x8349)',
      amount: '$2,082.79',
      description: 'Available Balance',
    },
    {
      title: 'Argent Bank Savings (x6712)',
      amount: '$10,928.42',
      description: 'Available Balance',
    },
    {
      title: 'Argent Bank Credit Card (x8349)',
      amount: '$184.30',
      description: 'Current Balance',
    },
  ];

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="main bg-dark">
          <Loader message="Loading your profile..." />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main bg-dark">
        <div className="header">
          {isEditing ? (
            <div>
              <h1>Welcome back</h1>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  name="firstName"
                  value={editedName.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <input
                  type="text"
                  name="lastName"
                  value={editedName.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button
                  onClick={handleSave}
                  className="edit-button"
                  disabled={userLoading}
                >
                  {userLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="edit-button"
                  disabled={userLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1>
                Welcome back
                <br />
                {firstName} {lastName}!
              </h1>
              <Button onClick={handleEdit} className="edit-button">
                Edit Name
              </Button>
            </>
          )}
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              backgroundColor: '#ffebee', 
              padding: '0.75rem', 
              marginTop: '1rem',
              borderRadius: '4px',
              maxWidth: '400px',
              margin: '1rem auto'
            }}>
              {error}
            </div>
          )}
        </div>
        <h2 className="sr-only">Accounts</h2>
        {accounts.map((account, index) => (
          <Account
            key={index}
            title={account.title}
            amount={account.amount}
            description={account.description}
          />
        ))}
      </main>
      <Footer />
    </>
  );
};

export default UserProfilePage;