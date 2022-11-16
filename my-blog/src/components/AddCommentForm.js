import { useState } from "react";
import axios from "axios";
import useUser from '../hooks/useUser';

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
    const [name, setName] = useState('');
    const[commentText, setCommentText] = useState('')
    const { user, isLoading } = useUser();

    const addComment = async() => {
        const token = user && await user.getIdToken(); //auth token
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: commentText
        }, { headers });
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText('')
    }
    return(
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            {user && <p>You are posting as { user.email }</p> }
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} cols="50" rows="4"></textarea>
                <button onClick={addComment}>Add Comment</button>
        </div>
    )
}
export default AddCommentForm;