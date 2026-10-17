
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/posts";

const Feed = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError("");

        const res = await axios.get(API);
        setPosts(res.data.post || []);
      } catch (err) {
        console.error(err);
        setError("Could not load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const deleteHandler = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API}/${id}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Could not delete the post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const editHandler = (post) => {
    navigate("/create-post", {
      state: { post },
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
              Your space
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              My Feed<span className="text-indigo-500">.</span>
            </h1>

            <p className="mt-3 text-slate-400">
              All your posts in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
          >
            + Create post
          </button>
        </header>

        {loading ? (
          <p className="py-16 text-center text-slate-400">
            Loading posts...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-6 text-center">
            <p className="text-rose-300">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-20 text-center">
            <div className="text-4xl">✦</div>

            <h2 className="mt-4 text-xl font-semibold">
              No posts yet
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first post to get started.
            </p>

            <button
              onClick={() => navigate("/create-post")}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-800">
                  <img
                    src={post.image}
                    alt={post.desc}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="whitespace-pre-wrap break-words leading-7 text-slate-200">
                    {post.desc}
                  </p>

                  <div className="mt-5 flex gap-3 border-t border-slate-800 pt-4">
                    <button
                      onClick={() => editHandler(post)}
                      className="flex-1 rounded-lg bg-indigo-600/15 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteHandler(post._id)}
                      disabled={deletingId === post._id}
                      className="flex-1 rounded-lg bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                    >
                      {deletingId === post._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
