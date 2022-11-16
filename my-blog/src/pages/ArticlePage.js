import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import articles from './article-content';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';

const ArticlePage = () => {
    const navigate = useNavigate();
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;
    //in order to load the data and use it, we need to add state to the component (we use hooks for that)
    //State is used to store the response that we get back from the server
    //useEffect is used to add logic to the components that would be executed outside of the normal component rendering, like loading data from the server 
    //useEffect runs not only when the component loads, but also when it is updated, here the value is changing continuously because of the random function, so it is caught in an infinite loop
    const params = useParams();
    const { articleId } = params;
    // Returns the data from the url, returns objects with key value pairs
    // const articleId = params.articleId;

    const { user, isLoading } = useUser();

    useEffect( () => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken(); //auth token
            const headers = token ? { authtoken: token } : {};
            const response = await axios.get(`/api/articles/${articleId}`, { headers })
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }
        if(isLoading){
            loadArticleInfo();
        }
    }, [isLoading, user]);
    //we add an empty array as a 2nd argument because, what the use effect does is that whenever any of the values that are there in this array changes, the useeffect will execute the logic that it there in the callback function that we passed as the first argument.
    //empty array => execute only when the component is first mounted.
    

    const article = articles.find(article => article.name === articleId);
    // object destructuring

    const addUpvote = async () => {
        const token = user && await user.getIdToken(); //auth token
        const headers = token ? { authtoken: token } : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle)
    }


    if(!article){
        return <NotFoundPage />
    }

    // no else, because, anything after return will not be executed
    return(
        <>
            <h1>{ article.title }</h1>
            <div className="upvotes-section">
                {user
                    ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}  </button>
                    : <button onClick={() => {
                        navigate('/login');
                    }}>Log in to upvote</button>
                }
               
                <p>This article has {articleInfo.upvotes} upvote(s) </p>
            </div>
            {article.content.map ((paragraph, i)=> (
                <p key={i}>{paragraph}</p>
            )) }
            {user
                ? <AddCommentForm 
                    articleName={articleId}
                    onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}/>
                : <button onClick={() => {
                    navigate('/login');
                }}>Log in to add a comment</button>
            }
            <CommentsList comments={articleInfo.comments}/>
        </>
        );
}

export default ArticlePage; 