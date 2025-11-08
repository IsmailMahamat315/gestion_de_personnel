import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

/* 🎨 Thème */
const COLORS = {
  hoverBg: "#10b981",
  sidebarBg: "#1e293b",
  text: "#f8fafc",
  dropdownBg: "#0f172a",
};

/* 🔹 Lien principal */
const SidebarLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  height: 60px;
  text-decoration: none;
  color: ${COLORS.text};
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.hoverBg};
    border-left: 4px solid ${COLORS.hoverBg};
    color: #fff;
  }
`;

/* 🔹 Label */
const SidebarLabel = styled.span`
  margin-left: 16px;
`;

/* 🔹 Lien du sous-menu */
const DropdownLink = styled(Link)`
  background: ${COLORS.dropdownBg};
  height: 50px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${COLORS.text};
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.hoverBg};
    color: #fff;
  }
`;

const SubMenu = ({ item, onClick }) => {
  const [subnav, setSubnav] = useState(false);

  const toggleSubnav = () => setSubnav((prev) => !prev);

  // Détermine si on doit appeler onClick pour fermer la sidebar
  const handleClick = () => {
    if (item.subNav) toggleSubnav();
    else if (onClick) onClick(); // Ferme la sidebar si c’est un lien direct
  };

  return (
    <>
      <SidebarLink to={item.path} onClick={handleClick}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && (subnav ? item.iconOpened : item.iconClosed)}
        </div>
      </SidebarLink>

      {/* Animation douce avec Framer Motion */}
      <AnimatePresence>
        {subnav &&
          item.subNav.map((subItem, index) => (
            <motion.div
              key={index}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "50px", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownLink to={subItem.path} onClick={onClick}>
                {subItem.icon}
                <SidebarLabel>{subItem.title}</SidebarLabel>
              </DropdownLink>
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
};

export default SubMenu;
