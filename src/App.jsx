import { useState, useEffect } from "react";
import useSWR from "swr";

import { getPostsBody } from "./utilities";
import Graph from "./Graph";
import LoadingSpinner from "./LoadingSpinner";
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
    <div className="w-full h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 max-w-7xl text-3xl">
      <>
        <div
          className="text-3xl font-bold md:text-5xl xl:text-7xl mb-[5vh] text-center"
          title={`Occurrences of word: "${wordToCount}" in ${apiEndpoint} data`}
        >
          Occurrences of word: &quot;{wordToCount}&quot;
        </div>
        <div className="self-end mb-4 flex items-center font-light">
          <span className="text-xs xl:text-sm mr-4">
            Use mousewheel or fingers to zoom in
          </span>
          <img src={info} alt="Info icon" className="size-4 xl:size-6" />
        </div>
        <main
          data-x-label="Post ID"
          data-y-label="Occurrences"
          className={
            "w-full h-1/3 " +
            // additional titles
            "relative text-base md:text-xl overflow-visible after:content-[attr(data-x-label)] before:content-[attr(data-y-label)] before:-rotate-90 before:-translate-x-1/2 before:pb-8 before:transform-center-y after:transform-center-x" +
            // accommodate for title
            " pl-6 "
          }
        >
          {/* Status message wrapper, to display it over the graph */}
          <div className={"transform-center opacity-50 pointer-events-none"}>
            {error ? (
              <div className="flex flex-col text-center ">
                <span>Error while fetching the data: </span>
                <span className="text-base text-center mt-4 line-clamp-2">
                  {error.message}
                </span>
              </div>
            ) : isLoading || !wordCount.size ? (
              <LoadingSpinner />
            ) : (
              !posts && "No data to analyze."
            )}
          </div>
          <Graph data={wordCount} label={`Word "${wordToCount}" count`}></Graph>
        </main>
        <div className="text-sm lg:text-base mt-8 sm:mt-12 self-center text-center sm:self-start sm:text-start sm:pl-8 opacity-50 font-thin break-word">
          Number of word: &quot;{wordToCount}&quot; occurrences in the body of
          posts fetched from{" "}
          <a href={apiEndpoint} className="cursor-pointer  underline break-all">
            {apiEndpoint}
          </a>
          .
        </div>
      </>
    </div>
  );
}

export default App;
