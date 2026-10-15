import { getProfileImageUrl } from "../services/profileService";

function ProfileAvatar({
  image,
  name,
  editable = false,
  onImageChange,
  uploading = false,
}) {
  const profileImage = getProfileImageUrl(image);

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-[#d90416] bg-gray-100 overflow-hidden flex items-center justify-center shadow-sm">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl font-bold text-gray-400">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {editable && (
          <>
            <label
              htmlFor="avatarUploadInput"
              className="
                absolute
                right-0
                bottom-0
                w-9
                h-9
                rounded-full
                bg-[#d90416]
                border-2
                border-white
                flex
                items-center
                justify-center
                cursor-pointer
                hover:bg-[#b90312]
                transition
                shadow-md
              "
              title="Change Profile Photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </label>

            <input
              id="avatarUploadInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageChange}
              disabled={uploading}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Name */}
      {name && (
        <h3 className="mt-4 text-xl font-bold text-black">
          {name}
        </h3>
      )}

      <p className="mt-1 text-sm text-gray-500">
        J-HUB Member
      </p>
    </div>
  );
}

export default ProfileAvatar;