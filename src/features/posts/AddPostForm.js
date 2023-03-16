// Component file of form
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewPost } from "./postsSlice";  // asyn-thunk function 
import { selectAllUsers } from "../users/usersSlice"; // object contain all users
import { useNavigate } from "react-router-dom";


//rafce
const AddPostForm = () => {
    // Define hooks
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // create local state for only this component
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    // get all users directly from user-Reducer
    const users = useSelector(selectAllUsers)

        //variable to get data from form-input -> change current state (temporary states)
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

     // make sure all form is fiiled
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';  // current status of this form

    // function for the save button
    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                dispatch(addNewPost({ title, body: content, userId })).unwrap() // dispatch action to make api request in postSlice

                setTitle('')
                setContent('')
                setUserId('')
                navigate('/')  // go back to home page after save new post
            } catch (err) {
                console.error('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }

    }

    // a function that only show users name in the state (user choose a name => userId)
    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )
}
export default AddPostForm