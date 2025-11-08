import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

/* 🎨 Thème principal */
const COLORS = {
  background: "#0f172a",
  sidebar: "#1e293b",
  accent: "#10b981",
  text: "#f8fafc",
};

/* 🔹 Navbar principale */
const Nav = styled.header`
  background: ${COLORS.background};
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavIcon = styled(Link)`
  font-size: 1.8rem;
  color: ${COLORS.text};
  display: flex;
  align-items: center;
  transition: 0.3s ease;

  &:hover {
    color: ${COLORS.accent};
    transform: scale(1.1);
  }
`;

/* 🔹 Sidebar (menu latéral) - correction warning avec $sidebar */
const SidebarNav = styled.nav`
  background: ${COLORS.sidebar};
  width: 270px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ $sidebar }) => ($sidebar ? "0" : "-100%")};
  transition: all 0.35s ease-in-out;
  z-index: 99;
  box-shadow: ${({ $sidebar }) =>
    $sidebar ? "2px 0 15px rgba(0, 0, 0, 0.3)" : "none"};

  @media (max-width: 768px) {
    width: 220px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  color: ${COLORS.text};
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarWrap = styled.div`
  width: 100%;
  padding-top: 1rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 1.3rem;
  color: ${COLORS.text};
  font-weight: 500;
  margin-left: 1rem;
  transition: 0.3s;

  &:hover {
    color: ${COLORS.accent};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-left: 0.5rem;
  }
`;

/* 🔹 Composant principal */
const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => setSidebar((prev) => !prev);

  return (
    <IconContext.Provider value={{ color: COLORS.text }}>
      <Nav>
        <div className="flex items-center gap-3">
          <NavIcon to="#">
            <FaBars onClick={toggleSidebar} />
          </NavIcon>
          <Title>Apollonia Employee Management</Title>
        </div>
      </Nav>

      <SidebarNav $sidebar={sidebar}>
        <SidebarHeader>
          <span>Navigation</span>
          <AiOutlineClose
            onClick={toggleSidebar}
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
          />
        </SidebarHeader>

        <SidebarWrap>
          {SidebarData.map((item, index) => (
            <SubMenu item={item} key={index} onClick={toggleSidebar} />
          ))}
        </SidebarWrap>
      </SidebarNav>
    </IconContext.Provider>
  );
};

export default Sidebar;
