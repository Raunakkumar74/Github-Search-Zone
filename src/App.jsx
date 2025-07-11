import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const API_LINK = 'https://api.github.com/users';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a GitHub username');
      return;
    }

    setSearching('Searching...');
    setLoading(true);
    setUserData(null);
    setRepos([]);

    try {
      const userResponse = await fetch(`${API_LINK}/${searchTerm}`);
      const userResult = await userResponse.json();

      if (userResult.message === 'Not Found') {
        alert('User not found');
        setSearching('');
        return;
      }

      const repoResponse = await fetch(`${API_LINK}/${searchTerm}/repos`);
      const repoResult = await repoResponse.json();

      setUserData(userResult);
      setRepos(repoResult);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      setLoading(false);
      setSearching('');
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h1 style={{ fontFamily: 'cursive', fontSize: '5vw' }}>GitHub Search Zone</h1>
        <div className="input-search">
          <input
            type="text"
            id="search-term"
            placeholder="Search GitHub User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <FaSearch className="search" onClick={handleSearch} />
        </div>
        <h3 className="searching">{searching}</h3>
      </div>

      {loading && <p style={{ color: 'white' }}>Loading...</p>}

      {userData && (
        <div className="profile-box">
          <div className="row">
            <div className="image">
              <img src={userData.avatar_url} alt="avatar" />
            </div>
            <div className="about">
              <div className="details">
                <h1 className="name">{userData.name}</h1>
                <h3 className="username">@{userData.login}</h3>
                <p className="country">
                  <span>
                    <FaMapMarkerAlt />
                  </span>
                  {userData.location || 'Unknown'}
                </p>
              </div>
              <div className="btn-profile">
                <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                  Visit Profile
                </a>
              </div>
            </div>
          </div>

          <div className="bio">
            <h3>About</h3>
            <p>{userData.bio || 'Bio description is unavailable'}</p>
          </div>

          <div className="row-followers">
            <div className="col">
              <h3 className="heading">Followers</h3>
              <p>{userData.followers}</p>
            </div>
            <div className="col">
              <h3 className="heading">Following</h3>
              <p>{userData.following}</p>
            </div>
            <div className="col">
              <h3 className="heading">Repos</h3>
              <p>{userData.public_repos}</p>
            </div>
          </div>

          <h3 className="repo-heading">Repositories</h3>
          <div className="respos-row">
            <ul>
              {repos.map((repo) => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <li>{repo.name}</li>
                </a>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="footer">
        <p className="copyright">
          Copyright © 2024 || All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default App;
