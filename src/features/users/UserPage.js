import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectAllPosts, selectPostsByUser} from "../posts/postsSlice";
import { selectUserById} from "./usersSlice";



const UserPage = () => {

    // get userId from url
    const {userId} = useParams();
    const user = useSelector(state => selectUserById(state, Number(userId)));

    
    // all posts of a single user (memorised selector => optimze app)
    const postsForUser = useSelector(state => selectPostsByUser(state, Number(userId)))

    console.log(postsForUser)
    //titles
    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ));


  return (
    <section>
        <h2>Author: {user?.name}</h2>
        <h4>Posts:</h4>
        <ol>{postTitles}</ol>
    </section>
  )
}

export default UserPage

