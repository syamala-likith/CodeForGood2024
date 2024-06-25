import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

const Managerview = () => {
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/document'); // Replace with your API endpoint
        const doc = await response.json();
        setDocument(doc);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  const downloadDocument = () => {
    if (document && document.url) {
      saveAs(document.url, document.name); // Assuming document object has url and name properties
    } else {
      alert('No document URL provided');
    }
  };

  const handleApproval = async () => {
    try {
      await fetch(`/api/document/${document.id}/approve`, {
        method: 'POST',
      });
      alert('Document approved');
      navigate('/'); // Redirect to home or another route
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleDecline = () => {
    setShowCommentBox(true);
  };

  const submitDecline = async () => {
    try {
      await fetch(`/api/document/${document.id}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });
      alert('Document declined');
      navigate('/'); // Redirect to home or another route
    } catch (error) {
      console.error('Error declining document:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : document ? (
        <div>
          <h1>{document.name}</h1>
          <iframe
            src={`data:${document.mimeType};base64,${document.data}`}
            title="Document Viewer"
            width="100%"
            height="600px"
          ></iframe>
          <br />
          <button onClick={downloadDocument}>Download Document</button>
          <button onClick={handleApproval}>Approve</button>
          <button onClick={handleDecline}>Decline</button>
          {showCommentBox && (
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Reason for denial"
              />
              <button onClick={submitDecline}>Submit Decline</button>
            </div>
          )}
        </div>
      ) : (
        <p>No document to display</p>
      )}
    </div>
  );
};

export default Managerview;
