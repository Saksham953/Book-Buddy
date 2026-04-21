"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  user: string;
  text: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  recommendCount: number;
  reviews: Review[];
  previewUrl?: string;
}

const BOOKS_FALLBACK: Book[] = [
  { 
    id: 1, title: "People Read like a book", author: "Bill Wilder", price: 45.99, category: "Tech", image: "https://m.media-amazon.com/images/I/61tVw-EYRGL._UF1000,1000_QL80_.jpg",
    description: "An essential guide covering architectural patterns for scalable and reliable cloud applications.",
    rating: 4.8, reviewCount: 128, recommendCount: 115,
    previewUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reviews: [{ id: 1, user: "Alex T.", text: "A must-read for cloud engineers!" }, { id: 2, user: "Sarah J.", text: "Clear and practical examples." }]
  },
  { 
    id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 39.99, category: "Tech", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    description: "One of the most significant books in software engineering, offering practical advice and philosophy for developers.",
    rating: 4.9, reviewCount: 542, recommendCount: 530,
    previewUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    reviews: [{ id: 1, user: "DevGuru", text: "Changed the way I write code." }, { id: 2, user: "Jane C.", text: "Timeless advice." }]
  },
  { 
    id: 3, title: "Clean Code", author: "Robert C. Martin", price: 42.50, category: "Tech", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    description: "A handbook of agile software craftsmanship. Teaches you how to write better, more readable code.",
    rating: 4.7, reviewCount: 890, recommendCount: 850,
    reviews: [{ id: 1, user: "Mike R.", text: "Every developer should read this." }]
  },
  { 
    id: 4, title: "Introduction to Algorithms", author: "Thomas H. Cormen", price: 89.99, category: "Academic", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
    description: "The standard textbook on algorithms, used in universities worldwide.",
    rating: 4.6, reviewCount: 310, recommendCount: 295,
    reviews: [{ id: 1, user: "CS Student", text: "Heavy but absolutely necessary." }]
  },
];

export default function BrowsePage() {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [search, setSearch] = React.useState("");
  const [cart, setCart] = React.useState<number[]>([]);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books");
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        } else {
          setBooks(BOOKS_FALLBACK);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks(BOOKS_FALLBACK);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent opening modal when clicking cart button
    if (!cart.includes(id)) {
      setCart([...cart, id]);
      console.log(`SNS: Book ID ${id} added to potential order queue.`);
    }
  };

  const handlePurchase = async () => {
    if (cart.length === 0) return;
    
    // Save current cart for tracking orders post-checkout
    localStorage.setItem("pending_checkout", JSON.stringify(cart));
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Please log in first to purchase books.");
          return;
        }
        throw new Error("Network response was not ok");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Something went wrong with the checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 lg:px-24 font-inter">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter text-white">Browse Books</h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Discover a centralized sanctuary for local readers and students. 
            Find your next academic or leisure read today.
          </p>
        </header>

        {/* Search and Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-bold text-neutral-400">
              {cart.length} ITEMS IN CART
            </div>
            <button 
              onClick={handlePurchase}
              disabled={cart.length === 0}
              className={cn(
                "px-8 py-3 rounded-2xl font-bold transition-all",
                cart.length > 0 
                  ? "bg-white text-black hover:scale-105 active:scale-95 shadow-xl shadow-white/10" 
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              )}
            >
              Purchase Now
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              onClick={() => { setSelectedBook(book); setShowPreview(false); }}
              className="group relative bg-neutral-900/50 rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-white/20 hover:-translate-y-2 shadow-2xl cursor-pointer"
            >
              <div className="aspect-4/5 w-full relative">
                <img src={book.image} alt={book.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                    {book.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{book.title}</h2>
                <p className="text-neutral-500 text-sm mb-4">by {book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white">${Number(book.price).toFixed(2)}</span>
                  <button 
                    onClick={(e) => addToCart(e, book.id)}
                    className={cn(
                      "p-3 rounded-xl border transition-all",
                      cart.includes(book.id)
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        : "border-white/10 text-white hover:bg-white hover:text-black"
                    )}
                  >
                    {cart.includes(book.id) ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
            onClick={() => { setSelectedBook(null); setShowPreview(false); }}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <button 
              onClick={() => { setSelectedBook(null); setShowPreview(false); }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-10 mb-8 items-start">
                <img 
                  src={selectedBook.image} 
                  alt={selectedBook.title} 
                  className="w-full md:w-[220px] aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/5"
                />
                <div className="flex-1">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white border border-white/10 mb-4 inline-block">
                    {selectedBook.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedBook.title}</h2>
                  <p className="text-xl text-neutral-400 mb-4">by {selectedBook.author}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black text-white">${Number(selectedBook.price).toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-white ml-1">{selectedBook.rating}</span>
                      <span className="text-sm text-neutral-500 ml-1">({selectedBook.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed mb-6">
                    {selectedBook.description}
                  </p>

                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => addToCart(e, selectedBook.id)}
                      className={cn(
                        "flex-1 py-4 rounded-xl font-bold text-lg transition-all",
                        cart.includes(selectedBook.id)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white text-black hover:bg-neutral-200 shadow-xl"
                      )}
                    >
                      {cart.includes(selectedBook.id) ? "Added to Cart" : "Add to Cart"}
                    </button>
                    {selectedBook.previewUrl && (
                      <button 
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex-1 py-4 rounded-xl font-bold text-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-all border border-white/10"
                      >
                        {showPreview ? "Hide Preview" : "Preview Book Pages"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {showPreview && selectedBook.previewUrl && (
                <div className="mb-8 border border-white/10 rounded-xl overflow-hidden bg-white">
                  <iframe 
                    src={selectedBook.previewUrl} 
                    className="w-full h-[60vh]"
                    title={`${selectedBook.title} Preview`}
                  />
                </div>
              )}

              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Ratings & Reviews</h3>
                  <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-500/20">
                    👍 {selectedBook.recommendCount} users recommend this
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedBook.reviews && selectedBook.reviews.length > 0 ? (
                    selectedBook.reviews.map(review => (
                      <div key={review.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="font-bold text-white mb-1">{review.user}</div>
                        <p className="text-neutral-400 text-sm">{review.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-sm italic">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
