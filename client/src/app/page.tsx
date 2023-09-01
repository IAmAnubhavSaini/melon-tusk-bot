import FileUpload from "@/app/file";
import Query from "@/app/query";

export default function Home() {
    return (<main>
        <h1>melon-tusk-bot</h1>
        <section>
            <h2>Upload</h2>
            <FileUpload/>
        </section>
        <section>
            <h2>Query</h2>
            <Query/>
        </section>
    </main>)
}
