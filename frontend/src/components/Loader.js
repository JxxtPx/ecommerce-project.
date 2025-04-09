import React from "react";

function Loader({ size = "md", text = "Loading..." }) {
  const spinnerSize = size === "sm" ? "spinner-border-sm" : "";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div className={`spinner-border text-danger ${spinnerSize}`} role="status" />
      <div className="mt-2 text-muted">{text}</div>
    </div>
  );
}

export default Loader;
