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
const TeamsPage = lazy(() => import('@/pages/teams/TeamsPage'));
const CreateTeamPage = lazy(() => import('@/pages/teams/CreateTeamPage'));
const TeamManagementPage = lazy(() => import('@/pages/teams/TeamManagementPage'));
const PlayersPage = lazy(() => import('@/pages/players/PlayersPage'));
const CoachesPage = lazy(() => import('@/pages/coaches/CoachesPage'));
const MatchesPage = lazy(() => import('@/pages/matches/MatchesPage'));
const StandingsPage = lazy(() => import('@/pages/standings/StandingsPage'));
const TopScorersPage = lazy(() => import('@/pages/standings/TopScorersPage'));
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
      { path: '/teams', element: <TeamsPage /> },
      { path: '/teams/new', element: <CreateTeamPage /> },
      { path: '/teams/:id', element: <TeamManagementPage /> },
      { path: '/players', element: <PlayersPage /> },
      { path: '/coaches', element: <CoachesPage /> },
      { path: '/matches', element: <MatchesPage /> },
      { path: '/standings', element: <StandingsPage /> },
      { path: '/top-scorers', element: <TopScorersPage /> },
      { path: '/statistics', element: <StatisticsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
