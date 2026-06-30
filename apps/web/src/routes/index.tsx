import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from '@/layouts/AppLayout';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ChampionshipsPage = lazy(() => import('@/pages/championships/ChampionshipsPage'));
const CreateChampionshipPage = lazy(() => import('@/pages/championships/CreateChampionshipPage'));
const ChampionshipDetailPage = lazy(() => import('@/pages/championships/ChampionshipDetailPage'));
const EditChampionshipPage = lazy(() => import('@/pages/championships/EditChampionshipPage'));
const TeamsPage = lazy(() => import('@/pages/teams/TeamsPage'));
const CreateTeamPage = lazy(() => import('@/pages/teams/CreateTeamPage'));
const EditTeamPage = lazy(() => import('@/pages/teams/EditTeamPage'));
const TeamManagementPage = lazy(() => import('@/pages/teams/TeamManagementPage'));
const PlayersPage = lazy(() => import('@/pages/players/PlayersPage'));
const CreatePlayerPage = lazy(() => import('@/pages/players/CreatePlayerPage'));
const EditPlayerPage = lazy(() => import('@/pages/players/EditPlayerPage'));
const CoachesPage = lazy(() => import('@/pages/coaches/CoachesPage'));
const CreateCoachPage = lazy(() => import('@/pages/coaches/CreateCoachPage'));
const EditCoachPage = lazy(() => import('@/pages/coaches/EditCoachPage'));
const MatchesPage = lazy(() => import('@/pages/matches/MatchesPage'));
const CreateMatchPage = lazy(() => import('@/pages/matches/CreateMatchPage'));
const EditMatchPage = lazy(() => import('@/pages/matches/EditMatchPage'));
const StandingsPage = lazy(() => import('@/pages/standings/StandingsPage'));
const EditStandingPage = lazy(() => import('@/pages/standings/EditStandingPage'));
const TopScorersPage = lazy(() => import('@/pages/standings/TopScorersPage'));
const EditGoalPage = lazy(() => import('@/pages/standings/EditGoalPage'));
const StatisticsPage = lazy(() => import('@/pages/statistics/StatisticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const PublicPage = lazy(() => import('@/pages/public/PublicPage'));

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/p/:slug', element: <PublicPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/championships', element: <ChampionshipsPage /> },
      { path: '/championships/new', element: <CreateChampionshipPage /> },
      { path: '/championships/:id/edit', element: <EditChampionshipPage /> },
      { path: '/championships/:id', element: <ChampionshipDetailPage /> },
      { path: '/teams', element: <TeamsPage /> },
      { path: '/teams/new', element: <CreateTeamPage /> },
      { path: '/teams/:id/edit', element: <EditTeamPage /> },
      { path: '/teams/:id', element: <TeamManagementPage /> },
      { path: '/players', element: <PlayersPage /> },
      { path: '/players/new', element: <CreatePlayerPage /> },
      { path: '/players/:id/edit', element: <EditPlayerPage /> },
      { path: '/coaches', element: <CoachesPage /> },
      { path: '/coaches/new', element: <CreateCoachPage /> },
      { path: '/coaches/:id/edit', element: <EditCoachPage /> },
      { path: '/matches', element: <MatchesPage /> },
      { path: '/matches/new', element: <CreateMatchPage /> },
      { path: '/matches/:id/edit', element: <EditMatchPage /> },
      { path: '/standings', element: <StandingsPage /> },
      { path: '/standings/:id/edit', element: <EditStandingPage /> },
      { path: '/top-scorers', element: <TopScorersPage /> },
      { path: '/goals/:id/edit', element: <EditGoalPage /> },
      { path: '/statistics', element: <StatisticsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
