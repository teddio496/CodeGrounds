import React, { useEffect, useState } from 'react';
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from '@tabler/icons-react';

// Define prop types
interface UpvoteDownvoteCommentProps {
  c_id: number; // Comment ID
  initialCount: number; // Initial vote count
}

// Define vote state type
type VoteStatus = 'upvote' | 'downvote' | 'none';

const UpvoteDownvoteComment: React.FC<UpvoteDownvoteCommentProps> = ({ c_id, initialCount }) => {
  const [vote, setVote] = useState<VoteStatus>('none'); // 'upvote', 'downvote', or 'none'
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Fetch the current vote status for the comment
    const fetchVoteStatus = async () => {
      try {
        const response = await fetch(`/api/auth/protected/blog/check-vote?c_id=${c_id}`);
        const data = await response.json();
        if (response.ok) {
          setVote(data.voteStatus as VoteStatus); // Set the initial vote state ('upvote', 'downvote', or 'none')
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch vote status:", err);
      }
    };

    fetchVoteStatus();
  }, [c_id]);

  const handleVote = async (isUp: boolean) => {
    try {
      const response = await fetch('/api/auth/protected/blog/vote-comment', {
        method: 'POST',
        body: JSON.stringify({ c_id, isUp }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Update UI based on the new vote state
        if (vote === (isUp ? 'upvote' : 'downvote')) {
          // If the user is toggling off their current vote
          setVote('none');
          setCount((prev) => prev + (isUp ? -1 : 1));
        } else if (vote === 'none') {
          // If the user is casting a new vote
          setVote(isUp ? 'upvote' : 'downvote');
          setCount((prev) => prev + (isUp ? 1 : -1));
        } else {
          // If the user is switching votes
          setVote(isUp ? 'upvote' : 'downvote');
          setCount((prev) => prev + (isUp ? 2 : -2));
        }
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to cast vote:", err);
    }
  };

  return (
    <div className="flex items-center space-x-2 font-medium">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote(true)}
        className={`flex items-center transition ${
          vote === 'upvote' ? 'text-green-800' : 'text-gray-500 hover:text-green-800'
        }`}
      >
        {vote === 'upvote' ? (
          <IconThumbUpFilled />
        ) : (
          <IconThumbUp />
        )}
      </button>

      {/* Count Display */}
      <span
        className={`text-base font-semibold ${
          count > 0 ? 'text-green-800' : count < 0 ? 'text-red-800' : 'text-gray-500'
        }`}
      >
        {count}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote(false)}
        className={`flex items-center transition ${
          vote === 'downvote' ? 'text-red-800' : 'text-gray-500 hover:text-red-800'
        }`}
      >
        {vote === 'downvote' ? (
          <IconThumbDownFilled />
        ) : (
          <IconThumbDown />
        )}
      </button>
    </div>
  );
};

export default UpvoteDownvoteComment;
