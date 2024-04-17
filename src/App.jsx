import { useState, useEffect } from "react";
import useSWR from "swr";

import { getPostsBody } from "./utilities";
import Chart from "./Chart";

function App() {
  const wordToCount = "et";
  const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";
  /**
   * @type {{posts: {id: Number, body: String}[]}}
   */
  const { data: posts, error, isLoading } = useSWR(apiEndpoint, getPostsBody);
  const [wordCount, setWordCount] = useState(new Map());

  /**
   * Calculate count of a given word in posts body.
   *
   * @param {{id: Number, body: String}[]} posts
   */
  async function calculateOccurrences(posts, word) {
    let pyodide = await window.loadPyodide();
    const locals = pyodide.toPy({ posts, word });
    let countWords = pyodide.runPython(`
        def countWords(data):
            return {post["id"]: post["body"].split().count(data["word"].lower()) for post in data["posts"]}
        countWords
    `);

    let result = countWords(locals);
    if (result) {
      let unpack = result.toJs();
      setWordCount(unpack);
    }
  }

  useEffect(() => {
    if (posts) {
      calculateOccurrences(posts, wordToCount);
    }
  }, [posts]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 max-w-7xl text-xl">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <div className="flex flex-col text-center">
          <span>Error while fetching the data: </span>
          <span className="text-base text-center mt-4">{error.message}</span>
        </div>
      ) : !posts ? (
        "No data"
      ) : (
        <div
          data-x-label="Post ID"
          data-y-label={`Word "${wordToCount}" count`}
          className={
            "w-full h-1/3 overflow-auto after:content-[attr(data-x-label)] " +
            // additional titles
            "after:absolute after:left-1/2 after:-translate-x-1/2 before:content-[attr(data-y-label)] before:absolute before:top-1/2 before:-translate-y-1/2 before:-rotate-90 before:-translate-x-1/2 before:pb-8 after:text-white before:text-white" +
            // accommodate for title
            " pl-6"
          }
        >
          <Chart data={wordCount} label={`Word "${wordToCount}" count`}></Chart>
        </div>
      )}
    </div>
  );
}

export default App;
