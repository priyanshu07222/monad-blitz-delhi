import PropTypes from "prop-types";

const ScrollableContainer = ({
  children,
  maxHeight = "max-h-80",
  className = "",
}) => {
  return (
    <div
      className={`${maxHeight} overflow-y-auto p-sm bg-glass-bg rounded-lg
      border border-glass-border ${className} scrollbar-thin scrollbar-track-glass-bg
      scrollbar-thumb-glass-border hover:scrollbar-thumb-glass-border-hover`}
    >
      <style jsx>{`
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-track-glass-bg::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .scrollbar-thumb-glass-border::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .hover\\:scrollbar-thumb-glass-border-hover::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      {children}
    </div>
  );
};

ScrollableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
  className: PropTypes.string,
};

export default ScrollableContainer;
