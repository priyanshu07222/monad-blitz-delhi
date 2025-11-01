import PropTypes from "prop-types";

const LeaderboardSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-xs">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-sm my-xs
          glass-morphism rounded-md border-l-4 border-l-gray-600 animate-pulse"
        >
          <div className="flex items-center space-x-sm">
            <div className="w-6 h-4 bg-gray-600 rounded"></div>
            <div className="w-20 h-3 bg-gray-600 rounded"></div>
          </div>
          <div className="w-16 h-4 bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  );
};

LeaderboardSkeleton.propTypes = {
  count: PropTypes.number,
};

export default LeaderboardSkeleton;
