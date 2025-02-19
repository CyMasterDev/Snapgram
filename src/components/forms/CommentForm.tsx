import React from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CommentValidation } from '@/lib/validation'
import Spinner from '../shared/Spinner'
import { Models } from 'appwrite'
import { useUserContext } from '@/context/AuthContext'
import { z } from 'zod'
import { useCreatePost, useEditPost } from '@/lib/react-query/queriesAndMutations'

type CommentFormProps = {
    comment?: Models.Document;
    action: "Create" | "Edit";
};


const CommentForm = ({ comment, action }: CommentFormProps) => {
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: editPost, isPending: isLoadingEdit } = useEditPost();
    const { user } = useUserContext();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: comment ? comment.comment : "",
        },
    });

    async function onSubmit(values: z.infer<typeof PostValidation>) {
        if (post && action === "Edit") {
            const editedPost = await editPost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl,
            });

            // Redirect if the current user is not the creator when editing for additional security (extra one onSubmit just to make sure)
            if (post.creator.$id !== user.id) {
                toast({
                    title: "Permission Denied",
                    description: "You cannot edit this post as it belongs to another user. Please contact the author for any changes.",
                    variant: "destructive",
                });
                return navigate("/");
            }

            if (!editedPost) {
                toast({
                    title: "Error Editing Post",
                    description: "Something went wrong. Please check your connection and try again.",
                    variant: "destructive",
                });
                return navigate("/");
            }

            toast({
                title: "Successfully Edited Post",
                description: "Your post was edited successfully! Check it out!",
                variant: "default",
            });
            return navigate(`/posts/${post.$id}`);
        }

        const newPost = await createPost({
            ...values,
            userId: user.id,
        });

        if (!newPost) {
            toast({
                title: "Error Creating Post",
                description: "Something went wrong. Please check your connection and try again.",
                variant: "destructive",
            });
            return navigate("/");
        }

        toast({
            title: "Successfully Created Post",
            description: "Your post was created successfully! Check it out on your feed or profile!",
            variant: "default",
        });
        return navigate(`/`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder='Type your comment...' {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingEdit}
                    >
                        {(isLoadingCreate || isLoadingEdit) && <Spinner />}
                        {action} Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CommentForm