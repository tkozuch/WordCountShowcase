import { useState, useEffect } from "react";
import useSWR from "swr";

import { getRequestWithNativeFetch } from "./utilities";
import Chart from "./Chart";

function App() {
  const wordToCount = "et";
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
    const locals = pyodide.toPy({ posts: data, word: wordToCount });
    let countWords = pyodide.runPython(`
        def countWords(data):
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
      calculateWords(data);
    }
  }, [data]);

  return (
    <div className="w-full h-[100svh] h-[100vh] flex flex-col justify-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : data ? (
        <div>
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
          <div
            data-x-label="Post ID"
            data-y-label={`Word "${wordToCount}" count`}
            className="max-w-60 overflow-auto mx-auto after:content-[attr(data-x-label)] after:absolute after:left-1/2 after:-translate-x-1/2 before:content-[attr(data-y-label)] before:absolute before:top-1/2 before:-translate-y-1/2 before:-rotate-90 before:-translate-x-1/2 before:pb-12"
          >
            <div className="w-[2000px] h-96">
              <Chart
                data={wordCount}
                label={`Word "${wordToCount}" count`}
              ></Chart>
            </div>
          </div>
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}

export default App;
