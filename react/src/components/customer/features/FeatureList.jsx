import React from "react";

const FeatureList = ({ children }) => {
  return (
    <section className="bg-gray-300">
      <div className="py-12">
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3">{children}</div>
      </div>
    </section>
  );
};

export default FeatureList;
