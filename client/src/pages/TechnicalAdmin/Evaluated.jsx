import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pdf from "../../assets/TechnicalAdmin/Group 4.png";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const EvaluatedApplicationDetails = () => {
  const { id } = useParams();
  const [applicationDetails, setApplicationDetails] = useState({
    userName: "....................",
    userId: "........",
    userEmail: ".............",
    applicationCategory: ".....",
    researchType: ".....",
    applyDate: ".....",
    applyTime: ".....",
  });
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Document 1",
      fileName: "research-resources.pdf",
      status: "Approved",
    },
    { id: 2, name: "Document 2", fileName: "proposal.pdf", status: "Rejected" },
    { id: 3, name: "Document 3", fileName: "cv.pdf", status: "Approved" },
    {
      id: 4,
      name: "Document 4",
      fileName: "research-consent-form.pdf",
      status: "Rejected",
    },
    {
      id: 5,
      name: "Payment Slip",
      fileName: "payment636383.pdf",
      status: "Approved",
    },
  ]);

  useEffect(() => {
    // Fetch application details and documents using the ID from useParams
    const fetchApplicationData = async () => {
      try {
        const response = await fetch(`/api/applications/${id}`);
        const data = await response.json();
        setApplicationDetails(data.application);
        setDocuments(data.documents);
      } catch (error) {
        console.error("Error fetching application details:", error);
      }
    };

    fetchApplicationData();
  }, [id]);

  const hasRejectedDocuments = documents.some(
    (doc) => doc.status === "Rejected"
  );

  if (!applicationDetails) {
    return (
      <div className="text-center text-lg font-semibold p-6">Loading...</div>
    );
  }

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
              <div
                className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                  doc.status === "Approved" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {doc.status}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-lg font-semibold">
          {hasRejectedDocuments ? (
            <p className="text-red-600">
              Returned to the applicant for resubmission
            </p>
          ) : (
            <p className="text-green-600">
              Successfully forwarded to ERC technical committee
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EvaluatedApplicationDetails;
