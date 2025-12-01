import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { Button } from "react-bootstrap";

/* 🎨 Thème principal pour SOTRAT S.A. */
const COLORS = {
  background: "#0f172a",
  sidebar: "#1e293b",
  accent: "#10b981",
  text: "#f8fafc",
  danger: "#ef4444",
};

/* 🔹 Styles optimisés */
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

const NavIcon = styled.button`
  font-size: 1.8rem;
  color: ${COLORS.text};
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: ${COLORS.accent};
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: 2px solid ${COLORS.accent};
    outline-offset: 2px;
  }
`;

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
    width: 100%;
    max-width: 300px;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: ${COLORS.danger};
    background: rgba(239, 68, 68, 0.1);
  }

  &:focus {
    outline: 2px solid ${COLORS.danger};
    outline-offset: 2px;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
  padding-top: 1rem;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 1.1rem;
  color: ${COLORS.text};
  font-weight: 500;
  margin-left: 1rem;
  transition: 0.3s;

  &:hover {
    color: ${COLORS.accent};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-left: 0.5rem;
  }
`;

const LogoutSection = styled.div`
  margin-top: auto;
  padding: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
  display: ${({ $sidebar }) => ($sidebar ? "block" : "none")};
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

/* 🔹 Composant Sidebar amélioré */
const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fermer la sidebar quand la route change
  useEffect(() => {
    setSidebar(false);
  }, [location.pathname]);

  // Gestionnaire de fermeture avec useCallback
  const toggleSidebar = useCallback(() => {
    setSidebar((prev) => !prev);
  }, []);

  // Fermer la sidebar avec Échap
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebar(false);
      }
    };

    if (sidebar) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [sidebar]);

  // Déconnexion sécurisée
  const handleLogout = useCallback(async () => {
    try {
      // Optionnel : Appel API pour déconnexion côté serveur
      // await api.post('/logout');
      
      // Nettoyage sécurisé du stockage local
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      
      // Redirection vers login
      navigate("/login", { replace: true });
      
      // Fermer la sidebar
      setSidebar(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Fallback en cas d'erreur
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Confirmation de déconnexion
  const confirmLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      handleLogout();
    }
  };

  // Gestion du clic sur l'overlay
  const handleOverlayClick = () => {
    setSidebar(false);
  };

  return (
    <IconContext.Provider value={{ color: COLORS.text }}>
      <Nav role="banner">
        <div className="flex items-center gap-3">
          <NavIcon 
            onClick={toggleSidebar}
            aria-label={sidebar ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={sidebar}
            aria-controls="sidebar-navigation"
          >
            <FaBars />
          </NavIcon>
          <Title>
            Système de gestion du personnel - SOTRAT S.A.
          </Title>
        </div>
      </Nav>

      {/* Overlay pour mobile */}
      <Overlay 
        $sidebar={sidebar} 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <SidebarNav 
        $sidebar={sidebar} 
        id="sidebar-navigation"
        role="navigation"
        aria-label="Navigation principale"
      >
        <SidebarHeader>
          <span>Navigation</span>
          <CloseButton
            onClick={toggleSidebar}
            aria-label="Fermer le menu"
          >
            <AiOutlineClose />
          </CloseButton>
        </SidebarHeader>

        <SidebarWrap>
          {SidebarData.map((item, index) => (
            <SubMenu 
              item={item} 
              key={item.title || index} 
              onClick={toggleSidebar} 
            />
          ))}
        </SidebarWrap>

        {/* Section de déconnexion */}
        <LogoutSection>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={confirmLogout}
            className="w-100"
            aria-label="Se déconnecter du système"
          >
            Déconnexion
          </Button>
        </LogoutSection>
      </SidebarNav>
    </IconContext.Provider>
  );
};

export default Sidebar;