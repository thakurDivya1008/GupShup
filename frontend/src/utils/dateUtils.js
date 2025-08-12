
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};


export const formatConversationDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
  
  
  if (diffInDays < 1) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  
  if (diffInDays < 2) {
    return 'Yesterday';
  }
  
  
  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  
  }
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};
