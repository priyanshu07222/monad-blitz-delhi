import { memo } from "react";
import PropTypes from "prop-types";
import AnimatedCard from "../ui/AnimatedCard";

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <AnimatedCard delay={delay}>
      <div className="text-6xl mb-lg filter drop-shadow-lg">{icon}</div>

      <div className="text-lg font-semibold mb-sm text-text-primary">
        {title}
      </div>

      <p
        className="text-sm leading-relaxed text-text-tertiary font-normal
        flex-grow flex items-center"
      >
        {description}
      </p>
    </AnimatedCard>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default memo(FeatureCard);
