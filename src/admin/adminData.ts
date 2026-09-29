import { vehicleTypes, licensePlates } from "../data/mockData"

export type Section = "bookings" | "licenses" | "vehicle-types" | "vehicles" | "license-plates" | "inspections" | "issues" | "payments" | "promotions" | "reviews"
export type AdminPage = "dashboard" | Section
export type AdminRecord = {
  id: string
  status: string
  [key: string]: string | number
}
export type AdminData = Record<Section, AdminRecord[]>
export type Column = {
  key: string
  label: string
  format?: "money" | "date" | "rating" | "mono"
}
type SectionConfig = {
  label: string
  singular: string
  description: string
  group: string
  columns: Column[]
  statuses: string[]
  transitions: Record<string, string[]>
}

export const sections: Record<Section, SectionConfig> = {
  bookings: {
    label: "Bookings",
    singular: "Booking",
    group: "Operations",
    description: "Track reservations and keep every rental on schedule.",
    columns: [
      { key: "id", label: "Booking", format: "mono" },
      { key: "customer", label: "Customer" },
      { key: "vehicle", label: "Vehicle" },
      { key: "start", label: "Pickup", format: "date" },
      { key: "amount", label: "Total", format: "money" },
    ],
    statuses: [
      "Confirmed",
      "Active",
      "Completed",
      "Pending payment",
      "Cancelled",
    ],
    transitions: { Confirmed: ["Cancelled"], "Pending payment": ["Cancelled"] },
  },
  licenses: {
    label: "Driving License Verification",
    singular: "Driving license",
    group: "Operations",
    description: "Review driver credentials before their next journey.",
    columns: [
      { key: "customer", label: "Applicant" },
      { key: "number", label: "License number", format: "mono" },
      { key: "class", label: "Class" },
      { key: "submitted", label: "Submitted", format: "date" },
      { key: "expiry", label: "Expires", format: "date" },
    ],
    statuses: ["Pending", "Approved", "Rejected"],
    transitions: { Pending: ["Approved", "Rejected"] },
  },
  "vehicle-types": {
    label: "Vehicle Types",
    singular: "Vehicle type",
    group: "Fleet management",
    description:
      "Manage your rental categories, specifications, and hourly rates.",
    columns: [
      { key: "name", label: "Vehicle type" },
      { key: "category", label: "Category" },
      { key: "seats", label: "Seats" },
      { key: "transmission", label: "Transmission" },
      { key: "rate", label: "Hourly rate", format: "money" },
    ],
    statuses: ["Published", "Draft"],
    transitions: { Published: ["Draft"], Draft: ["Published"] },
  },
  vehicles: {
    label: "Vehicles",
    singular: "Vehicle",
    group: "Fleet management",
    description: "A complete view of your fleet and its availability.",
    columns: [
      { key: "id", label: "Vehicle ID", format: "mono" },
      { key: "vehicle", label: "Model" },
      { key: "plate", label: "License plate", format: "mono" },
      { key: "year", label: "Year" },
      { key: "odometer", label: "Odometer (km)" },
    ],
    statuses: ["Available", "Rented", "Maintenance"],
    transitions: { Available: ["Maintenance"], Maintenance: ["Available"] },
  },
  "license-plates": {
    label: "License Plates",
    singular: "License plate",
    group: "Fleet management",
    description: "Keep registration details organized for every vehicle.",
    columns: [
      { key: "plate", label: "License plate", format: "mono" },
      { key: "vehicle", label: "Vehicle" },
      { key: "vehicleId", label: "Vehicle ID", format: "mono" },
      { key: "province", label: "Registered in" },
      { key: "expiry", label: "Registration expiry", format: "date" },
    ],
    statuses: ["Registered", "Renewal due"],
    transitions: {},
  },
  inspections: {
    label: "Vehicle Inspections",
    singular: "Inspection",
    group: "Fleet management",
    description: "Monitor vehicle condition and upcoming safety checks.",
    columns: [
      { key: "id", label: "Inspection", format: "mono" },
      { key: "vehicle", label: "Vehicle" },
      { key: "plate", label: "License plate", format: "mono" },
      { key: "type", label: "Inspection type" },
      { key: "scheduled", label: "Scheduled", format: "date" },
    ],
    statuses: ["Scheduled", "Passed", "Failed"],
    transitions: { Scheduled: ["Passed", "Failed"] },
  },
  issues: {
    label: "Issues",
    singular: "Issue",
    group: "Operations",
    description: "Follow up on reported problems and keep customers moving.",
    columns: [
      { key: "id", label: "Issue", format: "mono" },
      { key: "subject", label: "Subject" },
      { key: "booking", label: "Booking", format: "mono" },
      { key: "priority", label: "Priority" },
      { key: "owner", label: "Assigned to" },
    ],
    statuses: ["Open", "In progress", "Resolved"],
    transitions: {
      Open: ["In progress", "Resolved"],
      "In progress": ["Resolved"],
      Resolved: ["Open"],
    },
  },
  payments: {
    label: "Payments",
    singular: "Payment",
    group: "Business",
    description: "Review rental transactions, deposits, and payment status.",
    columns: [
      { key: "id", label: "Transaction", format: "mono" },
      { key: "customer", label: "Customer" },
      { key: "booking", label: "Booking", format: "mono" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", format: "money" },
    ],
    statuses: ["Paid", "Pending", "Failed", "Refunded"],
    transitions: {},
  },
  promotions: {
    label: "Promotions",
    singular: "Promotion",
    group: "Business",
    description: "Manage the offers that bring customers back.",
    columns: [
      { key: "code", label: "Promo code", format: "mono" },
      { key: "name", label: "Campaign" },
      { key: "discount", label: "Discount" },
      { key: "usage", label: "Redemptions" },
      { key: "end", label: "End date", format: "date" },
    ],
    statuses: ["Active", "Paused", "Expired"],
    transitions: { Active: ["Paused"], Paused: ["Active"] },
  },
  reviews: {
    label: "Reviews",
    singular: "Review",
    group: "Business",
    description: "Listen to your customers and manage published feedback.",
    columns: [
      { key: "customer", label: "Customer" },
      { key: "vehicle", label: "Vehicle" },
      { key: "rating", label: "Rating", format: "rating" },
      { key: "comment", label: "Review" },
      { key: "date", label: "Received", format: "date" },
    ],
    statuses: ["Published", "Hidden"],
    transitions: { Published: ["Hidden"], Hidden: ["Published"] },
  },
}

export const navigation: AdminPage[] = [
  "dashboard",
  "bookings",
  "licenses",
  "issues",
  "vehicle-types",
  "vehicles",
  "license-plates",
  "inspections",
  "payments",
  "promotions",
  "reviews",
]
export const snapshotDate = "2026-09-29"
const customers = [
  "Nguyen Minh Anh",
  "Tran Quoc Bao",
  "Le Thanh Ha",
  "Pham Hoang Nam",
  "Vo Thuy Linh",
  "Dang Minh Khoa",
  "Bui Ngoc Mai",
  "Hoang Gia Huy",
]
const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

/** A separate fixture store: admin actions never mutate customer-facing mock data. */
export function createAdminData(): AdminData {
  const vehicles: AdminRecord[] = licensePlates.map((plate, i) => ({
    id: `VH-${String(i + 1).padStart(3, "0")}`,
    vehicle:
      vehicleTypes.find((type) => type.id === plate.vehicleTypeId)?.name ??
      "Vehicle",
    plate: plate.plate,
    year: plate.year,
    color: plate.color,
    odometer: plate.odometer,
    status: titleCase(plate.status),
    location: "Ho Chi Minh City depot",
  }))
  const bookings: AdminRecord[] = customers.map((customer, i) => ({
    id: `BK-2609${String(i + 1).padStart(2, "0")}`,
    customer,
    vehicle: vehicleTypes[i % vehicleTypes.length].name,
    start: `2026-09-${String(22 + i).padStart(2, "0")}T09:00:00`,
    end: `2026-09-${String(22 + i).padStart(2, "0")}T18:00:00`,
    amount: vehicleTypes[i % vehicleTypes.length].pricePerHour * 9,
    status: [
      "Completed",
      "Completed",
      "Completed",
      "Cancelled",
      "Active",
      "Confirmed",
      "Pending payment",
      "Confirmed",
    ][i],
    pickup: "DriveNow · District 1, Ho Chi Minh City",
    email: `customer${i + 1}@example.com`,
    notes: "Standard self-drive rental. Pickup and return at the depot.",
  }))
  return {
    bookings,
    licenses: customers.slice(0, 5).map((customer, i) => ({
      id: `DL-${101 + i}`,
      customer,
      number: `79012600${4210 + i}`,
      class: i === 2 ? "B1" : "B2",
      submitted: `2026-09-${27 + (i % 3)}`,
      expiry: `203${i + 1}-08-15`,
      dateOfBirth: `199${i}-04-12`,
      status: ["Pending", "Pending", "Approved", "Rejected", "Pending"][i],
      notes:
        i === 3
          ? "License number is not legible. Please submit a clearer image."
          : "Sample credentials for the admin demo.",
    })),
    "vehicle-types": vehicleTypes.map((type) => ({
      id: type.id,
      name: type.name,
      category: titleCase(type.category),
      seats: type.seats,
      transmission: titleCase(type.transmission),
      rate: type.pricePerHour,
      deposit: type.depositAmount,
      status: "Published",
      description: type.description,
    })),
    vehicles,
    "license-plates": vehicles.map((vehicle, i) => ({
      id: `LP-${101 + i}`,
      plate: vehicle.plate,
      vehicle: vehicle.vehicle,
      vehicleId: vehicle.id,
      province: "Ho Chi Minh City",
      expiry: i < 2 ? "2026-10-05" : "2027-06-30",
      status: i < 2 ? "Renewal due" : "Registered",
    })),
    inspections: vehicles
      .slice(0, 6)
      .map((vehicle, i) => ({
        id: `IN-${201 + i}`,
        vehicle: vehicle.vehicle,
        plate: vehicle.plate,
        type: i % 2 ? "Return inspection" : "Routine safety check",
        scheduled: `2026-09-${24 + i}`,
        inspector: ["Nguyen Van Duc", "Tran Minh Tuan"][i % 2],
        status: [
          "Passed",
          "Passed",
          "Failed",
          "Passed",
          "Scheduled",
          "Scheduled",
        ][i],
        notes:
          i === 2
            ? "Front tire tread below threshold. Replacement required."
            : "Check tires, brakes, lights, fluid levels, and bodywork.",
      })),
    issues: [
      {
        id: "IS-301",
        subject: "Air conditioning not cooling",
        booking: bookings[4].id,
        priority: "High",
        owner: "Nguyen Van Duc",
        status: "Open",
        reported: "2026-09-29",
        description:
          "Customer reports weak cooling during the rental. Arrange a vehicle check.",
      },
      {
        id: "IS-302",
        subject: "Deposit return inquiry",
        booking: bookings[0].id,
        priority: "Medium",
        owner: "Le Thu Trang",
        status: "In progress",
        reported: "2026-09-28",
        description: "Customer requested an update on their deposit return.",
      },
      {
        id: "IS-303",
        subject: "Scratch on rear bumper",
        booking: bookings[2].id,
        priority: "Medium",
        owner: "Tran Minh Tuan",
        status: "Open",
        reported: "2026-09-27",
        description:
          "Review pickup and return condition reports for the rear bumper.",
      },
      {
        id: "IS-304",
        subject: "Pickup location clarification",
        booking: bookings[1].id,
        priority: "Low",
        owner: "Le Thu Trang",
        status: "Resolved",
        reported: "2026-09-25",
        description: "Depot directions have been shared with the customer.",
      },
    ],
    payments: bookings.map((booking, i) => ({
      id: `TX-${401 + i}`,
      customer: booking.customer,
      booking: booking.id,
      method: i % 2 ? "Bank transfer" : "Card",
      amount: booking.amount,
      date: `2026-09-${22 + i}`,
      type: "Rental payment",
      status: [
        "Paid",
        "Paid",
        "Paid",
        "Refunded",
        "Paid",
        "Paid",
        "Pending",
        "Failed",
      ][i],
    })),
    promotions: [
      {
        id: "PR-501",
        code: "WELCOME10",
        name: "Your first journey",
        discount: "10%",
        usage: "42 / 200",
        start: "2026-09-01",
        end: "2026-12-31",
        status: "Active",
        description: "10% off a first booking, up to 200,000 VND.",
      },
      {
        id: "PR-502",
        code: "WEEKEND15",
        name: "Weekend escapes",
        discount: "15%",
        usage: "28 / 100",
        start: "2026-09-01",
        end: "2026-10-31",
        status: "Active",
        description: "15% off weekend rentals, up to 300,000 VND.",
      },
      {
        id: "PR-503",
        code: "DRIVEAGAIN",
        name: "Welcome back",
        discount: "100,000 VND",
        usage: "16 / 100",
        start: "2026-09-01",
        end: "2026-11-30",
        status: "Paused",
        description: "100,000 VND off for returning customers.",
      },
      {
        id: "PR-504",
        code: "SUMMER20",
        name: "Summer in the city",
        discount: "20%",
        usage: "100 / 100",
        start: "2026-06-01",
        end: "2026-08-31",
        status: "Expired",
        description: "Summer campaign has ended.",
      },
    ],
    reviews: bookings
      .slice(0, 3)
      .map((booking, i) => ({
        id: `RV-${601 + i}`,
        customer: booking.customer,
        vehicle: booking.vehicle,
        booking: booking.id,
        rating: [5, 4, 5][i],
        comment: [
          "Clean car and a very smooth pickup. Will book again!",
          "Comfortable ride. Pickup took a little longer than expected.",
          "Great service and a lovely car for our family trip.",
        ][i],
        date: `2026-09-${23 + i}`,
        status: "Published",
      })),
  }
}

export function getAdminPage(hash: string): AdminPage | null {
  const path = hash.replace(/^#\/?/, "").replace(/\/$/, "")
  if (path !== "admin" && !path.startsWith("admin/")) return null
  const page = path.slice(6)
  return navigation.includes(page as AdminPage)
    ? page as AdminPage
    : "dashboard"
}

export const adminHref = (page: AdminPage) =>
  page === "dashboard" ? "#/admin" : `#/admin/${page}`
