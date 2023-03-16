// component file of Author => return only a line
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

const PostAuthor = ({ userId }) => {
    // get all reducer from reducer
    const users = useSelector(selectAllUsers)

    // find the author in array using userId
    const author = users.find(user => user.id === userId);

    return <span>by {author ? author.name : 'Unknown author'}</span>
}
export default PostAuthor // export to component PostList