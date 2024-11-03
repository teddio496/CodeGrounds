import React, { useEffect, useState } from 'react';
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from '@tabler/icons-react';
import { toast } from 'sonner';
// Define prop types
interface UpvoteDownvoteProps {
  b_id: number; // Blog post ID
  initialCount: number; // Initial vote count
}

// Define vote state type
type VoteStatus = 'upvote' | 'downvote' | 'none';

const UpvoteDownvote: React.FC<UpvoteDownvoteProps> = ({ b_id, initialCount }) => {
  const [vote, setVote] = useState<VoteStatus>('none'); // 'upvote', 'downvote', or 'none'
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Fetch the current vote status
    const fetchVoteStatus = async () => {
      try {
        const response = await fetch(`/api/auth/protected/blog/check-vote?b_id=${b_id}`);
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
  }, [b_id]);

  const handleVote = async (isUp: boolean) => {
    try {
      const response = await fetch('/api/auth/protected/blog/vote-blog', {
        method: 'POST',
        body: JSON.stringify({ b_id, isUp }),
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
      } else if (response.status === 400){
        toast("You must be logged in to vote")
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

export default UpvoteDownvote;
