import { useCallback, useState } from "react";
import { FileWithPath, useDropzone, FileRejection } from "react-dropzone";
import { Button } from "../ui/button";
import { X } from "lucide-react"; // Import close icon
import { toast } from "@/hooks/use-toast";

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);
    const [errorMessage, setErrorMessage] = useState("");

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const rejection = fileRejections[0];
                if (rejection.errors[0].code === "file-too-large") {
                    setErrorMessage("File size must be under 5MB");
                } else if (rejection.errors[0].code === "file-invalid-type") {
                    setErrorMessage("Unsupported file type, please upload a valid image file (PNG, JPG, JPEG)");
                }
                return;
            }

            // Additional filter to prevent SVG files
            const filteredFiles = acceptedFiles.filter(file => !file.name.toLowerCase().endsWith(".svg"));
            if (filteredFiles.length !== acceptedFiles.length) {
                setErrorMessage("SVG files are currently not supported due to bucket storage issues. Please upload PNG, JPG, or JPEG.");
                toast
                return;
            }

            setErrorMessage(""); // ✅ Clear previous errors
            setFile(filteredFiles);
            fieldChange(filteredFiles);
            setFileUrl(URL.createObjectURL(filteredFiles[0]));
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
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
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
                            <X size={20}/>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="shad-form_message relative text-center p-4 flex items-center gap-1 ">
                            <p>{errorMessage}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setErrorMessage("");
                                }}
                                className="shad-button_ghost"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
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
                    <p className="text-light-4 small-regular mb-4">PNG, JPG, JPEG (MAX: 5MB)</p>

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
                                <X size={20} />
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
