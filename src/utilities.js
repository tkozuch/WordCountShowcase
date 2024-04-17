/**
 * Get posts body from API endpoint.
 *
 * @param {string} url
 * @returns {{id: Number, body: String}[]}
 */
export const getPostsBody = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }

  const data = await response.json();
  return data.map((post) => ({ id: post.id, body: post.body }));
};
