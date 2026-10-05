function ProfileAvatar({ image, name }) {
  const profileImage = image
    ? `http://localhost:5000${image}`
    : null;

  return (
    <div className="flex flex-col items-center">

      {/* Avatar */}
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