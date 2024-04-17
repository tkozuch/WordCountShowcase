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
    if (data) {
      calculateWords(data);
    }
  }, [data]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 max-w-7xl">
      {isLoading ? (
        <div className="text-xl flex flex-col justify-center">Loading...</div>
      ) : error ? (
        <div className="text-xl flex flex-col text-center">
          <span>Error while fetching the data: </span>
          <span className="text-base text-center mt-4">{error.message}</span>
        </div>
      ) : data ? (
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
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}

export default App;
