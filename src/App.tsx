import { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BookingFlowPage from './pages/BookingFlowPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DrivingLicensePage from './pages/DrivingLicensePage';
import type { VehicleType, LicensePlate, Booking, Customer, DrivingLicense } from './data/mockData';

type Page =
  | 'home'
  | 'search'
  | 'vehicle-detail'
  | 'booking-flow'
  | 'checkout'
  | 'payment'
  | 'booking-success'
  | 'my-bookings'
  | 'booking-detail'
  | 'login'
  | 'register'
  | 'profile'
  | 'driving-license';

interface PageState {
  page: Page;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

const noHeaderPages: Page[] = ['booking-success', 'login', 'register'];

export default function App() {
  const [{ page, data }, setPageState] = useState<PageState>({ page: 'home' });
  const [customer, setCustomer] = useState<Customer | null>(null);

  const navigate = (nextPage: string, nextData?: unknown) => {
    setPageState({ page: nextPage as Page, data: nextData });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (loggedIn: Customer) => {
    setCustomer(loggedIn);
    navigate('home');
  };

  const handleRegister = (newCustomer: Customer) => {
    setCustomer(newCustomer);
    navigate('driving-license');
  };

  const handleLogout = () => {
    setCustomer(null);
    navigate('home');
  };

  const handleUpdateLicense = (license: DrivingLicense) => {
    if (!customer) return;
    setCustomer({ ...customer, drivingLicense: license });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {!noHeaderPages.includes(page) && (
        <Header currentPage={page} onNavigate={navigate} customer={customer} />
      )}

      {page === 'home' && (
        <HomePage onNavigate={navigate} />
      )}

      {page === 'search' && (
        <SearchPage
          onNavigate={navigate}
          initialParams={data as { date?: string; startTime?: string; endTime?: string } | undefined}
        />
      )}

      {page === 'vehicle-detail' && (() => {
        const vehicleData = data?.vehicle ?? data;
        return (
          <VehicleDetailPage
            vehicle={vehicleData as VehicleType}
            preselectedDate={data?.date}
            preselectedStart={data?.startTime}
            preselectedEnd={data?.endTime}
            customer={customer}
            onNavigate={navigate}
          />
        );
      })()}

      {page === 'booking-flow' && (
        <BookingFlowPage
          vehicle={(data?.vehicle ?? data) as VehicleType}
          date={data?.date ?? ''}
          startTime={data?.startTime ?? '09:00'}
          endTime={data?.endTime ?? '18:00'}
          onNavigate={navigate}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage
          vehicle={data.vehicle as VehicleType}
          date={data.date}
          startTime={data.startTime}
          endTime={data.endTime}
          preferredPlate={data.preferredPlate as LicensePlate | null}
          durationHours={data.durationHours}
          estimatedTotal={data.estimatedTotal}
          onNavigate={navigate}
        />
      )}

      {page === 'payment' && data?.vehicle && (
        <PaymentPage
          vehicle={data.vehicle as VehicleType}
          date={data.date}
          startTime={data.startTime}
          endTime={data.endTime}
          preferredPlate={data.preferredPlate as LicensePlate | null}
          durationHours={data.durationHours}
          estimatedTotal={data.estimatedTotal}
          discountAmount={data.discountAmount}
          finalTotal={data.finalTotal}
          promoCode={data.promoCode}
          notes={data.notes}
          onNavigate={navigate}
        />
      )}

      {page === 'booking-success' && (
        <BookingSuccessPage
          bookingId={data.bookingId}
          vehicle={data.vehicle as VehicleType}
          date={data.date}
          startTime={data.startTime}
          endTime={data.endTime}
          preferredPlate={data.preferredPlate as LicensePlate | null}
          durationHours={data.durationHours}
          finalTotal={data.finalTotal}
          depositAmount={data.depositAmount}
          promoCode={data.promoCode}
          onNavigate={navigate}
        />
      )}

      {page === 'my-bookings' && (
        <MyBookingsPage onNavigate={navigate} />
      )}

      {page === 'booking-detail' && data && (
        <BookingDetailPage
          booking={data as Booking}
          onNavigate={navigate}
        />
      )}

      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigate={navigate}
          redirectMessage={data?.redirectMessage}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          onRegister={handleRegister}
          onNavigate={navigate}
        />
      )}

      {page === 'profile' && customer && (
        <ProfilePage
          customer={customer}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {page === 'profile' && !customer && (
        <LoginPage onLogin={handleLogin} onNavigate={navigate} redirectMessage="Please sign in to view your profile." />
      )}

      {page === 'driving-license' && customer && (
        <DrivingLicensePage
          customer={customer}
          onUpdateLicense={handleUpdateLicense}
          onNavigate={navigate}
        />
      )}

      {page === 'driving-license' && !customer && (
        <LoginPage onLogin={handleLogin} onNavigate={navigate} redirectMessage="Please sign in to manage your driving license." />
      )}
    </div>
  );
}
