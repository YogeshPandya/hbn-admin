import React from "react";
import toast from "react-hot-toast";
export const getProfilePictureUrl = (
  profilePicture?: string | { file_url: string }
) => {
  if (!profilePicture) {
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Fallback image
  }
  if (typeof profilePicture === "string") {
    return profilePicture.length > 2 && profilePicture.includes("network")
      ? profilePicture
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Direct URL string
  }
  return (
    profilePicture.file_url ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  ); // Object with file_url
};
export const ProfileCard = ({ vendor, onClick }: any) => {
  return (
    <>
      <article className="flex flex-col gap-2.5 items-start py-4 w-full cursor-pointer capitalize">
        <div className="flex flex-col gap-2.5 items-start  w-full max-md:px-2.5 max-md:py-4 max-sm:px-2 max-sm:py-3">
          <div className="flex gap-20 items-center w-full max-md:gap-10 max-sm:flex-col max-sm:gap-6">
            <ProfileImage vendor={vendor} />
            <ProfileInfo vendor={vendor} onClick={onClick} />
          </div>
        </div>
      </article>
      {/* Separator (50% width, centered) */}
      <div className="w-[90%] h-[1px] bg-gray-300  my-2"></div>
    </>
  );
};

export const ProfileImage = ({ vendor }: any) => {
  return (
    <figure className="relative h-[155px] w-[276px] max-md:h-[124px] max-md:w-[220px] max-sm:w-full max-sm:h-[150px]">
      <img
        src={getProfilePictureUrl(vendor.profile_picture)}
        alt={`${vendor.first_name} ${vendor.last_name}'s profile`}
        className="w-full h-full object-cover"
      />
    </figure>
  );
};

export const ProfileInfo = ({ vendor, onClick }: any) => {
  return (
    <div className="flex flex-col flex-1 gap-4 items-start max-sm:w-full">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2 items-start w-full max-w-[522px]">
          <header className="flex flex-col items-start w-[345px] max-md:w-full max-sm:w-full">
            <h1
              className="w-full text-2xl font-bold leading-7 text-zinc-800 max-md:text-2xl max-sm:text-xl"
              onClick={onClick}
            >
              {`${vendor.first_name} ${vendor.last_name}`}
            </h1>
            <p
              className={`w-full text-base font-bold leading-8 ${
                vendor.status === "pending"
                  ? "text-blue-500"
                  : vendor.status === "rejected"
                  ? "text-red-500"
                  : vendor.status === "accepted"
                  ? "text-green-500"
                  : "text-gray-500" // Fallback color if status is undefined or unrecognized
              } max-md:text-base max-sm:text-sm`}
            >
              Vendor status: {vendor.status || "N/A"}
            </p>
            <p className="w-full text-base font-bold leading-8 text-stone-500 max-md:text-base max-sm:text-sm">
              {vendor.professional_title || vendor.business_name
                ? `${vendor.professional_title} ${
                    vendor.business_name ? "||" : ""
                  } ${vendor.business_name || ""}`
                : "N/A"}
            </p>
          </header>
          <ReadMoreText maxLength={15}>
            {vendor.description || "No description available"}
          </ReadMoreText>
        </div>
      </div>
    </div>
  );
};

export interface ReadMoreTextProps {
  children: React.ReactNode;
  maxLength?: number;
}

export const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  children,
  maxLength = 150,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const text = typeof children === "string" ? children : "";

  const shouldShowReadMore = text.length > maxLength;
  const displayText =
    !isExpanded && shouldShowReadMore ? text.slice(0, maxLength) : text;

  return (
    <p className="w-[200px] text-sm leading-4 text-neutral-400 max-md:text-sm max-sm:text-xs">
      {displayText}
      {shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-bold text-zinc-800 text-opacity-90 ml-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 mt-2"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Read less" : "Read more..."}
        </button>
      )}
    </p>
  );
};

export interface Vendor {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string | { file_url: string };
  professional_title?: string;
  description?: string;
  business_name?: string;
  is_approved?: any;
  status?: string;
}

