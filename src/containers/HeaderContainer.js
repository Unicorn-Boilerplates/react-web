import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts, resetDeletedPost, deletePost, deletePostSuccess, deletePostFailure } from '../actions/posts';
import { logoutUser } from '../actions/users';
import Header from '../components/header.js';



function mapStateToProps(state) {
    console.log('CURRENT PROPS', state.user.status === 'authenticated' ? state.user.user : null)
    return {
        deletedPost: state.posts.deletedPost,
        authenticatedUser: state.user.status === 'authenticated' ? state.user.user : null,
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onDeleteClick: () => {
            let token = localStorage.getItem('jwtToken');
            if (!token || token === '') { //if there is no token, dont bother,
                let data = { data: { message: 'Please Sign In' } }; //axios like error
                dispatch(deletePostFailure(data)); // but let other comps know
                return;
            }

            dispatch(deletePost(ownProps.postId, token))
                .then((response) => {
                    !response.error ? dispatch(deletePostSuccess(response.payload)) : dispatch(deletePostFailure(response.payload));
                });
        },
        resetMe: () => {
            dispatch(resetDeletedPost());
        },

        logout: () => {
            localStorage.removeItem('jwtToken');
            dispatch(logoutUser());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);