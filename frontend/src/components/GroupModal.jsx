import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";

const GroupModal = ({ open, onClose, onGroupCreated, currentUser }) => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // <-- loading state


  useEffect(() => {
    if (open) {
      // Fetch all users and filter out current user in the UI (not in fetch)
      axios.get(`${serverUrl}/api/user/all`, { withCredentials: true })
        .then(res => setUsers(res.data));
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
    setLoading(true);
    try {
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
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Debug: log users and currentUser
  console.log("users", users, "currentUser", currentUser);

  return (
    <div className="fixed inset-0  bg-slate-300 bg-opacity-40 flex items-center justify-center z-50">
      <form
        className="bg-white border-2 border-[#1797c2] shadow-2xl rounded-2xl w-[370px] flex flex-col gap-5 p-7 animate-fadeIn"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-1 text-[#1797c2] text-center tracking-wide">Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          className="border-2 border-[#1797c2] focus:border-[#20c7ff] p-2 rounded-lg outline-none text-lg transition-all"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          required
        />
        {/* Group image preview and upload */}
        <div className="flex flex-col items-center gap-2">
          {groupImage && (
            <img
              src={URL.createObjectURL(groupImage)}
              alt="Group Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1797c2] shadow"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-[#1797c2] file:text-white file:font-semibold file:cursor-pointer bg-slate-100 rounded-lg"
          />
        </div>
        <div className="max-h-40 overflow-y-auto border border-[#b2ccdf] rounded-lg p-2 bg-slate-50">
          {users.filter(user => user._id !== currentUser._id).length === 0 ? (
            <div className="text-center text-gray-400">No users found.</div>
          ) : (
            users.filter(user => user._id !== currentUser._id).map(user => (
              <label key={user._id} className="flex items-center gap-3 py-1 px-2 rounded hover:bg-[#e6f7ff] cursor-pointer">
                <input
                  type="checkbox"
                  checked={members.includes(user._id)}
                  onChange={() => handleMemberToggle(user._id)}
                  className="accent-[#1797c2] w-4 h-4"
                />
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.userName}
                    className="w-8 h-8 rounded-full object-cover border border-[#b2ccdf] bg-white"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#b2ccdf] text-[#1797c2] font-bold text-base border border-[#b2ccdf]">
                    {(user.name || user.userName || '').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-gray-800 text-base font-medium">{user.name || user.userName}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#1797c2] to-[#20c7ff] text-white rounded-full py-2 font-semibold text-lg shadow hover:scale-105 transition-transform duration-150 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : null}
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 text-[#1797c2] rounded-full py-2 font-semibold text-lg hover:bg-gray-300 transition-colors duration-150"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupModal;