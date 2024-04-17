import { useState, useEffect } from "react";
import useSWR from "swr";

import { getPostsBody } from "./utilities";
import Chart from "./Chart";
import info from "./assets/info.png";

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
   * @param {string} word
   *
   * @returns {Map<Number, Number>} PostId -> Occurrences mapping
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
    if (!result) return new Map();

    let unpack = result.toJs();
    return unpack;
  }

  useEffect(() => {
    if (posts) {
      calculateOccurrences(posts, wordToCount).then((occurrences) =>
        setWordCount(occurrences)
      );
    }
  }, [posts]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 max-w-7xl text-xl">
      {isLoading || !wordCount ? (
        "Loading..."
      ) : error ? (
        <div className="flex flex-col text-center">
          <span>Error while fetching the data: </span>
          <span className="text-base text-center mt-4">{error.message}</span>
        </div>
      ) : !posts ? (
        "No data to analyze."
      ) : (
        <>
          <div className="text-3xl font-bold md:text-5xl mb-[5vh] text-center">
            Occurences of word: &quot;{wordToCount}&quot;
          </div>
          <div className="self-end mb-4 flex items-center">
            <span className="text-xs xl:text-sm mr-4">
              Use mousewheel or fingers to zoom in
            </span>
            <img src={info} alt="Info icon" className="size-4 xl:size-6" />
          </div>
          <div
            data-x-label="Post ID"
            data-y-label={`Occurrences`}
            className={
              "w-full h-1/3 overflow-auto after:content-[attr(data-x-label)] " +
              // additional titles
              "relative text-base md:text-xl overflow-visible after:absolute after:left-1/2 after:-translate-x-1/2 before:content-[attr(data-y-label)] before:absolute before:top-1/2 before:-translate-y-1/2 before:-rotate-90 before:-translate-x-1/2 before:pb-8 after:text-white before:text-white" +
              // accommodate for title
              " pl-6"
            }
          >
            <Chart
              data={wordCount}
              label={`Word "${wordToCount}" count`}
            ></Chart>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
