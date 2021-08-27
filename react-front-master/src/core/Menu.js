import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900' };
    else return { color: '#ffffff' };
};

const Menu = ({ history }) => (
 
<nav className="navbar navbar-expand-lg navbar-dark " style={{ backgroundColor:"black"}}>
  <Link className="navbar-brand font " style={{ fontSize:"35px" ,color:'#0dab91'}}to="/">Blog Post</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon" />
  </button>
  <div className="collapse navbar-collapse" id="navbarColor01">
    <ul className="navbar-nav ml-auto">
    <li className="nav-item ">
          <Link className="nav-link " style={isActive(history, '/')} to="/">Home
          
          </Link>
        </li>
      <li className="nav-item">
        <Link className="nav-link "  to={`/post/create`} style={isActive(history, `/post/create`)} >
                    Create Post
                </Link>
        </li>
      {!isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                            Sign Up
                        </Link>
                    </li>
                </React.Fragment>
            )}
             {isAuthenticated() && isAuthenticated().user.role === 'admin' && (
                <li className="nav-item">
                    <Link to={`/admin`} style={isActive(history, `/admin`)} className="nav-link">
                        Admin
                    </Link>
                </li>
            )}
      {isAuthenticated() && (
                <React.Fragment>
                 

                    <li className="nav-item">
                        <Link
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                            className="nav-link"
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={() => signout(() => history.push('/'))}
                        >
                            Log Out
                        </span>
                    </li>
                </React.Fragment>
            )}
    </ul>
  </div>
</nav> );

export default withRouter(Menu);
