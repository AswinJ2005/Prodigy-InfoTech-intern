import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh posts or update locally
            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    const liked = post.Likes.find(l => l.userId === user.id);
                    if (liked) {
                        return { ...post, Likes: post.Likes.filter(l => l.userId !== user.id) };
                    } else {
                        return { ...post, Likes: [...post.Likes, { userId: user.id }] };
                    }
                }
                return post;
            });
            setPosts(updatedPosts);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <div key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="flex items-center p-4">
                        <img
                            src={post.User.profilePic ? `http://localhost:5000${post.User.profilePic}` : 'https://via.placeholder.com/40'}
                            alt={post.User.username}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <Link to={`/profile/${post.userId}`} className="font-semibold hover:underline">
                            {post.User.username}
                        </Link>
                    </div>

                    {/* Media */}
                    {post.mediaUrl && (
                        <div className="w-full">
                            {post.mediaType === 'video' ? (
                                <video src={`http://localhost:5000${post.mediaUrl}`} controls className="w-full" />
                            ) : (
                                <img src={`http://localhost:5000${post.mediaUrl}`} alt="Post" className="w-full object-cover max-h-[600px]" />
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-4">
                        <div className="flex gap-4 mb-2">
                            <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-red-500">
                                <Heart
                                    className={`${post.Likes?.some(l => l.userId === user.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                />
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-black">
                                <MessageCircle />
                            </button>
                        </div>
                        <p className="font-bold mb-1">{post.Likes?.length || 0} likes</p>
                        <div className="mb-2">
                            <span className="font-semibold mr-2">{post.User.username}</span>
                            <span>{post.caption}</span>
                        </div>
                        <p className="text-gray-500 text-sm">View all {post.Comments?.length} comments</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
