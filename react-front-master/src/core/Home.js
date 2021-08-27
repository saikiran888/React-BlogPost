import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div >
    <div className="jumbotron c">
      <h2>Home</h2>
      <p className="lead st">Welcome to Blog Post App</p>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
