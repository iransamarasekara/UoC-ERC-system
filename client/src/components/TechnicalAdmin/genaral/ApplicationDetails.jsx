import React, { useState } from "react";
import pdf from "../../../assets/TechnicalAdmin/Group 4.png";
import cancle from "../../../assets/TechnicalAdmin/Cancel.png";
import tick from "../../../assets/TechnicalAdmin/Check Mark.png";
import Foward from "../../../assets/TechnicalAdmin/Forward Arrow.png";
import reject from "../../../assets/TechnicalAdmin/Left 3.png";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const ApplicationDetails = () => {
  const [statuses, setStatuses] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [isReturned, setIsReturned] = useState(false);

  const applicationDetails = {
    userName: "....................",
    userId: "........",
    userEmail: ".............",
    applicationCategory: ".....",
    researchType: ".....",
    applyDate: ".....",
    applyTime: ".....",
  };

  const documents = [
    { id: 1, name: "Document 1", fileName: "research-resources.pdf" },
    { id: 2, name: "Document 2", fileName: "proposal.pdf" },
    { id: 3, name: "Document 3", fileName: "cv.pdf" },
    { id: 4, name: "Document 4", fileName: "research-consent-form.pdf" },
    { id: 5, name: "Payment Slip", fileName: "payment636383.pdf" },
  ];

  const hasRejectedDocuments = Object.values(statuses).some(
    (status) => status === "Rejected"
  );

  const handleReturnToApplicant = () => {
    if (!returnReason.trim()) {
      alert("Please provide a reason for return");
      return;
    }
    // Here you would typically make an API call to return the application
    console.log("Returning application with reason:", returnReason);
    // Reset the form state as needed
    // setStatuses({});
    // setReturnReason("");
    setIsReturned(true);
  };

  const handleSetStatus = (id, status) => {
    if (!isForwarded && !isReturned) {
      setStatuses((prev) => ({
        ...prev,
        [id]: status,
      }));
    }
  };

  const handleToggleStatus = (id) => {
    if (!isForwarded && !isReturned) {
      setStatuses((prev) => ({
        ...prev,
        [id]: prev[id] === "Approved" ? "Rejected" : "Approved",
      }));
    }
  };

  const allApproved = documents.every((doc) => statuses[doc.id] === "Approved");

  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto h-screen pb-20">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Applicant Details</h2>
        <div className="border-b pb-4 mb-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>
              <strong>User Name:</strong> {applicationDetails.userName}
            </p>
            <p>
              <strong>User ID:</strong> {applicationDetails.userId}
            </p>
            <p>
              <strong>User Email:</strong> {applicationDetails.userEmail}
            </p>
            <p>
              <strong>Application Category:</strong>{" "}
              {applicationDetails.applicationCategory}
            </p>
            <p>
              <strong>Research Type:</strong> {applicationDetails.researchType}
            </p>
          </div>
          <div>
            <p>
              <strong>Apply Date:</strong> {applicationDetails.applyDate}
            </p>
            <p>
              <strong>Apply Time:</strong> {applicationDetails.applyTime}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">Documents</h2>
        <div className="space-y-3 p-2 px-10">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-1 px-10 border-2 border-gray-300 rounded-3xl bg-gray-50"
            >
              <p className="font-medium text-lg w-32 border-r-2 border-r-gray-300 mr-10">
                {doc.name}
              </p>
              <div className="text-xs font-medium px-2 py-1 rounded-md pl-10">
                <a
                  href={`/path/to/${doc.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={pdf} className="w-10 h-10 cursor-pointer" />
                </a>
              </div>
              <p className="text-md text-gray-500 flex-1 truncate ml-3">
                <a
                  href={`/path/to/${doc.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                >
                  {doc.fileName}
                </a>
              </p>
              {!statuses[doc.id] && !isForwarded && (
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full hover:bg-red-100"
                    onClick={() => handleSetStatus(doc.id, "Rejected")}
                  >
                    <img src={cancle} className="w-10 h-10" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-green-100"
                    onClick={() => handleSetStatus(doc.id, "Approved")}
                  >
                    <img src={tick} className="w-10 h-10" />
                  </button>
                </div>
              )}
              {statuses[doc.id] && (
                <div
                  className={`px-4 py-1 rounded-full text-white text-sm font-semibold cursor-pointer ${
                    statuses[doc.id] === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  onClick={() => handleToggleStatus(doc.id)}
                >
                  {statuses[doc.id]}
                </div>
              )}
            </div>
          ))}
        </div>

        {allApproved && !isForwarded && (
          <div className="mt-6 text-center">
            <label className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4"
              />
              I have checked all the documents and confirm that they are correct
            </label>
            <div className="mt-4 flex justify-center w-full">
              <button
                className="mt-4 flex items-center justify-center bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-semibold disabled:opacity-50"
                disabled={!isChecked}
                onClick={() => setIsForwarded(true)}
              >
                <span className="mr-2">
                  <img src={Foward} className="w-14 h-14" />
                </span>
                Forward to the ERC technical committee
              </button>
            </div>
          </div>
        )}

        {isForwarded && (
          <div className="mt-6 text-center text-green-600 font-semibold text-lg">
            Successfully forwarded to ERC technical committee
          </div>
        )}

        {Object.keys(statuses).length === documents.length &&
          hasRejectedDocuments &&
          !isReturned && (
            <div className="mt-6 border-t pt-6 ">
              <h3 className="text-lg font-semibold text-red-600 mb-3 pl-14">
                Reason for return
              </h3>
              <div className="flex justify-center">
                <textarea
                  className="w-4xl p-3 border rounded-lg mb-4 min-h-[100px]"
                  placeholder="Type here...."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto hover:bg-red-600 transition-colors"
                onClick={handleReturnToApplicant}
              >
                <img src={reject} className="w-14 h-14" />
                Return to the applicant for resubmission
              </button>
            </div>
          )}
        {isReturned && (
          <div className="mt-6 text-center text-red-600 font-semibold text-lg">
            Returned to applicant
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationDetails;
