import React, { useState } from "react";
import { IconFlag } from "@tabler/icons-react"; // Import Tabler Icons
import { toast } from "sonner";

interface ReportBlogProps {
  b_id: number;
}

const ReportBlog: React.FC<ReportBlogProps> = ({ b_id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    const explanation = prompt("Why are you reporting this blog?");

    if (!explanation) {
      toast("Report cancelled. Explanation is required.")
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/protected/blog/report-blog", {
        method: "POST",
        body: JSON.stringify({ b_id: b_id, explanation }),
      });

      const result = await response.json();

      if (response.ok) {
        toast(result.message || "Report submitted successfully.");
      } else {
        toast(result.message || "You must be logged in to vote");
      }
    } catch (error) {
      console.error("Error reporting blog:", error);
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
        title="Report Blog"
      >
        <IconFlag size={24} />
      </button>
    </div>
  );
  
};

export default ReportBlog;
