import { useState } from "react"
export function EntryBox() {
    const [postsText, setPostsText] = useState("");

    

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    
    return (
        <form method="post" onSubmit={handleSubmit}>
            <label> Enter post: 
                <br />
                <textarea name="textInput"                 
                value = {postsText}
                onChange = {(event) => setPostsText(event.target.value)} />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );

}