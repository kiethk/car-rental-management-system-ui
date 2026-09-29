export type VehicleCategory = 'sedan' | 'suv' | 'hatchback' | 'minivan' | 'pickup';
export type LicenseClass = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F';
export type LicenseStatus = 'not_uploaded' | 'pending' | 'approved' | 'rejected';

export interface DrivingLicense {
  licenseNumber: string;
  licenseClass: LicenseClass;
  expiryDate: string;
  frontImageUrl: string;
  backImageUrl: string;
  status: LicenseStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface VehicleType {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  pricePerHour: number; // VND
  depositAmount: number; // VND
  description: string;
  features: string[];
  images: string[];
  available: number;
  total: number;
  rating: number;
  reviewCount: number;
  specs: {
    engine: string;
    fuelConsumption: string;
    maxSpeed: string;
    trunkVolume: string;
  };
}

export interface LicensePlate {
  id: string;
  plate: string;
  vehicleTypeId: string;
  color: string;
  year: number;
  status: 'available' | 'rented' | 'maintenance';
  inspectionExpiry: string;
  odometer: number;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleTypeId: string;
  assignedPlateId?: string;
  preferredPlateId?: string;
  startTime: string;
  endTime: string;
  actualReturnTime?: string;
  status: 'pending_payment' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  depositAmount: number;
  depositPaid: boolean;
  totalAmount: number;
  finalPaid: boolean;
  lateFee: number;
  promotionCode?: string;
  discountAmount: number;
  notes?: string;
  createdAt: string;
  vehicleType?: VehicleType;
  assignedPlate?: LicensePlate;
  review?: Review;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  joinedAt: string;
  avatar?: string;
  drivingLicense?: DrivingLicense;
}

export const vehicleTypes: VehicleType[] = [
  {
    id: 'vt-001',
    name: 'Toyota Vios',
    brand: 'Toyota',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerHour: 180000,
    depositAmount: 5000000,
    description: 'Comfortable and fuel-efficient sedan perfect for city driving in Ho Chi Minh City. Easy to park, smooth ride, and reliable performance.',
    features: ['Air conditioning', 'Bluetooth audio', 'Backup camera', 'USB charging', 'Keyless entry', 'Lane assist'],
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&h=500&fit=crop&auto=format',
    ],
    available: 4,
    total: 6,
    rating: 4.7,
    reviewCount: 142,
    specs: {
      engine: '1.5L DOHC VVT-i',
      fuelConsumption: '6.2L/100km',
      maxSpeed: '170 km/h',
      trunkVolume: '480L',
    },
  },
  {
    id: 'vt-002',
    name: 'Honda CR-V',
    brand: 'Honda',
    category: 'suv',
    seats: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerHour: 320000,
    depositAmount: 8000000,
    description: 'Spacious 7-seat SUV with elevated driving position and premium comfort. Ideal for family trips or group outings around Ho Chi Minh City.',
    features: ['Air conditioning', 'Apple CarPlay', 'Android Auto', 'Panoramic sunroof', '360° camera', 'Adaptive cruise control', 'Lane keeping assist'],
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1617814076229-7b679cc1e38c?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop&auto=format',
    ],
    available: 2,
    total: 4,
    rating: 4.8,
    reviewCount: 89,
    specs: {
      engine: '1.5L Turbocharged VTEC',
      fuelConsumption: '7.8L/100km',
      maxSpeed: '190 km/h',
      trunkVolume: '561L',
    },
  },
  {
    id: 'vt-003',
    name: 'Kia Morning',
    brand: 'Kia',
    category: 'hatchback',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerHour: 120000,
    depositAmount: 3000000,
    description: 'Compact and nimble hatchback designed for tight city streets. Best value for solo or couple trips around District 1 and beyond.',
    features: ['Air conditioning', 'Bluetooth audio', 'USB charging', 'Electric windows', 'Hill start assist'],
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop&auto=format',
    ],
    available: 6,
    total: 8,
    rating: 4.5,
    reviewCount: 211,
    specs: {
      engine: '1.25L MPI DOHC',
      fuelConsumption: '5.4L/100km',
      maxSpeed: '155 km/h',
      trunkVolume: '255L',
    },
  },
  {
    id: 'vt-004',
    name: 'Hyundai Tucson',
    brand: 'Hyundai',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    pricePerHour: 280000,
    depositAmount: 7000000,
    description: 'Stylish mid-size SUV with modern interior and advanced safety features. A perfect balance of comfort and performance.',
    features: ['Air conditioning', 'Apple CarPlay', 'Wireless charging', 'Heated seats', 'Blind spot monitoring', 'Auto parking'],
    images: [
      'https://images.unsplash.com/photo-1617814076229-7b679cc1e38c?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop&auto=format',
    ],
    available: 3,
    total: 5,
    rating: 4.6,
    reviewCount: 67,
    specs: {
      engine: '2.0L Smartstream',
      fuelConsumption: '8.1L/100km',
      maxSpeed: '185 km/h',
      trunkVolume: '513L',
    },
  },
  {
    id: 'vt-005',
    name: 'Toyota Innova',
    brand: 'Toyota',
    category: 'minivan',
    seats: 8,
    transmission: 'automatic',
    fuelType: 'diesel',
    pricePerHour: 350000,
    depositAmount: 9000000,
    description: 'The iconic 8-seat MPV trusted across Vietnam. Ample space for large groups, powerful diesel engine, and outstanding reliability.',
    features: ['Air conditioning (dual zone)', 'Bluetooth audio', 'Rear entertainment screen', 'Sliding doors', 'Roof rack compatible'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&h=500&fit=crop&auto=format',
    ],
    available: 2,
    total: 3,
    rating: 4.9,
    reviewCount: 178,
    specs: {
      engine: '2.8L 1GD-FTV Diesel',
      fuelConsumption: '9.2L/100km',
      maxSpeed: '175 km/h',
      trunkVolume: '880L',
    },
  },
  {
    id: 'vt-006',
    name: 'VinFast VF 8',
    brand: 'VinFast',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'electric',
    pricePerHour: 260000,
    depositAmount: 7000000,
    description: "Vietnam's first mass-market electric SUV. Zero emissions, cutting-edge tech, and a smooth silent drive through the city.",
    features: ['Air conditioning', 'Large touchscreen', 'Advanced driver assist', 'Regenerative braking', 'Over-the-air updates', 'App control'],
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=500&fit=crop&auto=format',
    ],
    available: 1,
    total: 2,
    rating: 4.4,
    reviewCount: 34,
    specs: {
      engine: 'Dual motor 300kW',
      fuelConsumption: '19.4 kWh/100km',
      maxSpeed: '200 km/h',
      trunkVolume: '420L',
    },
  },
];

