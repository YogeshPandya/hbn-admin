"use client";
import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { customers } from "../api/api";
import { ApiResponse, Customer, ProfileCard } from "../components/common/customermanagement";



const CustomerManagement: React.FC = () => {
  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const fetchCustomers = async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = (await customers(pageNum)) as ApiResponse;

      if (!response?.data?.data) {
        throw new Error("Invalid API response structure");
      }

      const newCustomers = response.data.data;
      const total = response.data.total;

      if (newCustomers.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      setDisplayedCustomers((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const uniqueNewCustomers = newCustomers.filter(
          (c) => !existingIds.has(c._id)
        );
        const updatedList = [...prev, ...uniqueNewCustomers];
        setHasMore(updatedList.length < total);
        return updatedList;
      });

      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, []);

  if (error) {
    return (
      <div className="customer-management p-10 shadow-2xl">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => fetchCustomers(1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={scrollableRef}
      id="scrollableDiv"
      style={{
        height: "96vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="customer-management p-10 shadow-2xl"
    >
      <div className="header">
        <header className="container">
          <h1 className="title" style={{ padding: "6px" }}>
            All Customers
          </h1>
          <p className="subtitle">List your best programs or experiences</p>
        </header>
      </div>

      <InfiniteScroll
        dataLength={displayedCustomers.length}
        next={() => fetchCustomers(page)} // Simplified binding
        hasMore={hasMore}
        loader={<h4 className="text-center py-4">Loading...</h4>}
        scrollThreshold={0.9}
        endMessage={
          <p className="text-center py-6 text-gray-700 font-semibold tracking-wide">
            <b>You have seen all customers</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="customer-list">
          {displayedCustomers.map((customer) => (
            // <div key={customer._id} className="customer-card">
            //   <div className="customer-avatar">
            //     <img
            //       src={getProfilePictureUrl(customer.profile_picture)}
            //       alt={`${customer.first_name} ${customer.last_name}`}
            //       style={{ width: "50px", height: "50px", objectFit: "cover" }} // Optional styling
            //     />
            //   </div>
            //   <div className="customer-info pl-10">
            //     <h3 className=" font-semibold ">{`${customer.first_name} ${customer.last_name}`}</h3>
            //     <p className="customer-email">{customer.email}</p>
            //   </div>
            // </div>
            <>
              <ProfileCard customer={customer} />
              <div className="w-[70%] max-md:w-full h-[1px] bg-gray-300 "></div>
            </>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default CustomerManagement;




