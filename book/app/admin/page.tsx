"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  image?: string;
  previewUrl?: string;
}

export default function AdminPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "owengrady890@gmail.com";
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  
  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && (!userId || !isAdmin)) {
      router.push("/");
    }
  }, [isLoaded, userId, isAdmin, router]);

  useEffect(() => {
    // Fetch books from our Flask backend
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    const newBook = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      author,
      price: parseFloat(price),
      description,
      image,
      previewUrl
    };
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      
      if (res.ok) {
        setBooks([...books, newBook]);
        setSuccess(true);
        // Reset form
        setTitle("");
        setAuthor("");
        setPrice("");
        setDescription("");
        setImage("");
        setPreviewUrl("");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || `Failed to add book (Status: ${res.status})`);
      }
    } catch (err) {
      console.error("Failed to add book:", err);
      setError("Failed to connect to the backend server. Please check if the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setBooks(books.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  if (!isLoaded || !userId || !isAdmin) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 pb-24 font-inter">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-neutral-400">Manage your bookstore catalog.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Book Form */}
          <div className="lg:col-span-1 bg-neutral-900/50 border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Add New Book</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="The Pragmatic Programmer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Author</label>
                <input 
                  type="text" 
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="Andrew Hunt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="39.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="A book about software engineering..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Preview URL (Optional PDF/Link)</label>
                <input 
                  type="url" 
                  value={previewUrl}
                  onChange={e => setPreviewUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  placeholder="https://example.com/preview.pdf"
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg">
                  Book added successfully!
                </div>
              )}

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full font-semibold rounded-lg px-4 py-3 transition-colors mt-2 ${
                  submitting 
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {submitting ? "Adding Book..." : "Add Book"}
              </button>
            </form>
          </div>

          {/* Books List */}
          <div className="lg:col-span-2 bg-neutral-900/50 border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Catalog</h2>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-neutral-500">Loading books...</div>
            ) : books.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-neutral-500">No books found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-sm">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Author</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id} className="border-b border-white/5 last:border-0">
                        <td className="py-4 font-medium">{book.title}</td>
                        <td className="py-4 text-neutral-400">{book.author}</td>
                        <td className="py-4">${Number(book.price).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
