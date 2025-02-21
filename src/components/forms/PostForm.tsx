import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PostValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";

import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useCreatePost, useEditPost } from "@/lib/react-query/queriesAndMutations";
import Spinner from "../shared/Spinner";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Edit";
};

export const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync: editPost, isPending: isLoadingEdit } = useEditPost();
  const { user } = useUserContext();
  const navigate = useNavigate();

  // Redirect if the current user is not the creator when editing for additional security
  useEffect(() => {
    if (action === "Edit" && post) {
      if (post.creator.$id !== user.id) {
        navigate("/");
      }
    }
  }, [action, post, user, navigate]);

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === "Edit") {
      const editedPost = await editPost({
        post: {
          ...values,
          postId: post.$id,
          imageId: post?.imageId,
          imageUrl: post?.imageUrl,
        },
        currentUserId: user.id, // Assuming `user` is the logged-in user from context
        postCreatorId: post.creator.$id, // The ID of the post being edited
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
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Images</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label flex-start gap-1">
                Add Tags
                <p className="small-regular text-light-3">(separated by commas ",")</p>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="design, tech, lifestyle, music, art, culture, travel, food, fitness"
                  {...field}
                />
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
  );
};
