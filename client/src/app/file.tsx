"use client";

import {createRef, FormEvent, useEffect, useState} from "react";

export default function FileUpload() {
    const [extensions, setExtensions] = useState("pdf,txt");
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const action = "http://localhost:5000/upload";

    const file_ref = createRef<HTMLInputElement>();
    function clearError(){
        setError('');
        setFile(null);
        if(file_ref.current){
            file_ref.current.value = '';
        }
    }

    useEffect(() => {
        fetch("http://localhost:5000/allowed-extensions").then(response => {
            return response.json();
        }).then(data => {
            console.log({data});
            setExtensions(data.join(','));
        }).catch(error => {
            console.log(error);
            setExtensions("pdf,txt");
        });
    }, []);

    function onChange(e: any) {
        e.preventDefault();
        console.log(e);
        const file = e?.target?.files[0];
        if (file) {
            const extension = file.name.split('.').pop();
            if (extensions.includes(extension)) {
                setFile(file);
                setError('');
            } else {
                setError('invalid file type');
            }
        } else {
            setError('no file selected');
        }
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (file && !error) {
            const formData = new FormData();
            formData.append('file', file);
            fetch(action, {
                method: 'POST',
                body: formData
            }).then(response => {
                console.log(response);
                setFile(null);
            }).catch(error => {
                console.log(error);
                setFile(null);
            });
        }
    }
    return (<div className="file-upload-component" onLoad={clearError}>
        {error && (<div
            className={"bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"}
            role="alert"
            onClick={clearError}
            >
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>)}
        <input type="file" id="file" onChange={onChange} accept="pdf,txt" ref={file_ref}/>
        <button type="submit" onClick={onSubmit} disabled={!!error && !!file}>submit</button>
    </div>);
}
