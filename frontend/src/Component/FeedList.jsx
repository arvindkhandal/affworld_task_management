import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { GET_ALL_POSTS, DELETE_POST } from "./API";
import DeleteModal from "./DeleteModal";

const FeedList = () => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserId(parsedData?._id);
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) throw new Error("Authorization token is missing.");

                const response = await fetch(GET_ALL_POSTS, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`Server error: ${response.status}`);

                const data = await response.json();
                if (data.success) setPosts(data.posts);
                else console.error("Failed to fetch posts:", data.message);
                setDeleteModal(false)
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }
        };

        fetchPosts();
    }, []);

    const handleDeletePost = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Authorization token is missing.");

            const response = await fetch(`${DELETE_POST}${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete the post");

            const result = await response.json();
            console.log("Post deleted successfully", result);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error("Error deleting the post", error.message);
        }
    };

    return (
        <div className="mt-6 p-3 flex justify-center items-center gap-12 flex-wrap">
            {posts.length === 0 ? (
                <p className="text-white text-center">No posts available.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="bg-gray-800 p-4 w-[40%] min-w-[700px] h-[550px] rounded-lg shadow-md">
                        <img
                            src={post.photo}
                            alt="Post"
                            className="w-full h-[450px] object-cover rounded"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div>
                                <p className="text-white mt-2 text-lg font-semibold">{post.caption}</p>
                                <p className="text-white mt-2 text-sm italic">
                                    By {post.user?.fullName || 'Unknown User'}
                                </p>
                            </div>
                            {userId === post?.user?._id && (
                                <>
                                <MdDelete
                                    className="text-2xl text-white cursor-pointer"
                                    onClick={()=>{setDeleteModal(true)}}
                                />
                                {deleteModal && (
                                        <DeleteModal 
                                          onCancel={()=>{setDeleteModal(false)}}
                                          onConfirm={() => handleDeletePost(post._id) }
                                        />
                                      )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FeedList;
