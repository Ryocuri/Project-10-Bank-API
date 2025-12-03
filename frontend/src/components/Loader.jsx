import PropTypes from 'prop-types';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      minHeight: '200px'
    }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #00bc77',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '1rem', color: '#2c3e50' }}>{message}</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

Loader.propTypes = {
  message: PropTypes.string,
};

export default Loader;