export interface ApiResponse {
  message: string;
  data: {
    data: Vendor[];
    total: number;
    page: string;
    limit: number;
  };
  status: boolean;
}

// ActionButton component
export interface ActionButtonProps {
  variant: "approve" | "decline";
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function ActionButton({
  variant,
  onClick,
  label,
  disabled,
}: ActionButtonProps) {
  const ApproveIcon = () => (
    <div className="">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6374 6.67131C11.7588 6.54558 11.826 6.37717 11.8245 6.20238C11.823 6.02758 11.7528 5.86037 11.6292 5.73677C11.5056 5.61316 11.3384 5.54305 11.1636 5.54153C10.9888 5.54001 10.8204 5.60721 10.6947 5.72865L7.57469 8.84864L6.31269 7.53731C6.25194 7.47428 6.17936 7.42383 6.0991 7.38884C6.01885 7.35386 5.93249 7.33502 5.84495 7.33341C5.75742 7.3318 5.67042 7.34745 5.58893 7.37946C5.50745 7.41147 5.43306 7.45922 5.37003 7.51998C5.30699 7.58074 5.25654 7.65332 5.22156 7.73357C5.18657 7.81383 5.16774 7.90019 5.16613 7.98772C5.16452 8.07526 5.18017 8.16225 5.21218 8.24374C5.24419 8.32523 5.29194 8.39961 5.35269 8.46264L7.08603 10.2626C7.1475 10.3264 7.22107 10.3773 7.30243 10.4123C7.38379 10.4473 7.47131 10.4657 7.55988 10.4666C7.64844 10.4674 7.73629 10.4505 7.81827 10.417C7.90025 10.3835 7.97473 10.3339 8.03736 10.2713L11.6374 6.67131Z"
          fill="#119C07"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.49935 0.666626C4.44935 0.666626 1.16602 3.94996 1.16602 7.99996C1.16602 12.05 4.44935 15.3333 8.49935 15.3333C12.5493 15.3333 15.8327 12.05 15.8327 7.99996C15.8327 3.94996 12.5493 0.666626 8.49935 0.666626ZM2.49935 7.99996C2.49935 7.21203 2.65454 6.43181 2.95607 5.70386C3.2576 4.97591 3.69956 4.31447 4.25671 3.75732C4.81386 3.20017 5.4753 2.75821 6.20325 2.45668C6.9312 2.15515 7.71142 1.99996 8.49935 1.99996C9.28728 1.99996 10.0675 2.15515 10.7955 2.45668C11.5234 2.75821 12.1848 3.20017 12.742 3.75732C13.2991 4.31447 13.7411 4.97591 14.0426 5.70386C14.3442 6.43181 14.4993 7.21203 14.4993 7.99996C14.4993 9.59126 13.8672 11.1174 12.742 12.2426C11.6168 13.3678 10.0906 14 8.49935 14C6.90805 14 5.38193 13.3678 4.25671 12.2426C3.13149 11.1174 2.49935 9.59126 2.49935 7.99996Z"
          fill="#119C07"
        />
      </svg>
    </div>
  );

  const DeclineIcon = () => (
    <div className="">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_397_23402)">
          <path
            d="M8 0C6.41775 0 4.87104 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0ZM8 14.6667C6.68146 14.6667 5.39253 14.2757 4.2962 13.5431C3.19987 12.8106 2.34539 11.7694 1.84081 10.5512C1.33622 9.33305 1.2042 7.99261 1.46144 6.6994C1.71867 5.40619 2.35361 4.21831 3.28596 3.28596C4.21831 2.35361 5.4062 1.71867 6.6994 1.46143C7.99261 1.2042 9.33305 1.33622 10.5512 1.8408C11.7694 2.34539 12.8106 3.19987 13.5431 4.2962C14.2757 5.39253 14.6667 6.68146 14.6667 8C14.6647 9.76752 13.9617 11.4621 12.7119 12.7119C11.4621 13.9617 9.76752 14.6647 8 14.6667Z"
            fill="#C60A0A"
          />
          <path
            d="M10.4704 5.52869C10.3454 5.40371 10.1759 5.3335 9.99908 5.3335C9.8223 5.3335 9.65276 5.40371 9.52774 5.52869L7.99908 7.05735L6.47041 5.52869C6.34468 5.40725 6.17627 5.34005 6.00148 5.34157C5.82668 5.34309 5.65947 5.4132 5.53587 5.53681C5.41226 5.66041 5.34215 5.82762 5.34063 6.00242C5.33911 6.17722 5.40631 6.34562 5.52774 6.47135L7.05641 8.00002L5.52774 9.52869C5.46407 9.59019 5.41328 9.66375 5.37834 9.74508C5.3434 9.82642 5.32501 9.9139 5.32424 10.0024C5.32347 10.0909 5.34034 10.1787 5.37386 10.2607C5.40738 10.3426 5.45689 10.417 5.51948 10.4796C5.58208 10.5422 5.65651 10.5917 5.73844 10.6252C5.82037 10.6588 5.90816 10.6756 5.99668 10.6749C6.0852 10.6741 6.17268 10.6557 6.25401 10.6208C6.33535 10.5858 6.40891 10.535 6.47041 10.4714L7.99908 8.94269L9.52774 10.4714C9.65348 10.5928 9.82188 10.66 9.99668 10.6585C10.1715 10.657 10.3387 10.5868 10.4623 10.4632C10.5859 10.3396 10.656 10.1724 10.6575 9.99762C10.659 9.82282 10.5918 9.65442 10.4704 9.52869L8.94174 8.00002L10.4704 6.47135C10.5954 6.34634 10.6656 6.1768 10.6656 6.00002C10.6656 5.82324 10.5954 5.65371 10.4704 5.52869Z"
            fill="#C60A0A"
          />
        </g>
        <defs>
          <clipPath id="clip0_397_23402">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );

