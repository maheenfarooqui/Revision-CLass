
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API = "http://localhost:3000/posts";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;

  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDesc(post?.desc || "");
    setPreview(post?.image || "");
    setImage(null);
    setError("");
  }, [post]);

  // Show preview of newly selected image
  useEffect(() => {
    if (!image) return;

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("desc", desc.trim());

    if (image) {
      data.append("image", image);
    }

    try {
      if (post) {
        await axios.put(`${API}/${post._id}`, data);
      } else {
        if (!image) {
          setError("Please select an image.");
          setLoading(false);
          return;
        }

        await axios.post(API, data);
      }

      navigate("/feed");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="mb-6 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to feed
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {post ? "Edit your post" : "Create a post"}
          </h1>

          <p className="mt-2 mb-7 text-sm text-slate-400">
            {post
              ? "Update your description or choose a new image."
              : "Share an image with your feed."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Post image {post ? "(optional)" : ""}
              </label>

              <label
                htmlFor="image"
                className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-5 text-center transition hover:border-indigo-400"
              >
                <span className="text-2xl">↑</span>
                <span className="mt-2 text-sm font-medium">
                  Click to choose an image
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG or WEBP
                </span>
              </label>

              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  setImage(e.target.files?.[0] || null);
                }}
              />

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Post preview"
                    className="max-h-72 w-full rounded-xl object-contain bg-slate-950"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(post?.image || "");
                      }}
                      className="mt-2 text-sm text-rose-400 hover:text-rose-300"
                    >
                      Remove selected image
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="desc"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Description
              </label>

              <textarea
                id="desc"
                name="desc"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What's on your mind?"
                required
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : post
                  ? "Save changes"
                  : "Publish post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
