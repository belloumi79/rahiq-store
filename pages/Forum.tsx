import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumPost {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
}

export default function Forum() {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const { user, isAdmin } = useAuth();
    const { t, dir } = useLanguage();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const { error } = await supabase
            .from('forum_posts')
            .insert({ user_id: user.id, title: newTitle, content: newContent });
        if (!error) {
            setNewTitle('');
            setNewContent('');
            setShowNewPost(false);
            fetchPosts();
        } else {
            console.error("Error creating post", error);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!window.confirm("Delete this post?")) return;
        const { error } = await supabase.from('forum_posts').delete().eq('id', id);
        if (!error) {
            fetchPosts();
        }
    };

    return (
        <div dir={dir} className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                    <MessageSquare className="text-amber-600" size={40} />
                    {t('forum.title') || 'Community Forum'}
                </h1>
                {user && (
                    <button
                        onClick={() => setShowNewPost(!showNewPost)}
                        className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
                    >
                        <Plus size={20} /> {t('forum.newPost') || 'New Post'}
                    </button>
                )}
            </div>

            {showNewPost && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreatePost}
                    className="glass-card rounded-3xl p-6 mb-8 space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-amber-500 font-bold"
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-amber-500 min-h-[150px]"
                        required
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowNewPost(false)} className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700">
                            Post
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-500 font-bold">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 glass-card rounded-3xl">
                    <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-bold">{t('forum.noPosts') || 'No posts yet. Be the first to start a discussion!'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <motion.div key={post.id} whileHover={{ y: -2 }} className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-xl hover:shadow-amber-100">
                            <Link to={`/forum/${post.id}`} className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </Link>
                            {(isAdmin || user?.id === post.user_id) && (
                                <button onClick={() => handleDeletePost(post.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
