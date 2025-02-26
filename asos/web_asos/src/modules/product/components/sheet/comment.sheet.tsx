import SheetContainer from '@/components/container/sheet.container';
import { SheetType } from '@/enums/sheet.enum';
import useSheetContext from '@/hooks/useSheet';
import { memo, useEffect, useState } from 'react';
import CommentService from '../../services/comment.service';
import CommentCard from '../card/comment.card';
import CommentSkeleton from '../skeleton/comment.skeleton';
import EmptyComment from '@/assets/images/empty-comment.png';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import useProfile from '@/hooks/useProfile';
import { Link } from 'react-router-dom';

function CommentSheet() {
    const { profile } = useProfile();
    const [input, setInput] = useState<string>('');
    const [data, setData] = useState<ProductComment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { sheets, closeSheet } = useSheetContext();
    const state = sheets[SheetType.CommentSheet];

    useEffect(() => {
        const fetchData = async (id: string) => {
            setLoading(true);
            const res = await CommentService.getAll(id);
            setTimeout(() => {
                setData(res);
                setLoading(false);
            }, 1200);
        };

        if (state.data) {
            fetchData(state.data);
        }
    }, [state]);

    const handleCreateComment = async () => {
        try {
            if (!state || !state.data || !profile || input === '') {
                return;
            }
            const res = await CommentService.create(state.data, profile?.id, input);
            if (res) {
                setData((prevData) => [res, ...prevData]);
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <SheetContainer
            title="REVIEWS"
            description="Share us your though here"
            open={state.visible}
            onClose={() => closeSheet(SheetType.CommentSheet)}
            className="flex flex-col h-full p-0"
            headerStyle="bg-[#f8f8f8] px-4 py-5 border-b-2 border-gray-300"
            side="right"
        >
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {data.map((item, index) => (
                        <CommentCard
                            url={item.user.avatar}
                            content={item.content}
                            date="20-12-2024 15:20"
                            name={item.user.fullname}
                            key={index}
                        />
                    ))}
                    {loading &&
                        Array(6)
                            .fill(null)
                            .map((_, index) => <CommentSkeleton key={index} />)}
                    {!loading && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <img src={EmptyComment} alt="No comments" className="w-48 opacity-70" />
                            <p className="text-gray-500 mt-4">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>

                {profile ? (
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Input
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCreateComment();
                                        setInput('');
                                    }
                                }}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 text-base border-none bg-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Type your comment..."
                            />
                            <Send
                                onClick={() => {
                                    handleCreateComment();
                                    setInput('');
                                }}
                                className="h-8 w-8 p-1.5 cursor-pointer text-gray-600 hover:text-black transition-colors"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center">
                        <Link to="/auth/login" className="text-base font-semibold hover:underline">
                            Login to share your thoughts
                        </Link>
                    </div>
                )}
            </div>
        </SheetContainer>
    );
}

export default memo(CommentSheet);
