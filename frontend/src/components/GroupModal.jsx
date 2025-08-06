import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";

const GroupModal = ({ open, onClose, onGroupCreated, currentUser }) => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      // Fetch all users except current user
      axios.get(`${serverUrl}/api/user/all`, { withCredentials: true })
        .then(res => setUsers(res.data.filter(u => u._id !== currentUser._id)));
    }
  }, [open, currentUser]);

  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

  const handleMemberToggle = (userId) => {
    setMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || members.length < 2) {
      alert("Group name and at least 2 members required");
      return;
    }
    let groupImageUrl = null;
    if (groupImage) {
      const formData = new FormData();
      formData.append("image", groupImage);
      const res = await axios.post(`${serverUrl}/api/message/upload-image`, formData, { withCredentials: true });
      groupImageUrl = res.data.imageUrl;
    }
    const res = await axios.post(`${serverUrl}/api/group/create-group`, {
      groupName,
      groupImage: groupImageUrl,
      members: [currentUser._id, ...members]
    }, { withCredentials: true });
    onGroupCreated(res.data);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded-lg w-[350px] flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          className="border p-2 rounded"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="max-h-40 overflow-y-auto border rounded p-2">
          {users.map(user => (
            <label key={user._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={members.includes(user._id)}
                onChange={() => handleMemberToggle(user._id)}
              />
              <span>{user.name}</span>
            </label>
          ))}
        </div>
        <button type="submit" className="bg-[#1797c2] text-white rounded p-2 mt-2">Create</button>
        <button type="button" className="text-gray-500 mt-1" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default GroupModal;