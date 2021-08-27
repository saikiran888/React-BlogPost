import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import DefaultPost from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Comment from './Comment';
import { ThumbsDown, ThumbsUp } from 'react-feather';

class SinglePost extends Component {
    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your post?');
        if (answer) {
            this.deletePost();
        }
    };

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
        const posterName = post.postedBy ? post.postedBy.name : ' Unknown';

        const { like, likes } = this.state;

        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    className="img-thunbnail mb-3"
                    style={{
                        height: '400px',
                        width: '100%',
                        borderRadius:'2%',
                        objectFit: 'cover'
                    }}
                />

                {like ? (
                    <h4 onClick={this.likeToggle}>
                        <ThumbsUp
                         className=" m-2"
                             style={{color: 'blue'
                             ,cursor:'pointer'}}
                           
                        /> 
                        {likes} Like
                    </h4>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <ThumbsDown
                          className="m-2"
                          style={{color:'red'
                        ,cursor:'pointer'}}
                        />{' '}
                        {likes} Like
                    </h3>
                )}
<div className="card">
  <div className="card-body">
  
    <p className="card-text text-bold-500">{post.body}</p>
  </div>
  </div>
               
                <br />
                <p className="font-italic mark bg-transparent">
                    Posted by <Link   to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary mr-5">
                        Back to posts
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                            <Link to={`/post/edit/${post._id}`}  className="btn btn-raised btn-info mr-5">
                                Update Post
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger mr-5">
                                Delete Post
                            </button>
                        </>
                    )}

                    <div>
                        {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
                            <div className="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                                    <Link
                                        to={`/post/edit/${post._id}`}
                                        className="btn btn-raised btn-warning  mr-5"
                                    >
                                        Update Post
                                    </Link>
                                    <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger mr-5">
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container">
                <h4 className="display-2 font mt-5 mb-4 " style={{color:"#24e5a8", fontSize:"60px",textShadow: "0 0 3px #FF0000, 0 0 5px #0000FF"}}>{post.title}</h4>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        );
    }
}

export default SinglePost;
