import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../hooks/useAuth";

const FeedList = ({ posts, onDeletePost }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const { user } = useAuth();
    const userId = user?._id;

    const handleDeleteClick = (postId) => {
        setSelectedPostId(postId);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        onDeletePost(selectedPostId);
        setDeleteModal(false);
        setSelectedPostId(null);
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
                                        onClick={() => handleDeleteClick(post._id)}
                                    />
                                    {deleteModal && selectedPostId === post._id && (
                                        <DeleteModal
                                            onCancel={() => { setDeleteModal(false) }}
                                            onConfirm={confirmDelete}
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