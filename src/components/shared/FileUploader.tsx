import { useCallback, useState } from "react";
import { FileWithPath, useDropzone, FileRejection } from "react-dropzone";
import { Button } from "../ui/button";
import { X } from "lucide-react"; // Import close icon

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const rejection = fileRejections[0];
                if (rejection.errors[0].code === "file-too-large") {
                    setErrorMessage("File size must be under 5MB");
                } else if (rejection.errors[0].code === "file-invalid-type") {
                    setErrorMessage("Unsupported file type, please upload a valid image file (SVG, PNG, JPG, JPEG)");
                }
                return;
            }

            setErrorMessage(""); // ✅ Clear previous errors
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        },
        [fieldChange]
    );

    const removeFile = () => {
        setFile([]);
        setFileUrl("");
        fieldChange([]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg", ".svg"],
        },
        maxSize: MAX_FILE_SIZE, // Enforce max file size
    });

    return (
        <div
            {...getRootProps()}
            className="relative flex flex-center flex-col bg-dark-3 rounded-2xl cursor-pointer border-2 border-primary-500 border-dashed"
        >
            <input {...getInputProps()} className="cursor-pointer" />

            {fileUrl ? (
                <>
                    {/* Uploaded Image */}
                    <div className="relative flex flex-1 justify-center w-full p-5">
                        <img
                            src={fileUrl}
                            alt="uploaded-image"
                            draggable="false"
                            className="file-uploader_img rounded-2xl shadow-xl shadow-dark-2 select-none"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="shad-button_close_dark_4"
                        >
                            <img src="/assets/icons/close.svg" width={36} height={36} draggable="false" className="select-none"/>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="shad-form_message relative text-center p-4 flex items-center gap-1 ">
                            <p>{errorMessage}</p>
                            {/* Close Button for Error Message */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setErrorMessage("");
                                }}
                                className="shad-button_ghost"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <p className="file_uploader-filename">{file[0]?.name}</p>
                    <p className="file_uploader-label">Click or drag a new file to replace</p>
                </>
            ) : (
                <div className="file_uploader-box">
                    <img
                        src="/assets/icons/file-upload.svg"
                        draggable="false"
                        className="select-none"
                        width={120}
                        height={96.25}
                        alt="file-upload"
                    />
                    <h3 className="base-medium text-light-2 mb-2 mt-6">Drag and drop your files here</h3>
                    <p className="text-light-4 small-regular mb-4">SVG, PNG, JPG, JPEG (MAX: 5MB)</p>

                    {errorMessage && (
                        <div className="shad-form_message relative text-center p-4 flex items-center gap-1 mb-4">
                            <p>{errorMessage}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setErrorMessage("");
                                }}
                                className="shad-button_ghost"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <Button className="shad-button_dark_4">Select from device</Button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
