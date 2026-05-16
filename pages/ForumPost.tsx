import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ArrowLeft, Trash2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForumPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const { user, isAdmin } = useAuth();
    const { dir } = useLanguage();

    useEffect(() => {
        if (id) {
            fetchPostAndComments();
        }
    }, [id]);

    const fetchPostAndComments = async () => {
        setLoading(true);
        const { data: postData } = await supabase.from('forum_posts').select('*').eq('id', id).single();
        if (postData) {
            setPost(postData);
            const { data: commentsData } = await supabase
                .from('forum_comments')
                .select('*')
                .eq('post_id', id)
                .order('created_at', { ascending: true });
            setComments(commentsData || []);
        }
        setLoading(false);
    };

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !id) return;
        const { error } = await supabase.from('forum_comments').insert({
            post_id: id,
            user_id: user.id,
            content: newComment
        });
        if (!error) {
            setNewComment('');
            fetchPostAndComments();
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm("Delete comment?")) return;
        const { error } = await supabase.from('forum_comments').delete().eq('id', commentId);
        if (!error) {
            fetchPostAndComments();
        }
    };

    if (loading) return <div className="text-center py-24 font-bold text-slate-500">Loading...</div>;
    if (!post) return <div className="text-center py-24 font-bold text-red-500">Post not found</div>;

    return (
        <div dir={dir} className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => navigate('/forum')} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Forum
            </button>

            <div className="glass-card rounded-[2.5rem] p-8 mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-4">{post.title}</h1>
                <div className="text-sm text-slate-500 font-medium mb-8">
                    {new Date(post.created_at).toLocaleString()}
                </div>
                <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-amber-600" /> Comments ({comments.length})
                </h3>

                {comments.map(comment => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={comment.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-xs text-slate-400 font-bold mb-2">{new Date(comment.created_at).toLocaleString()}</div>
                            <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                        {(isAdmin || user?.id === comment.user_id) && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-300 hover:text-red-500 p-2">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </motion.div>
                ))}

                {user ? (
                    <form onSubmit={handleCreateComment} className="mt-8 flex gap-4">
                        <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-6 py-4 rounded-full bg-white border-2 border-slate-100 focus:border-amber-500 focus:outline-none font-medium"
                            required
                        />
                        <button type="submit" className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">
                            <Send size={20} />
                        </button>
                    </form>
                ) : (
                    <div className="mt-8 text-center p-6 bg-slate-50 rounded-3xl">
                        <p className="text-slate-500 font-bold">Please <Link to="/login" className="text-amber-600 underline">log in</Link> to leave a comment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