  const buttonClasses =
    variant === "approve"
      ? `border-green-700 bg-green-700 bg-opacity-10 text-green-700 
        `
      : `border-red-700 bg-red-700 bg-opacity-10 text-red-700 `;

  return (
    <button
      onClick={onClick}
      className={`flex gap-1 items-center px-4 py-2 rounded border ${buttonClasses}`}
    >
      {variant === "approve" && <ApproveIcon />}
      <span className="text-base leading-5">{label}</span>
      {variant === "decline" && <DeclineIcon />}
    </button>
  );
}

// Divider component

// VendorCard component
export interface VendorCardProps {
  vendor: Vendor;
  isLast: boolean;
  onApproval: (vendorId: string, isApproved: boolean) => Promise<void>;
}

export function VendorCard({ vendor, isLast, onApproval }: VendorCardProps) {
  const handleApprove = async () => {
    toast.success("Vendor Approved!");

    await onApproval(vendor._id, true);
  };

  const handleDecline = async () => {
    await onApproval(vendor._id, false);
    toast.error("Vendor Decclined!");
  };

  return (
    <article className="flex flex-col gap-2 ">
      <div className="flex gap-5 items-center">
        <div className="overflow-hidden relative rounded h-[62px] w-[110px]">
          <img
            src={getProfilePictureUrl(vendor.profile_picture)}
            alt={`${vendor.first_name} ${vendor.last_name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 ">
            <h2 className="text-xs font-bold  text-zinc-800 capitalize">
              {vendor.first_name} {vendor.last_name}
            </h2>
            <p className="text-xs font-bold  text-stone-500">
              {vendor.professional_title || "N/A"}{" "}
              {vendor.business_name ? <p className="text-xs font-bold  text-stone-500">{vendor.business_name}</p> : " || N/A"}
            </p>
            <p className="text-xs  text-neutral-400">
                {vendor.description?.slice(0, 10) || "No description available"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 p-1">
        <ActionButton
          variant="approve"
          onClick={handleApprove}
          label="Approve"
          disabled={vendor.is_approved === true} // Explicitly check for true
        />
        <ActionButton
          variant="decline"
          onClick={handleDecline}
          label="Decline"
          disabled={vendor.is_approved === true} // Explicitly check for true
        />
      </div>
      {!isLast && <div className="w-[96%] h-[1px] bg-gray-300  "></div>}
    </article>
  );
}
