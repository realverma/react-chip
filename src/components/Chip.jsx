import React, { useEffect, useRef, useState } from "react";
import data from "../data/data";
import "./Chip.css";

const Chip = () => {

  const [userData, setUserData] = useState(data);
  const [users, setUsers] = useState([]);
  const [isDisplay, setIsDisplay] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  let inputElement = document.querySelector(".input");

  //Adding user to setUsers
  function adduser(id) {
    const user = userData.find((user) => user.id === id);
    setUsers((prevUsers) => [...prevUsers, user]);
    setUserData((prevUsers) => prevUsers.filter((user) => user.id !== id));
    inputElement.focus();
    setIsDisplay(true)
  }

  //Removing user 
  function removeUser(id) {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setUserData((prevUsers) => [
      ...prevUsers,
      users.find((user) => user.id === id),
    ]);
    inputElement.focus();
    setIsDisplay(true)
  }

  //Closing the menu when clicked outside
  useEffect(() => {
    const handleClickOutsideBox = (event) => {
      const box = scrollRef.current;
      const input = inputRef.current;

      if (
        input &&
        !input.contains(event.target) &&
        box &&
        !box.contains(event.target) &&
        event.target !== input
      ) {
        setIsDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideBox);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideBox);
    };
  }, []);

  //Filtering the users based on input value
  useEffect(() => {
    setFilteredUsers(userData);
}, [userData]);

const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filteredData = userData.filter((user) =>
        user.name.toLowerCase().includes(inputValue)
    );
    setFilteredUsers(filteredData);
    setSelectedIndex(-1); // Reset selected index when input changes
};


const handleKeyDown = (e) => {
  if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
          prevIndex < filteredUsers.length - 1 ? prevIndex + 1 : prevIndex
      );
  } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }
};

const handleKeyUp = (e) => {
  if (e.key === 'Enter' && selectedIndex !== -1 && filteredUsers.length > 0) {
    adduser(filteredUsers[selectedIndex].id);
    inputRef.current.focus();
  }
};

const highlightMatchingText = (text, searchValue) => {
  if (!searchValue) return text;
  const regex = new RegExp(`(${searchValue})`, 'gi');
  return text.split(regex).map((part, index) => 
      regex.test(part) ? <span key={index} style={{fontWeight:400}}>{part}</span> : part
  );
};

  return (
    <div className="chip">
      <h2>Pick Users</h2>
      <div
        className="input_box"
        style={{ display: "flex", alignItems: "center" }}
      >


        {users.map((user) => {
          return (
            <div className="chip_user" key={user.id}>
              <div className="chip_img_container">
                <img src={user.image} alt="user" />
              </div>
              <p>{user.name}</p>
              <button className="close" onClick={() => removeUser(user.id)}>
                X
              </button>
            </div>
          );
        })}


        <div>
          <input
            type="text"
            placeholder="Add new user..."
            className="input"
            onClick={() =>setIsDisplay(true)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
          {isDisplay && (
            <div className="users_container" id="scroll" ref={scrollRef}>
              {filteredUsers.map((data,index) => {
                return (
                  <div
                    className={`user ${index === selectedIndex ? 'selected' : ''}`}
                    key={data.id}
                    onClick={() => adduser(data.id)}
                  >
                    <div className="img_container">
                      <img src={data.image} alt="user" />
                    </div>
                    <h4>{highlightMatchingText(data.name, inputRef.current.value)}</h4>
                    <p>{data.email}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chip;
