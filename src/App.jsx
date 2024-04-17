import { useState, useEffect } from "react";
import useSWR from "swr";

import { getRequestWithNativeFetch } from "./utilities";
import Chart from "./Chart";

function App() {
  const wordToCount = "et";
  const topPopularWords = 5;
  /**
   * @type {{data: {userId: Number, id: Number, title: String, body: String}[]}}
   */
  const { data, error, isLoading } = useSWR(
    "https://jsonplaceholder.typicode.com/posts",
    getRequestWithNativeFetch
  );
  const [wordCount, setWordCount] = useState(new Map());
  const [popularWords, setPopularWords] = useState([]);

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

  async function mostCommonWords(data) {
    var wordCounts = {};

    for (var i = 0; i < data.length; i++) {
      var words = data[i].body.split(/\b/);
      for (var j = 0; j < words.length; j++) {
        if (/^[a-zA-Z]+$/.test(words[j])) {
          wordCounts["_" + words[j]] = (wordCounts["_" + words[j]] || 0) + 1;
        }
      }
    }

    var sortable = [];
    for (var word in wordCounts) {
      console.log("in js", word);
      sortable.push([word.replaceAll("_", ""), wordCounts[word]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    let mostPopular = sortable.slice(0, topPopularWords);
    let wordsOnly = mostPopular.map((el) => el[0]);

    setPopularWords(wordsOnly);
  }

  useEffect(() => {
    if (data) {
      calculateWords(data);
      mostCommonWords(data);
    }
  }, [data]);

  return (
    <div className="w-full h-screen flex flex-col justify-center bg-neutral-600">
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
          {/* {popularWords && (
            <div>
              popular:
              {popularWords.map((word) => {
                return <div key={word}>{word}</div>;
              })}
            </div>
          )} */}
          <div
            data-x-label="Post ID"
            data-y-label={`Word "${wordToCount}" count`}
            className="max-w-60 lg:max-w-7xl overflow-auto mx-auto after:content-[attr(data-x-label)] after:absolute after:left-1/2 after:-translate-x-1/2 before:content-[attr(data-y-label)] before:absolute before:top-1/2 before:-translate-y-1/2 before:-rotate-90 before:-translate-x-1/2 before:pb-12 after:text-white before:text-white"
          >
            <div className="w-60 h-80">
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
