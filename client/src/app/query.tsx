'use client';

import {FormEvent, useRef, useState} from "react";

export default function Query() {
    const [query, setQuery] = useState('');
    const past = useRef<string[]>([]);

    function onChange(e: any) {
        e.preventDefault();
        setQuery(e.target.value);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if(!query){
            return;
        }
        console.log(e);
        past.current.push(query);
        fetch("http://localhost:5000/query?q=" + query, {
            method: 'GET',
        }).then(response => {
            // console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            past.current.push(data.data || "no response");
            setQuery('');
        }).catch(error => {
            console.log(error);
            past.current.push(error.message);
            setQuery('');
        });
    }

    return (<div>
        <div>
            {past.current.map((value, index) => {
                return (<div key={index}>{value}</div>)
            })}
        </div>
        <textarea onChange={onChange} value={query}/>
        <button onClick={onSubmit} disabled={!query}>submit</button>
    </div>)
}
