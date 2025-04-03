import React, { useEffect, useRef, useState } from "react";
import { ApiResponse, Vendor, VendorCard } from "./vendormanagement";
import { updateVendorApproval, vendors } from "../../api/api";
import InfiniteScroll from "react-infinite-scroll-component";

interface ReviewVendorsProps {
  vendors: Vendor[]; // Pass filtered vendors from parent or fetch them here
}

const ReviewVendors: React.FC = () => {
  const [displayedVendors, setDisplayedVendors] = useState<Vendor[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const pendingVendors = displayedVendors.filter(
    (vendor) => vendor.status === "pending"
  );
  
    const fetchVendors = async (pageNum: number) => {
      if (loading) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const response = (await vendors(pageNum)) as ApiResponse;
  
        if (!response?.data?.data) {
          throw new Error("Invalid API response structure");
        }
  
        const newVendors = response.data.data;
        const total = response.data.total;
        const limit = response.data.limit;
  
        if (newVendors.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }
  
        setDisplayedVendors((prev) => {
          const existingIds = new Set(prev.map((v) => v._id));
          const uniqueNewVendors = newVendors.filter(
            (v) => !existingIds.has(v._id)
          );
          const updatedList = [...prev, ...uniqueNewVendors];
          setHasMore(updatedList.length < total && newVendors.length === limit);
    
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
  
    const handleApproval = async (vendorId: string, isApproved: boolean) => {
      try {
        console.log(
          `Calling updateVendorApproval for vendor ${vendorId} with isApproved: ${isApproved}`
        );
        await updateVendorApproval(vendorId, isApproved);
        setDisplayedVendors((prev) =>
          prev.map((vendor) =>
            vendor._id === vendorId
              ? { ...vendor, is_approved: isApproved }
              : vendor
          )
        );
      } catch (error) {
        console.error("Error updating vendor approval:", error);
        setError("Failed to update vendor status. Please try again.");
      }
    };
  
    useEffect(() => {
      fetchVendors(1);
    }, []);
  
    if (error) {
      return (
        <div className="vendor-management p-10 shadow-2xl min-h-screen">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => fetchVendors(1)}
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
        className="vendor-management shadow-2xl border"
        style={{
          height: "96vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
  
        <div className="flex">
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
            <div
            className="vendor-profile  border   w-full "
            style={{
              // width: "100%",
              // position: "sticky",
              // top: "10px", // Adjust based on your layout
              // height: "calc(100vh - 20px)", // Adjust to match the container height minus padding
              // alignSelf: "flex-start",
              overflowY: "auto",
            }}
          >
            <div
              className="profile-content px-1"
              // style={{ height: "70vh", overflowY: "auto" }}
            >
              {" "}
              <div className="profile-header  flex justify-between items-center p-2">
                <h1 className="text-xl font-bold leading-8 text-indigo-600">
                  Review Vendors Profile
                </h1>
              </div>
              <div className="flex flex-col gap-6 justify-center ">
                {displayedVendors
                  .filter((vendor) => vendor.status=== "pending")
                  .map((vendor, index) => (
                    <VendorCard
                      key={vendor._id}
                      vendor={vendor}
                      isLast={index === displayedVendors.length - 1}
                      onApproval={handleApproval}
                    />
                  ))}
              </div>
            </div>
          </div>
          </InfiniteScroll>
  
         
        </div>
      </div>
  );
};

export default ReviewVendors;
