import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Image, Video } from 'lucide-react';

const CreatePost = () => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', caption);
        if (file) formData.append('media', file);

        try {
            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-4 border rounded-lg mb-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                ></textarea>

                {preview && (
                    <div className="mb-4">
                        <img src={preview} alt="Preview" className="w-full rounded-lg max-h-96 object-contain bg-black" />
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-lg transition">
                        <Image size={24} />
                        <span>Add Photo/Video</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={!caption && !file}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
