"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface Order {
  orderId: string;
  userId: string;
  items: string[];
  timestamp: string;
  status: string;
  deliveryDate: string;
  progress: number;
}

const BOOKS_FALLBACK = [
  { id: 1, title: "People Read like a book", author: "Bill Wilder", price: 45.99 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 39.99 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 42.50 },
  { id: 4, title: "Introduction to Algorithms", author: "Thomas H. Cormen", price: 89.99 },
];

function OrdersContent() {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>(BOOKS_FALLBACK);

  useEffect(() => {
    // Fetch books to get correct titles
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books");
        if (res.ok) {
          const data = await res.json();
          setAllBooks(data);
        }
      } catch (e) {
        console.error("Failed to fetch books in orders:", e);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const savedOrders = JSON.parse(localStorage.getItem("bookstore_orders") || "[]");
    
    // Check for success redirect
    const success = searchParams.get("success");
    if (success === "1") {
      const pendingItems = JSON.parse(localStorage.getItem("pending_checkout") || "[]");
      if (pendingItems.length > 0) {
        const newOrder: Order = {
          orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
          userId: userId,
          items: pendingItems,
          timestamp: new Date().toISOString(),
          status: "Processing",
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
          progress: 15,
        };
        
        const updatedOrders = [...savedOrders, newOrder];
        localStorage.setItem("bookstore_orders", JSON.stringify(updatedOrders));
        localStorage.removeItem("pending_checkout");
        setOrders(updatedOrders.filter(o => o.userId === userId).reverse());
        
        // Clean up URL
        window.history.replaceState({}, '', '/orders');
      } else {
        setOrders(savedOrders.filter((o: Order) => o.userId === userId).reverse());
      }
    } else {
      setOrders(savedOrders.filter((o: Order) => o.userId === userId).reverse());
    }
  }, [userId, searchParams]);

  const getBook = (id: string) => allBooks.find(b => String(b.id) === String(id));

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-16">
        <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter">My Orders</h1>
        <p className="text-neutral-400 text-xl max-w-3xl leading-relaxed">
          Manage your purchases and track your book sanctuary deliveries in real-time.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="p-20 text-center border border-white/5 bg-neutral-900/30 rounded-3xl">
          <p className="text-neutral-400 text-lg mb-8">You haven&apos;t placed any orders yet.</p>
          <Link href="/browse" className="px-10 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-transform inline-block text-lg">
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const totalPrice = order.items.reduce((acc, id) => acc + Number(getBook(id)?.price || 0), 0);
            
            return (
              <div 
                key={order.orderId} 
                className="group relative bg-neutral-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-neutral-900/50 hover:border-white/30 shadow-2xl"
              >
                {/* Large Header */}
                <div className="p-8 flex flex-wrap items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                      <span className="text-blue-400 text-sm font-black tracking-tighter">#{order.orderId.split('-')[1]}</span>
                    </div>
                    <div>
                      <p className="font-black text-lg text-white mb-0.5">{new Date(order.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-black">{order.items.length} {order.items.length === 1 ? 'Book' : 'Books'} in this order</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-black mb-1">Grand Total</p>
                      <p className="text-3xl font-black text-white tracking-tighter">${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                        {order.status === "Processing" ? "Payment Successful" : order.status}
                      </span>
                    </div>
                    <div className="text-neutral-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                      <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Section (Hover Effect) */}
                <div className="max-h-0 opacity-0 group-hover:max-h-[1500px] group-hover:opacity-100 transition-all duration-1000 ease-in-out overflow-hidden border-t border-white/10 bg-black/40">
                  <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Items List */}
                    <div className="space-y-8">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 border-b border-white/5 pb-4">Order Manifest</p>
                      <div className="space-y-5">
                        {order.items.map((itemId, i) => {
                          const book = getBook(itemId);
                          return (
                            <div key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:translate-x-2">
                              <div className="w-16 h-20 bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl border border-white/10">
                                {book?.image ? (
                                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-black text-white truncate mb-1">{book?.title || `Book ID: ${itemId}`}</p>
                                <p className="text-sm text-neutral-500 truncate font-medium">by {book?.author || 'Unknown Author'}</p>
                              </div>
                              <p className="text-xl font-black text-white tracking-tighter">${Number(book?.price || 0).toFixed(2)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-12">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Payment Method</p>
                          <p className="text-base font-bold text-white">Card / UPI / NetBanking</p>
                          <p className="text-[10px] text-emerald-400 font-black mt-3 flex items-center gap-2 tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            VERIFIED BY STRIPE
                          </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Expected Arrival</p>
                          <p className="text-base font-bold text-white">{order.deliveryDate}</p>
                          <p className="text-[10px] text-blue-400 font-black mt-3 uppercase tracking-widest italic">Standard Tracking Active</p>
                        </div>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Track Order</p>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400">{order.progress}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-1000"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <div className="mt-4 flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className={cn(order.progress >= 0 ? "text-emerald-400" : "text-neutral-600")}>Placed</span>
                          <span className={cn(order.progress >= 50 ? "text-blue-400" : "text-neutral-600")}>Shipped</span>
                          <span className={cn(order.progress >= 100 ? "text-emerald-400" : "text-neutral-600")}>Arrived</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Tech Footer Simulation */}
      <footer className="mt-24 p-8 border-t border-white/5 flex flex-col items-center gap-4 opacity-50">
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">
          <span>Powered by AWS EC2</span>
          <span>DynamoDB Active</span>
          <span>Flask RESTful API</span>
        </div>
        <p className="text-[10px] text-neutral-600">© 2026 Cloud Solutions Department. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 lg:px-24 text-white font-inter">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-white">Loading Orders...</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
