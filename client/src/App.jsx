import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage'
import Layout from "./Layout";
import RegisterPage from './pages/RegisterPage'
import axios from "axios";
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import UsersDashboardPage from './pages/UsersDashboardPage';
import PlacesDashboardPage from './pages/PlacesDashboardPage';
import BookingsDashboardPage from './pages/BookingsDashboardPage';
import StaysReviewsDashboardPage from './pages/StaysReviewsDashboardPage';
import HostsReviewsDashboardPage from './pages/HostsReviewsDashboardPage';
import Chat from './pages/Chat';
import ReviewFormPage from './pages/ReviewFormPage';
import SearchResult from './pages/SearchResult';
import RecommendationsPage from './pages/RecommendationsPage';

axios.defaults.baseURL = 'http://localhost:4000'; //http://127.0.0.1:4000'
axios.defaults.withCredentials = true; //to accept cookies

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<PlacesFormPage />} />
        <Route path="/account/places/:id" element={<PlacesFormPage />} />
        <Route path="/place/:id" element={<PlacePage />}/>
        <Route path="/account/bookings" element={<BookingsPage/>} />
        <Route path="/account/recommendations" element={<RecommendationsPage/>}/>
        <Route path="/account/bookings/:id" element={<BookingPage />} />
        <Route path="/account/bookings/:id/review" element={<ReviewFormPage />} />
        <Route path="/results" element={<SearchResult/>} />
      </Route>
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/dashboard/users" element={<UsersDashboardPage/>} />
      <Route path="/dashboard/places" element={<PlacesDashboardPage/>} />
      <Route path="/dashboard/bookings" element={<BookingsDashboardPage/>} />
      <Route path="/dashboard/staysreviews" element={<StaysReviewsDashboardPage/>} />
      <Route path="/dashboard/hostsreviews" element={<HostsReviewsDashboardPage/>} />
      <Route path="/chat" element={<Chat/>} />
     </Routes>
    </UserContextProvider>
    
    
  )
}

export default App