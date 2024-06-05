import React, { useState } from 'react';

function Login() {
  // State variables to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login/authentication logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="d-flex vh-100 m-0 p-0" style={{ backgroundColor: "#FFE7E8" }}>
      <div className="left bg-danger rounded-4 m-2 p-2 d-flex flex-column" style={{ flex: 1, backgroundImage: 'url("/scu-main.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: '.8', border: "2px solid black" }}></div>
      <div className="right m-2 p-0 d-flex flex-column" style={{ flex: 1 }}>
        <div className="header m-0 mt-2 p-0 px-2 d-flex justify-content-between align-items-center">
          <p className="m-0 p-0 fw-bold fs-5 text-black">setCourse</p>
          {/* <p className="m-0 p-0 text-white">logo</p> */}
          <img src='/sclogo.svg' alt='' style={{ height: '50px', width: '50px' }} />
        </div>
        <div className="wrapper d-flex flex-column justify-content-center align-items-center" style={{ flex: 1 }}>
          <div className="welcome m-0 mb-5 p-0 d-flex flex-column justify-content-center align-items-center">
            <h2 className="m-0 p-0 text-black">Welcome!</h2>
            <p className="m-0 p-0 text-black" style={{ fontSize: '14px' }}>Login with your SCU email address</p>
          </div>
          {/* Login form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center" action="https://127.0.0.1:8081/login" method="POST">
            <div className="form-group mb-3">
              <label htmlFor="username" className="m-0 p-0 text-black">Enter username:</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="m-0 p-0 text-black">Enter password:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
