import React from "react";

const Restriction = () => {
  return (
    <div
      className="hstack gap-2 justify-content-center text-center"
      style={{ height: "100vh" }}
    >
      <div className="border p-5 br3 shadow-sm bg-light">
        <h4 className="fw-bold mb-1">We are sorry...</h4>
        <p className="mb-0" style={{ fontSize: 13 }}>
          The page you're trying to access has restricted access.
        </p>
        <p className="mb-2" style={{ fontSize: 13 }}>
          Please refer to your admin administrator.
        </p>
        <button
          onClick={() => {localStorage.clear(); window.location.href = "/login"}}
          className="btn border btn-active text-white br3"
          style={{ fontSize: 12 }}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default Restriction;
