import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
interface DropFileInputProps {
  onFileChange: (files: File[]) => void;
}

const DropFileInput: React.FC<DropFileInputProps> = ({ onFileChange }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => wrapperRef.current?.classList.add('dragover');

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => wrapperRef.current?.classList.remove('dragover');

  const onDrop = (event: DragEvent<HTMLDivElement>) => wrapperRef.current?.classList.remove('dragover');

  const onFileDrop = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      onFileChange(updatedList);
    }
  }

  const fileRemove = (file: File) => {
    const updatedList = fileList.filter(f => f !== file);
    setFileList(updatedList);
    onFileChange(updatedList);
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={"https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png"}
            alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {
        fileList.length > 0 && (
          <div className="drop-file-preview">
            <p className="drop-file-preview__title">
              Ready to upload
            </p>
            {fileList.map((item, index) => (
              <div key={index} className="drop-file-preview__item">
                <div className="drop-file-preview__item__info">
                  <p>{item.name}</p>
                  <p>{(item.size / 1024).toFixed(2)} KB</p> {/* Show size in KB */}
                </div>
                <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>
                  x
                </span>
              </div>
            ))}
          </div>
        )
      }
    </>
  );
}

export default DropFileInput;