export const licensePlates: LicensePlate[] = [
  { id: 'lp-001', plate: '51A-12345', vehicleTypeId: 'vt-001', color: 'White', year: 2022, status: 'available', inspectionExpiry: '2025-08-15', odometer: 28400 },
  { id: 'lp-002', plate: '51A-23456', vehicleTypeId: 'vt-001', color: 'Silver', year: 2021, status: 'available', inspectionExpiry: '2025-05-20', odometer: 41200 },
  { id: 'lp-003', plate: '51A-34567', vehicleTypeId: 'vt-001', color: 'Black', year: 2023, status: 'rented', inspectionExpiry: '2026-02-10', odometer: 12800 },
  { id: 'lp-004', plate: '51B-45678', vehicleTypeId: 'vt-001', color: 'Blue', year: 2022, status: 'available', inspectionExpiry: '2025-11-30', odometer: 33600 },
  { id: 'lp-005', plate: '51C-56789', vehicleTypeId: 'vt-001', color: 'White', year: 2023, status: 'available', inspectionExpiry: '2026-03-15', odometer: 9200 },
  { id: 'lp-006', plate: '50A-11111', vehicleTypeId: 'vt-001', color: 'Red', year: 2021, status: 'maintenance', inspectionExpiry: '2025-09-01', odometer: 55600 },
  { id: 'lp-007', plate: '51A-67890', vehicleTypeId: 'vt-002', color: 'White', year: 2023, status: 'available', inspectionExpiry: '2026-01-20', odometer: 16300 },
  { id: 'lp-008', plate: '51B-78901', vehicleTypeId: 'vt-002', color: 'Black', year: 2022, status: 'available', inspectionExpiry: '2025-10-05', odometer: 29700 },
  { id: 'lp-009', plate: '51D-89012', vehicleTypeId: 'vt-002', color: 'Silver', year: 2022, status: 'rented', inspectionExpiry: '2025-07-22', odometer: 38100 },
  { id: 'lp-010', plate: '51G-90123', vehicleTypeId: 'vt-002', color: 'Blue', year: 2023, status: 'available', inspectionExpiry: '2026-04-18', odometer: 7500 },
  { id: 'lp-011', plate: '51A-11223', vehicleTypeId: 'vt-003', color: 'White', year: 2022, status: 'available', inspectionExpiry: '2025-12-01', odometer: 22100 },
  { id: 'lp-012', plate: '51B-22334', vehicleTypeId: 'vt-003', color: 'Red', year: 2021, status: 'available', inspectionExpiry: '2025-06-15', odometer: 48300 },
  { id: 'lp-013', plate: '51C-33445', vehicleTypeId: 'vt-003', color: 'Yellow', year: 2023, status: 'available', inspectionExpiry: '2026-02-28', odometer: 8900 },
  { id: 'lp-014', plate: '51D-44556', vehicleTypeId: 'vt-003', color: 'Black', year: 2022, status: 'available', inspectionExpiry: '2025-09-10', odometer: 31400 },
  { id: 'lp-015', plate: '51E-55667', vehicleTypeId: 'vt-003', color: 'White', year: 2023, status: 'rented', inspectionExpiry: '2026-01-05', odometer: 14600 },
  { id: 'lp-016', plate: '51F-66778', vehicleTypeId: 'vt-003', color: 'Silver', year: 2021, status: 'available', inspectionExpiry: '2025-08-20', odometer: 44800 },
  { id: 'lp-017', plate: '51G-77889', vehicleTypeId: 'vt-003', color: 'Blue', year: 2022, status: 'available', inspectionExpiry: '2025-11-15', odometer: 27300 },
  { id: 'lp-018', plate: '51H-88990', vehicleTypeId: 'vt-003', color: 'White', year: 2023, status: 'available', inspectionExpiry: '2026-03-20', odometer: 6100 },
];

