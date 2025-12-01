import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// 🎨 Styles pour le Dashboard
const DashboardContainer = styled(motion.div)`
  padding: 2rem;
  background: #f8fafc;
  min-height: calc(100vh - 70px);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #0f172a;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

// 🎯 Cartes de statistiques
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #10b981;
`;

const StatTitle = styled.h3`
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
`;

// 📊 Section récente
const RecentSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #0f172a;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Dashboard = () => {
  // Données mock (remplacez par vos vraies données)
  const statsData = {
    totalEmployees: 124,
    totalDepartments: 8,
    activeProjects: 15,
    thisMonthHires: 5
  };

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>Tableau de Bord SOTRAT</Title>
        <Subtitle>Vue d'ensemble de votre gestion du personnel</Subtitle>
      </Header>

      {/* 🎯 Cartes de statistiques */}
      <StatsGrid>
        <StatCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatTitle>Total Employés</StatTitle>
          <StatValue>{statsData.totalEmployees}</StatValue>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatTitle>Départements</StatTitle>
          <StatValue>{statsData.totalDepartments}</StatValue>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatTitle>Projets Actifs</StatTitle>
          <StatValue>{statsData.activeProjects}</StatValue>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatTitle>Embauches ce mois</StatTitle>
          <StatValue>{statsData.thisMonthHires}</StatValue>
        </StatCard>
      </StatsGrid>

      {/* 📊 Section activités récentes */}
      <RecentSection>
        <SectionTitle>Activités Récentes</SectionTitle>
        <p>Ici vous pouvez ajouter :</p>
        <ul>
          <li>Liste des employés récemment ajoutés</li>
          <li>Graphiques de performance</li>
          <li>Notifications importantes</li>
          <li>Projets en cours</li>
        </ul>
      </RecentSection>
    </DashboardContainer>
  );
};

export default Dashboard;