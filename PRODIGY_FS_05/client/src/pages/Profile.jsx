import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const userId = id || currentUser?.id;

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileUser(userRes.data);

                const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(postsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [userId]);

    if (!profileUser) return <div className="text-center mt-10">Loading Profile...</div>;

    return (
        <div>
            {/* Profile Header */}
            <div className="bg-white p-8 rounded-lg shadow-sm mb-6 flex items-center gap-8">
                <img
                    src={profileUser.profilePic ? `http://localhost:5000${profileUser.profilePic}` : 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                    <h1 className="text-3xl font-bold mb-2">{profileUser.username}</h1>
                    <p className="text-gray-600 mb-4">{profileUser.bio || 'No bio yet.'}</p>
                    <div className="flex gap-6">
                        <span className="font-bold">{posts.length} posts</span>
                        {/* <span>0 followers</span> */}
                        {/* <span>0 following</span> */}
                    </div>
                </div>
            </div>

            {/* Profile Posts Grid */}
            <div className="grid grid-cols-3 gap-4">
                {posts.map(post => (
                    <div key={post.id} className="aspect-square bg-gray-200 overflow-hidden rounded relative group cursor-pointer hover:opacity-90">
                        {post.mediaType === 'video' ? (
                            <video src={`http://localhost:5000${post.mediaUrl}`} className="w-full h-full object-cover" />
                        ) : post.mediaUrl ? (
                            <img src={`http://localhost:5000${post.mediaUrl}`} alt="Post" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex justify-center items-center h-full p-4 text-center bg-white">
                                <p className="line-clamp-4">{post.caption}</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold">
                            {post.Likes?.length || 0} Likes
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No posts to show
                </div>
            )}
        </div>
    );
};

export default Profile;
