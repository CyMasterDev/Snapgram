import { PostForm } from "@/components/forms/PostForm"
import { useParams } from "react-router-dom"

const EditPost = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            draggable="false"
            className="select-none"
            alt="edit"
          />

          <h2 className="h3-bold md:h-2-bold text-left w-full">
            Edit Post
          </h2>
        </div>

        <PostForm />
      </div>
    </div>
  )
}

export default EditPost