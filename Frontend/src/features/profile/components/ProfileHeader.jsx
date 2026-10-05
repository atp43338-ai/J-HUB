function ProfileHeader({
  title,
  highlight,
  description,
}) {
  return (
    <div className="mb-8">

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold">
        <span className="text-black">
          {title}
        </span>

        {highlight && (
          <span className="text-[#d90416] ml-2">
            {highlight}
          </span>
        )}
      </h2>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm md:text-base text-gray-500">
          {description}
        </p>
      )}

    </div>
  );
}

export default ProfileHeader;