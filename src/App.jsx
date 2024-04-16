import { useState, useEffect } from "react";
import useSWR from "swr";

import { getRequestWithNativeFetch } from "./utilities";
import Chart from "./Chart";

function App() {
  /**
   * @type {{data: {userId: Number, id: Number, title: String, body: String}[]}}
   */
  const { data, error, isLoading } = useSWR(
    "https://jsonplaceholder.typicode.com/posts",
    getRequestWithNativeFetch
  );
  const [wordCount, setWordCount] = useState(new Map());

  async function calculateWords(data) {
    let pyodide = await window.loadPyodide();
    const locals = pyodide.toPy({ posts: data, word: "et" });
    let countWords = pyodide.runPython(`
        def countWords(data):
            print(data["word"], data["posts"])
            return {post["id"]: post["body"].split().count(data["word"]) for post in data["posts"]}
        countWords
    `);

    let result = countWords(locals);
    if (result) {
      let unpack = result.toJs();
      setWordCount(unpack);
    }
  }

  useEffect(() => {
    if (data) {
      console.log("data present");
      calculateWords(data);
    }
  }, [data]);

  useEffect(() => {
    console.log("word count changed: ", wordCount);
  }, [wordCount]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : data ? (
        <div>
          Data:
          {/* {wordCount && (
            <div>
              Result:
              {[...wordCount.entries()].map(([postId, wordCount]) => {
                return (
                  <div key={postId}>
                    PostID: {postId}, WordCount: {wordCount}
                  </div>
                );
              })}
            </div>
          )} */}
          <Chart></Chart>
        </div>
      ) : (
        <div>No data</div>
      )}
    </>
  );
}

export default App;
