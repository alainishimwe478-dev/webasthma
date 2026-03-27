import React, { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCheckCircle,
  FaEye,
  FaPlusCircle,
  FaVideo,
} from "react-icons/fa";
import AdminShell from "../components/Layout/AdminShell";
import { educationalContent } from "../utils/mockData";

const STORAGE_KEY = "asthma_admin_content";

const defaultForm = {
  title: "",
  category: "Medication",
  readTime: "",
  videoUrl: "",
  content: "",
};

const ContentManagement = () => {
  const [articles, setArticles] = useState(educationalContent);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      try {
        setArticles(JSON.parse(savedContent));
      } catch (error) {
        console.error("Failed to parse saved content:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.readTime.trim()) {
      setMessage("Please fill in title, read time, and content.");
      return;
    }

    const newArticle = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      readTime: formData.readTime.trim(),
      videoUrl: formData.videoUrl.trim() || null,
      content: formData.content.trim(),
    };

    setArticles((current) => [newArticle, ...current]);
    setFormData(defaultForm);
    setShowForm(false);
    setMessage("New content added successfully.");
  };

  const videoCount = articles.filter((item) => item.videoUrl).length;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Review asthma education resources and keep patient guidance up to date.
          </p>
        </div>

        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            <FaCheckCircle />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <div className="flex items-center gap-3 mb-3">
              <FaBookOpen className="text-blue-600 text-xl" />
              <h2 className="font-semibold text-gray-900">Published Articles</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{articles.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <div className="flex items-center gap-3 mb-3">
              <FaVideo className="text-emerald-600 text-xl" />
              <h2 className="font-semibold text-gray-900">Video Resources</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{videoCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <div className="flex items-center gap-3 mb-3">
              <FaEye className="text-purple-600 text-xl" />
              <h2 className="font-semibold text-gray-900">Review Queue</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{showForm ? 1 : 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resource Library</h2>
              <p className="text-sm text-gray-500 mt-1">
                Current educational articles available in the platform
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm((current) => !current);
                setMessage("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FaPlusCircle />
              {showForm ? "Close Form" : "New Content"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="p-6 border-b bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Medication">Medication</option>
                    <option value="Triggers">Triggers</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="Prevention">Prevention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Example: 4 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/video"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write the article summary or content details"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <FaPlusCircle />
                  Save Content
                </button>
              </div>
            </form>
          )}

          <div className="divide-y">
            {articles.map((item) => (
              <div
                key={item.id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 max-w-3xl">{item.content}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{item.readTime}</span>
                  <span>{item.videoUrl ? "Video included" : "Article only"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default ContentManagement;
