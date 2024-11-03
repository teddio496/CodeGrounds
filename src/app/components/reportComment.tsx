import React, { useState } from "react";
import { IconFlag } from "@tabler/icons-react"; // Import Tabler Icons
import { toast } from "sonner";

interface ReportCommentProps {
  c_id: number;
}

const ReportComment: React.FC<ReportCommentProps> = ({ c_id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    const explanation = prompt("Why are you reporting this comment?");

    if (!explanation) {
      toast("Report cancelled. Explanation is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/protected/blog/report-comment", {
        method: "POST",
        body: JSON.stringify({ c_id: c_id, explanation }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast(result.message || "Report submitted successfully.");
      } else {
        toast(result.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast("An error occurred while submitting your report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inline-block text-center">
      <button
        onClick={handleReport}
        disabled={isSubmitting}
        className={`p-1 ${
          isSubmitting
            ? "cursor-not-allowed text-gray-500"
            : "cursor-pointer text-red-800"
        }`}
        title="Report Comment"
      >
        <IconFlag size={24} />
      </button>
    </div>
  );
};

export default ReportComment;
