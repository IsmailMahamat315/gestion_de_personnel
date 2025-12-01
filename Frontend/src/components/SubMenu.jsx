import { useState, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

/* 🎨 Thème cohérent avec le Sidebar */
const COLORS = {
  hoverBg: "#10b981",
  sidebarBg: "#1e293b",
  text: "#f8fafc",
  dropdownBg: "#0f172a",
  activeBg: "#0d9488",
  border: "#374151",
};

/* 🔹 Lien principal avec accessibilité améliorée */
const SidebarLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  height: 60px;
  text-decoration: none;
  color: ${COLORS.text};
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
  background: ${({ $isActive }) => $isActive ? COLORS.activeBg : 'transparent'};

  &:hover {
    background: ${COLORS.hoverBg};
    border-left: 4px solid ${COLORS.hoverBg};
    color: #fff;
  }

  &:focus {
    outline: 2px solid ${COLORS.hoverBg};
    outline-offset: -2px;
  }

  /* Style pour les liens désactivés */
  ${({ $disabled }) => $disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

/* 🔹 Label avec gestion du texte long */
const SidebarLabel = styled.span`
  margin-left: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

/* 🔹 Conteneur des icônes */
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 24px;
  
  /* Animation de rotation pour les flèches */
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

/* 🔹 Lien du sous-menu avec état actif */
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
  border-left: 4px solid transparent;
  position: relative;
  background: ${({ $isActive }) => $isActive ? COLORS.activeBg : COLORS.dropdownBg};

  &:hover {
    background: ${COLORS.hoverBg};
    color: #fff;
    border-left-color: ${COLORS.hoverBg};
  }

  &:focus {
    outline: 2px solid ${COLORS.hoverBg};
    outline-offset: -2px;
  }

  /* Indicateur visuel pour l'élément actif */
  &::before {
    content: '';
    position: absolute;
    left: 2rem;
    width: 4px;
    height: 20px;
    background: ${({ $isActive }) => $isActive ? COLORS.text : 'transparent'};
    border-radius: 2px;
  }
`;

/* 🔹 Conteneur d'animation pour les sous-menus */
const DropdownContainer = styled(motion.div)`
  overflow: hidden;
  border-left: 2px solid ${COLORS.border};
  margin-left: 1.5rem;
`;

/* 🔹 Groupe de sous-menus */
const SubMenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubMenu = memo(({ item, onClick }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();

  // Mémoisation des callbacks
  const toggleSubnav = useCallback(() => {
    setSubnav((prev) => !prev);
  }, []);

  // Vérification si l'élément ou ses enfants sont actifs
  const isItemActive = useCallback((menuItem) => {
    if (menuItem.path === location.pathname) return true;
    if (menuItem.subNav) {
      return menuItem.subNav.some(subItem => subItem.path === location.pathname);
    }
    return false;
  }, [location.pathname]);

  const isActive = isItemActive(item);

  // Gestion du clic améliorée
  const handleClick = useCallback((e) => {
    // Empêcher la navigation si désactivé
    if (item.disabled) {
      e.preventDefault();
      return;
    }

    if (item.subNav && item.subNav.length > 0) {
      e.preventDefault();
      toggleSubnav();
    } else {
      // Fermer la sidebar seulement sur les liens terminaux
      if (onClick) {
        onClick();
      }
    }
  }, [item.subNav, item.disabled, toggleSubnav, onClick]);

  // Gestion du clic sur les sous-liens
  const handleSubItemClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Rendu des sous-menus avec mémoisation
  const renderSubNav = useCallback(() => {
    if (!subnav || !item.subNav || item.subNav.length === 0) return null;

    return (
      <AnimatePresence mode="wait">
        <DropdownContainer
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <SubMenuGroup role="menu" aria-label={`Sous-menu de ${item.title}`}>
            {item.subNav.map((subItem, index) => {
              const isSubItemActive = subItem.path === location.pathname;
              return (
                <DropdownLink
                  key={`${subItem.title}-${index}`}
                  to={subItem.disabled ? "#" : subItem.path}
                  onClick={subItem.disabled ? (e) => e.preventDefault() : handleSubItemClick}
                  $isActive={isSubItemActive}
                  role="menuitem"
                  aria-disabled={subItem.disabled || false}
                  $disabled={subItem.disabled}
                >
                  <IconWrapper>
                    {subItem.icon}
                  </IconWrapper>
                  <SidebarLabel title={subItem.title}>
                    {subItem.title}
                    {subItem.disabled && " (Bientôt)"}
                  </SidebarLabel>
                </DropdownLink>
              );
            })}
          </SubMenuGroup>
        </DropdownContainer>
      </AnimatePresence>
    );
  }, [subnav, item.subNav, item.title, location.pathname, handleSubItemClick]);

  return (
    <div role="none">
      <SidebarLink
        as={item.subNav ? "div" : Link}
        to={item.disabled ? "#" : (item.subNav ? "#" : item.path)}
        onClick={handleClick}
        $isActive={isActive}
        $disabled={item.disabled}
        role={item.subNav ? "button" : "menuitem"}
        aria-expanded={item.subNav ? subnav : undefined}
        aria-haspopup={item.subNav ? "true" : undefined}
        aria-disabled={item.disabled || false}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <IconWrapper>
            {item.icon}
          </IconWrapper>
          <SidebarLabel title={item.title}>
            {item.title}
            {item.disabled && " (Bientôt)"}
          </SidebarLabel>
        </div>
        
        {item.subNav && item.subNav.length > 0 && (
          <IconWrapper $isOpen={subnav}>
            {subnav ? item.iconOpened : item.iconClosed}
          </IconWrapper>
        )}
      </SidebarLink>

      {renderSubNav()}
    </div>
  );
});

// Display name pour le debug
SubMenu.displayName = "SubMenu";

export default SubMenu;