export const mockAccounts: Customer[] = [
  {
    id: 'cust-001',
    name: 'Nguyễn Văn An',
    phone: '0901 234 567',
    email: 'an@demo.com',
    password: 'password123',
    joinedAt: '2024-06-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    drivingLicense: {
      licenseNumber: 'B2-0123456789',
      licenseClass: 'B2',
      expiryDate: '2028-03-15',
      frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=260&fit=crop&auto=format',
      backImageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=260&fit=crop&auto=format',
      status: 'approved',
      submittedAt: '2024-06-12T09:00:00',
      reviewedAt: '2024-06-13T14:30:00',
    },
  },
  {
    id: 'cust-002',
    name: 'Trần Thị Mai',
    phone: '0912 345 678',
    email: 'mai@demo.com',
    password: 'password123',
    joinedAt: '2025-01-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    drivingLicense: {
      licenseNumber: 'B1-0987654321',
      licenseClass: 'B1',
      expiryDate: '2027-11-20',
      frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=260&fit=crop&auto=format',
      backImageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=260&fit=crop&auto=format',
      status: 'pending',
      submittedAt: '2025-01-06T10:00:00',
    },
  },
  {
    id: 'cust-003',
    name: 'Lê Hoàng Phúc',
    phone: '0933 456 789',
    email: 'phuc@demo.com',
    password: 'password123',
    joinedAt: '2024-11-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format',
    drivingLicense: {
      licenseNumber: 'C-0555123456',
      licenseClass: 'C',
      expiryDate: '2026-05-30',
      frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=260&fit=crop&auto=format',
      backImageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=260&fit=crop&auto=format',
      status: 'rejected',
      rejectionReason: 'The front image of your license is blurry and unreadable. Please retake the photo in good lighting and ensure all text is clearly visible.',
      submittedAt: '2024-11-22T08:30:00',
      reviewedAt: '2024-11-23T11:00:00',
    },
  },
  {
    id: 'cust-004',
    name: 'Phạm Thành Long',
    phone: '0944 567 890',
    email: 'long@demo.com',
    password: 'password123',
    joinedAt: '2025-01-08',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format',
  },
];

// Keep backward-compat reference
export const currentCustomer = mockAccounts[0];

export const myBookings: Booking[] = [
  {
    id: 'BK-2024-001',
    customerId: 'cust-001',
    vehicleTypeId: 'vt-001',
    assignedPlateId: 'lp-001',
    preferredPlateId: 'lp-001',
    startTime: '2024-12-20T08:00:00',
    endTime: '2024-12-20T17:00:00',
    actualReturnTime: '2024-12-20T17:25:00',
    status: 'completed',
    depositAmount: 5000000,
    depositPaid: true,
    totalAmount: 1710000,
    finalPaid: true,
    lateFee: 90000,
    promotionCode: 'FIRST10',
    discountAmount: 162000,
    createdAt: '2024-12-18T14:30:00',
    review: {
      id: 'rv-001',
      bookingId: 'BK-2024-001',
      rating: 5,
      comment: 'Great experience! The car was clean and in excellent condition. Easy pickup at the warehouse. Will definitely rent again.',
      createdAt: '2024-12-21T09:00:00',
    },
  },
  {
    id: 'BK-2024-002',
    customerId: 'cust-001',
    vehicleTypeId: 'vt-002',
    assignedPlateId: 'lp-007',
    startTime: '2025-01-05T09:00:00',
    endTime: '2025-01-05T21:00:00',
    status: 'confirmed',
    depositAmount: 8000000,
    depositPaid: true,
    totalAmount: 3840000,
    finalPaid: false,
    lateFee: 0,
    discountAmount: 0,
    createdAt: '2025-01-03T16:00:00',
  },
  {
    id: 'BK-2024-003',
    customerId: 'cust-001',
    vehicleTypeId: 'vt-003',
    startTime: '2025-01-10T13:00:00',
    endTime: '2025-01-10T19:00:00',
    status: 'pending_payment',
    depositAmount: 3000000,
    depositPaid: false,
    totalAmount: 720000,
    finalPaid: false,
    lateFee: 0,
    discountAmount: 0,
    createdAt: '2025-01-08T11:00:00',
  },
];

export const promotionCodes: Record<string, { discount: number; type: 'percent' | 'fixed'; description: string }> = {
  FIRST10: { discount: 10, type: 'percent', description: '10% off for first-time renters' },
  WELCOME50: { discount: 50000, type: 'fixed', description: '50,000 VND off any booking' },
  HCMC20: { discount: 20, type: 'percent', description: '20% off — Ho Chi Minh City special' },
  NEWUSER: { discount: 100000, type: 'fixed', description: '100,000 VND new user discount' },
};

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  return `${hours}h ${minutes}m`;
};
