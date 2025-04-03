"use client";

import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { vendors, updateVendorApproval } from "../api/api";
import {
  ApiResponse,
  ProfileCard,
  Vendor,
  VendorCard,
} from "../components/common/vendormanagement";

const VendorManagement: React.FC = () => {
  const [displayedVendors, setDisplayedVendors] = useState<Vendor[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewVendors, setReviewVendors] = useState<Vendor[]>([]);
  const [reviewHasMore, setReviewHasMore] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState(false);

  const scrollableRef = useRef<HTMLDivElement>(null);
  const reviewScrollableRef = useRef<HTMLDivElement>(null);

  const fetchVendors = async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = (await vendors(pageNum)) as ApiResponse;

      if (!response?.data?.data) {
        throw new Error("Invalid API response structure");
      }

      const newVendors = response.data.data.filter(
        (vendor) => vendor.status === "approved" || vendor.status === "declined"
      );
      const limit = response.data.limit;

      if (newVendors.length === 0 && response.data.data.length > 0) {
        setPage(pageNum + 1);
        setLoading(false);
        fetchVendors(pageNum + 1);
        return;
      }

      if (response.data.data.length < limit) {
        setHasMore(false);
      }

      setDisplayedVendors((prev) => {
        const existingIds = new Set(prev.map((v) => v._id));
        const uniqueNewVendors = newVendors.filter(
          (v) => !existingIds.has(v._id)
        );
        const updatedList = [...prev, ...uniqueNewVendors];
        setHasMore(response.data.data.length === limit);
        return updatedList;
      });

      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendors. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewVendors = async (pageNum: number) => {
    if (reviewLoading) return;

    // setReviewLoading(true);
    setError(null);

    try {
      const response = (await vendors(pageNum)) as ApiResponse;

      if (!response?.data?.data) {
        throw new Error("Invalid API response structure");
      }

      const newVendors = response.data.data.filter(
        (vendor) => vendor.status === "pending"
      );
      const limit = response.data.limit;

      if (newVendors.length === 0 ) {
        setReviewPage(pageNum );
        setReviewLoading(false);
        fetchReviewVendors(pageNum    );
        return;
      }

      if (response.data.data.length < limit) {
        setReviewHasMore(false);
      }

      setReviewVendors((prev) => {
        const existingIds = new Set(prev.map((v) => v._id));
        const uniqueNewVendors = newVendors.filter(
          (v) => !existingIds.has(v._id)
        );
        const updatedList = [...prev, ...uniqueNewVendors];
        setReviewHasMore(response.data.data.length === limit);
        return updatedList;
      });

      setReviewPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching review vendors:", error);
      setError("Failed to load review vendors. Please try again.");
      setReviewHasMore(false);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleApproval = async (vendorId: string, isApproved: boolean) => {
    try {
      console.log(
        `Calling updateVendorApproval for vendor ${vendorId} with isApproved: ${isApproved}`
      );
      await updateVendorApproval(vendorId, isApproved);

      // Find the vendor from reviewVendors
      const approvedVendor = reviewVendors.find((v) => v._id === vendorId);
      if (approvedVendor) {
        // Update the vendor's status and approval
        const updatedVendor = {
          ...approvedVendor,
          is_approved: isApproved,
          status: isApproved ? "approved" : "declined",
        };

        // Remove from review vendors
        setReviewVendors((prev) =>
          prev.filter((vendor) => vendor._id !== vendorId)
        );

        // Add to the top of displayed vendors if not already present
        setDisplayedVendors((prev) => {
          const exists = prev.some((v) => v._id === vendorId);
          if (exists) {
            // If already exists, update it and move to top
            return [updatedVendor, ...prev.filter((v) => v._id !== vendorId)];
          }
          // If new, add to top
          return [updatedVendor, ...prev];
        });
      }
    } catch (error) {
      console.error("Error updating vendor approval:", error);
      setError("Failed to update vendor status. Please try again.");
    }
  };

  useEffect(() => {
    fetchVendors(1);
    fetchReviewVendors(1);
  }, []);

  if (error) {
    return (
      <div className="vendor-management p-10 shadow-2xl min-h-screen">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => {
            fetchVendors(1);
            fetchReviewVendors(1);
          }}
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
      className="vendor-management p-10 shadow-2xl flex lg:justify-evenly"
      style={{
        height: "96vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <div className="">
        <div className="header">
          <header className="container">
            <h1 className="title" style={{ padding: "6px" }}>
              All Vendors
            </h1>
            <p className="subtitle">List your past projects or experiences</p>
          </header>
        </div>

        <div className="flex flex-col lg:flex-row">
          <InfiniteScroll
            dataLength={displayedVendors.length}
            next={() => fetchVendors(page)}
            hasMore={hasMore}
            loader={<h4 className="text-center py-4">Loading...</h4>}
            scrollThreshold={0.9}
            endMessage={
              <p className="text-center py-6 text-gray-700 font-semibold tracking-wide">
                <b>You have seen all vendors</b>
              </p>
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="vendor-list border-w lg:w-full">
              {displayedVendors.map((vendor) => (
                <ProfileCard
                  key={vendor._id}
                  vendor={vendor}
                  onClick={console.log}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      {
        <div
          className="vendor-profile border border-gray-600 hidden lg:block relative -top-10 lg:w-[70%]"
          style={{
            position: "sticky",
            top: "10px",
            height: "calc(100vh - 20px)",
            alignSelf: "flex-start",
            overflowY: "auto",
          }}
        >
          <div className="profile-content px-1">
            <div className="profile-header flex justify-between items-center p-2">
              <h1 className="text-xl font-bold leading-8 text-indigo-600">
                Review Vendors Profile
              </h1>
            </div>
            <div
              ref={reviewScrollableRef}
              id="reviewScrollableDiv"
              style={{ height: "calc(100vh - 100px)", overflowY: "auto" }}
            >
              <InfiniteScroll
                dataLength={reviewVendors.length}
                next={() => fetchReviewVendors(reviewPage)}
                hasMore={reviewHasMore}
                loader={<h4 className="text-center py-4"></h4>}
                scrollThreshold={0.9}
                endMessage={
                  <p className="text-center py-6 text-gray-700 font-semibold tracking-wide">
                    <b>No more vendors to review</b>
                  </p>
                }
                scrollableTarget="reviewScrollableDiv"
              >
                <div className="flex flex-col gap-2">
                  {reviewVendors.map((vendor, index) => (
                    <VendorCard
                      key={vendor._id}
                      vendor={vendor}
                      isLast={index === reviewVendors.length - 1}
                      onApproval={handleApproval}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default VendorManagement;
