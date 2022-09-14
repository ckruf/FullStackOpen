import blogService from "../services/blog";
import Input from "./Input";
import InputStateSetter from "../common";

const AddBlogForm = ({newBlogTitle,newBlogAuthor, newBlogUrl, blogs, setNewBlogTitle, setNewBlogAuthor, setNewBlogUrl, setBlogs, setNotificationMsg, setErrorMsg}) => {
    const handleAddBlog = async (event) => {
        event.preventDefault();
        try {
            const newBlog = {
                title: newBlogTitle,
                author: newBlogAuthor,
                url: newBlogUrl
            }
            const addedBlog = await blogService.addNew(newBlog);
            setBlogs(blogs.concat(addedBlog));
            setNotificationMsg(`New blog added: ${newBlogTitle} by ${newBlogAuthor}`)
            setTimeout(() => {
                setNotificationMsg(null);
            }, 5000);
        }
        catch (error) {
            console.error("Got an error while adding blog:");
            console.error(error);
            if (error.response.data.error) {
                setErrorMsg(error.response.data.error);
            }
            else {
                setErrorMsg("Adding blog failed");
            }
            setTimeout(() => {
                setErrorMsg(null)
            }, 8000);
        }
    }

    return (
        <form onSubmit={handleAddBlog}>
            <div>
                title: <Input type="text" value={newBlogTitle} onChangeHandler={InputStateSetter(setNewBlogTitle)} />
            </div>
            <div>
                author: <Input type="text" value={newBlogAuthor} onChangeHandler={InputStateSetter(setNewBlogAuthor)} />
            </div>
            <div>
                url: <Input type="text" value={newBlogUrl} onChangeHandler={InputStateSetter(setNewBlogUrl)} />
            </div>
            <div>
                <button type="submit">add blog</button>
            </div>
        </form>
    )
}

export default AddBlogForm;