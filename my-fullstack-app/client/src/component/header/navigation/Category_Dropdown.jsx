import { FiChevronDown } from "react-icons/fi";
import { RiMenuFold2Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useState } from "react";
import "/src/styles/Category_Dropdown.css"

const StaggeredDropDown = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div animate={open ? "open" : "closed"} className="dropdown-wrapper">
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="dropdown-button"
      >
        <RiMenuFold2Fill />
        <span className="dropdown-button-text">Shop By Categories</span>
        <motion.span variants={iconVariants}>
          <FiChevronDown />
        </motion.span>
      </button>

      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top", translateX: "-50%" }}
        className="dropdown-menu"
      >
        <Option setOpen={setOpen} text="PC Gaming" />
        <Option setOpen={setOpen} text="PC Workstation" />
        <Option setOpen={setOpen} text="Console" />
        <Option setOpen={setOpen} text="Keyboard" />
        <Option setOpen={setOpen} text="Mouse" />
        <Option setOpen={setOpen} text="Headset" />
      </motion.ul>
    </motion.div>
  );
};

const Option = ({ text, setOpen }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => setOpen(false)}
      className="dropdown-option"
    >
      <span>{text}</span>
    </motion.li>
  );
};

export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};