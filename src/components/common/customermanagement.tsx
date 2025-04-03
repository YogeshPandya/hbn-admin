export interface ApiResponse {
  data: {
    data: Customer[];
    total: number;
    limit: number;
  };
}

export interface Customer {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string | { file_url: string }; // Updated to handle both string and object
}

// Helper function to get the correct image URL
const getProfilePictureUrl = (
  profilePicture?: string | { file_url: string }
) => {
  if (!profilePicture) {
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Fallback image
  }
  if (typeof profilePicture === "string") {
    return profilePicture; // Direct URL string
  }
  return (
    profilePicture.file_url ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  ); // Object with file_url
};

export function Avatar({ customer }: any) {
  return (
    <div className="customer-avatar">
      <img
        src={getProfilePictureUrl(customer.profile_picture)}
        alt={`${customer.first_name} ${customer.last_name}`}
        style={{ width: "50px", height: "50px", objectFit: "cover" }} // Optional styling
      />
    </div>
  );
}

export function ProfileCard({ customer }: any) {
  return (
    <section className="flex items-center p-5">
      <div className="flex gap-10 items-center w-[667px] max-md:gap-8 max-md:w-full max-sm:flex-col max-sm:gap-4 max-sm:text-center">
        <Avatar customer={customer} />
        <UserInfo customer={customer} />
      </div>
    </section>
  );
}
export function UserInfo({ customer }: any) {
  return (
    <div className="flex flex-col gap-1 max-sm:items-center">
      <h2 className="text-2xl font-semibold leading-7 text-zinc-800">
        {customer.first_name} {customer.last_name}
      </h2>
      <p className="text-sm leading-4 text-neutral-400">{customer.email}</p>
    </div>
  );
}
