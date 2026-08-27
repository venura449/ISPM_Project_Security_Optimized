import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";

const STEPS = ["Basic Info", "Employment", "Dates & Pay"];

const ValidationIcon = ({ valid }) =>
  valid ? (
    <svg
      className="w-4 h-4 text-green-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-red-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

const BASE_INPUT =
  "w-full border rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none transition-all placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50";

const BASE_SELECT =
  "w-full border rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none transition-all disabled:opacity-50 disabled:bg-gray-50";

const validators = {
  employee_id: (v) => v.trim().length > 0,
  name: (v) => /^[a-zA-Z\s]{2,}$/.test(v.trim()),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v.trim()) &&
    !/\.com.+/.test(v.trim()),
  phone: (v) => v.trim() === "" || /^\d{10}$/.test(v.trim()),
  address: () => true,
  department: (v) => !!v,
  position: (v) => !!v,
  designation: (v) => v.trim() === "" || /^[a-zA-Z0-9\s.'-]+$/.test(v.trim()),
  status: () => true,
  joining_date: (v) => !!v && !isNaN(new Date(v).getTime()),
  probation_end_date: (v, joiningDate) =>
    !v ||
    (!isNaN(new Date(v).getTime()) &&
      (!joiningDate || new Date(v) > new Date(joiningDate))),
  salary: (v) =>
    v.trim() !== "" && /^\d+(\.\d+)?$/.test(v) && parseFloat(v) > 0,
  manager_id: () => true,
  notes: () => true,
};

const STEP_FIELDS = {
  1: ["employee_id", "name", "email", "phone", "address"],
  2: ["department", "position", "designation", "status"],
  3: ["joining_date", "probation_end_date", "salary"],
};

const AddEmployeeForm = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [idLoading, setIdLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    address: "",

    // Step 2: Employment Details
    department: "",
    position: "",
    designation: "",
    status: "Probation",

    // Step 3: Dates & Compensation
    joining_date: "",
    probation_end_date: "",
    salary: "",

    // Step 4: Additional Info
    manager_id: "",
    notes: "",
  });

  useEffect(() => {
    const fetchNextId = async () => {
      setIdLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/employees/next-id`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await res.json();
        if (data.success) {
          setFormData((prev) => ({ ...prev, employee_id: data.data.next_id }));
        }
      } catch {
        // silently fail — user can type manually
      } finally {
        setIdLoading(false);
      }
    };
    fetchNextId();
  }, []);

  const departments = [
    "Human Resources",
    "Finance",
    "IT",
    "Operations",
    "Marketing",
    "Sales",
    "Legal",
    "Administration",
  ];

  const positions = [
    "Junior Associate",
    "Senior Associate",
    "Team Lead",
    "Manager",
    "Senior Manager",
    "Director",
    "Executive",
  ];

  const isValid = (name) =>
    validators[name] ? validators[name](formData[name]) : true;

  const fieldCls = (name) => {
    if (!touched[name])
      return `${BASE_INPUT} border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50`;
    return isValid(name)
      ? `${BASE_INPUT} border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-50`
      : `${BASE_INPUT} border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  };

  const selectFieldCls = (name) => {
    if (!touched[name])
      return `${BASE_SELECT} border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50`;
    return isValid(name)
      ? `${BASE_SELECT} border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-50`
      : `${BASE_SELECT} border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  };

  const handleBlur = (e) =>
    setTouched((p) => ({ ...p, [e.target.name]: true }));

  const touchStep = (step) => {
    const fields = STEP_FIELDS[step] || [];
    setTouched((p) => {
      const next = { ...p };
      fields.forEach((f) => {
        next[f] = true;
      });
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, name: lettersOnly }));
      setTouched((p) => ({ ...p, name: true }));
      return;
    }
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      setTouched((p) => ({ ...p, phone: true }));
      return;
    }
    if (name === "email") {
      setFormData((prev) => ({ ...prev, email: value }));
      setTouched((p) => ({ ...p, email: true }));
      return;
    }
    if (name === "salary") {
      // Allow digits and at most one decimal point, no negatives/letters/symbols
      const sanitized = value.replace(/[^\d.]/g, "");
      // Prevent multiple decimal points
      const parts = sanitized.split(".");
      const clean =
        parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : sanitized;
      setFormData((prev) => ({ ...prev, salary: clean }));
      setTouched((p) => ({ ...p, salary: true }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.employee_id.trim()) {
          toast.warning("Employee ID is required");
          return false;
        }
        if (!formData.name.trim()) {
          toast.warning("Employee name is required");
          return false;
        }
        if (!/^[a-zA-Z\s]{2,}$/.test(formData.name.trim())) {
          toast.warning("Name cannot contain numbers or symbols");
          return false;
        }
        if (!formData.email.trim()) {
          toast.warning("Email address is required");
          return false;
        }
        if (
          !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email) ||
          /\.com.+/.test(formData.email)
        ) {
          toast.warning("Enter a valid email address");
          return false;
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
          toast.warning("Phone number must be exactly 10 digits");
          return false;
        }
        return true;

      case 2:
        if (!formData.department) {
          toast.warning("Please select a department");
          return false;
        }
        if (!formData.position) {
          toast.warning("Please select a position");
          return false;
        }
        return true;

      case 3:
        if (!formData.joining_date) {
          toast.warning("Joining date is required");
          return false;
        }
        if (isNaN(new Date(formData.joining_date).getTime())) {
          toast.warning("Please enter a valid joining date");
          return false;
        }
        if (
          formData.probation_end_date &&
          !validators.probation_end_date(
            formData.probation_end_date,
            formData.joining_date,
          )
        ) {
          toast.warning("Probation end date must be after the joining date");
          return false;
        }
        if (!formData.salary || !validators.salary(formData.salary)) {
          toast.warning("Salary is required and must be a positive number");
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleNext = () => {
    touchStep(currentStep);
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };
  const handlePrev = () => setCurrentStep((p) => p - 1);

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return (
          validators.employee_id(formData.employee_id) &&
          validators.name(formData.name) &&
          validators.email(formData.email) &&
          validators.phone(formData.phone)
        );
      case 2:
        return (
          validators.department(formData.department) &&
          validators.position(formData.position)
        );
      case 3:
        return (
          validators.joining_date(formData.joining_date) &&
          validators.probation_end_date(
            formData.probation_end_date,
            formData.joining_date,
          ) &&
          validators.salary(formData.salary)
        );
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchStep(currentStep);

    if (!validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        user_id: null, // Admin is adding employee, not tied to user account yet
        employee_id: formData.employee_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || null,
        department: formData.department,
        position: formData.position,
        status: formData.status,
        joining_date: formData.joining_date,
        probation_end_date: formData.probation_end_date,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        designation: formData.designation,
        manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
        notes: formData.notes,
        role: {
          role: formData.position || "Employee",
        },
      };

      await onSubmit(submitData);

      // Reset form
      setFormData({
        employee_id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        department: "",
        position: "",
        designation: "",
        status: "Probation",
        joining_date: "",
        probation_end_date: "",
        salary: "",
        manager_id: "",
        notes: "",
      });
      setTouched({});
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Employee ID — auto-generated, no validation icon */}
              <div>
                <label className={labelCls}>
                  Employee ID <span className="text-red-400">*</span>
                  <span className="ml-2 text-blue-400 font-normal">
                    (auto-generated)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="employee_id"
                    value={idLoading ? "" : formData.employee_id}
                    onChange={handleChange}
                    placeholder={idLoading ? "Loading…" : "EMP001"}
                    disabled={loading}
                    readOnly={idLoading}
                    className="w-full border rounded-xl px-3 py-2 pr-10 text-sm bg-blue-50 border-blue-200 text-blue-700 font-mono font-semibold outline-none disabled:opacity-50"
                  />
                  {idLoading && (
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* Full Name */}
              <div>
                <label className={labelCls}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    disabled={loading}
                    className={`${fieldCls("name")} pr-8`}
                  />
                  {touched.name && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("name")} />
                    </span>
                  )}
                </div>
                {touched.name && !isValid("name") && (
                  <p className="text-xs text-red-500 mt-1">
                    Name can only contain letters and spaces
                  </p>
                )}
              </div>
              {/* Email */}
              <div>
                <label className={labelCls}>
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="john@example.com"
                    disabled={loading}
                    className={`${fieldCls("email")} pr-8`}
                  />
                  {touched.email && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("email")} />
                    </span>
                  )}
                </div>
                {touched.email && !isValid("email") && (
                  <p className="text-xs text-red-500 mt-1">
                    Enter a valid email (e.g. john@example.com)
                  </p>
                )}
              </div>
              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0771234567"
                    maxLength={10}
                    disabled={loading}
                    className={`${fieldCls("phone")} pr-8`}
                  />
                  {touched.phone && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("phone")} />
                    </span>
                  )}
                </div>
                {touched.phone && !isValid("phone") && (
                  <p className="text-xs text-red-500 mt-1">
                    Phone must be exactly 10 digits
                  </p>
                )}
              </div>
              {/* Address */}
              <div className="col-span-2">
                <label className={labelCls}>Address</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Street address, city, postal code"
                    disabled={loading}
                    className={`${fieldCls("address")} pr-8`}
                  />
                  {touched.address && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("address")} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Employment Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Department */}
              <div>
                <label className={labelCls}>
                  Department <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      handleChange(e);
                      setTouched((p) => ({ ...p, department: true }));
                    }}
                    disabled={loading}
                    className={`${selectFieldCls("department")} flex-1`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {touched.department && (
                    <ValidationIcon valid={isValid("department")} />
                  )}
                </div>
              </div>
              {/* Position */}
              <div>
                <label className={labelCls}>
                  Position <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="position"
                    value={formData.position}
                    onChange={(e) => {
                      handleChange(e);
                      setTouched((p) => ({ ...p, position: true }));
                    }}
                    disabled={loading}
                    className={`${selectFieldCls("position")} flex-1`}
                  >
                    <option value="">Select Position</option>
                    {positions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {touched.position && (
                    <ValidationIcon valid={isValid("position")} />
                  )}
                </div>
              </div>
              {/* Designation */}
              <div>
                <label className={labelCls}>Designation</label>
                <div className="relative">
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Job title (optional)"
                    disabled={loading}
                    className={`${fieldCls("designation")} pr-8`}
                  />
                  {touched.designation && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("designation")} />
                    </span>
                  )}
                </div>
              </div>
              {/* Status */}
              <div>
                <label className={labelCls}>Employment Status</label>
                <div className="flex items-center gap-2">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => {
                      handleChange(e);
                      setTouched((p) => ({ ...p, status: true }));
                    }}
                    disabled={loading}
                    className={`${selectFieldCls("status")} flex-1`}
                  >
                    <option value="Probation">Probation</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                  {touched.status && (
                    <ValidationIcon valid={isValid("status")} />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Dates & Compensation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Joining Date */}
              <div>
                <label className={labelCls}>
                  Joining Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={
                      formData.joining_date
                        ? new Date(formData.joining_date)
                        : null
                    }
                    onChange={(date) => {
                      setFormData((p) => ({
                        ...p,
                        joining_date: date
                          ? date.toISOString().split("T")[0]
                          : "",
                        // clear probation if it's no longer valid
                        probation_end_date:
                          p.probation_end_date &&
                          date &&
                          new Date(p.probation_end_date) <= date
                            ? ""
                            : p.probation_end_date,
                      }));
                      setTouched((p) => ({ ...p, joining_date: true }));
                    }}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, joining_date: true }))
                    }
                    disabled={loading}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={`${fieldCls("joining_date")} pr-8 w-full`}
                    wrapperClassName="w-full"
                    autoComplete="off"
                  />
                  {touched.joining_date && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("joining_date")} />
                    </span>
                  )}
                </div>
                {touched.joining_date && !isValid("joining_date") && (
                  <p className="text-xs text-red-500 mt-1">
                    Joining date is required
                  </p>
                )}
              </div>
              {/* Probation End Date */}
              <div>
                <label className={labelCls}>Probation End Date</label>
                <div className="relative">
                  <DatePicker
                    selected={
                      formData.probation_end_date
                        ? new Date(formData.probation_end_date)
                        : null
                    }
                    onChange={(date) => {
                      setFormData((p) => ({
                        ...p,
                        probation_end_date: date
                          ? date.toISOString().split("T")[0]
                          : "",
                      }));
                      setTouched((p) => ({ ...p, probation_end_date: true }));
                    }}
                    onBlur={() =>
                      setTouched((p) => ({
                        ...p,
                        probation_end_date: true,
                      }))
                    }
                    disabled={loading}
                    minDate={
                      formData.joining_date
                        ? new Date(
                            new Date(formData.joining_date).getTime() +
                              86400000,
                          )
                        : undefined
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isClearable
                    className={`${fieldCls("probation_end_date")} pr-8 w-full`}
                    wrapperClassName="w-full"
                    autoComplete="off"
                  />
                  {touched.probation_end_date && (
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon
                        valid={validators.probation_end_date(
                          formData.probation_end_date,
                          formData.joining_date,
                        )}
                      />
                    </span>
                  )}
                </div>
                {touched.probation_end_date &&
                  !validators.probation_end_date(
                    formData.probation_end_date,
                    formData.joining_date,
                  ) && (
                    <p className="text-xs text-red-500 mt-1">
                      Probation end date must be after the joining date
                    </p>
                  )}
              </div>
              {/* Salary */}
              <div className="col-span-2">
                <label className={labelCls}>
                  Monthly Salary <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="50000"
                    disabled={loading}
                    className={`${fieldCls("salary")} pr-8`}
                  />
                  {touched.salary && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ValidationIcon valid={isValid("salary")} />
                    </span>
                  )}
                </div>
                {touched.salary && !isValid("salary") && (
                  <p className="text-xs text-red-500 mt-1">
                    Salary must be a positive number (e.g. 50000 or 50000.50)
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-5">Review Details</h3>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {[
          ["Employee ID", formData.employee_id],
          ["Full Name", formData.name],
          ["Email", formData.email],
          ["Phone", formData.phone || "—"],
          ["Department", formData.department],
          ["Position", formData.position],
          ["Status", formData.status],
          [
            "Joining Date",
            formData.joining_date
              ? new Date(formData.joining_date).toLocaleDateString()
              : "—",
          ],
          [
            "Salary",
            formData.salary
              ? `₨ ${parseFloat(formData.salary).toLocaleString("en-IN")}`
              : "—",
          ],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-700 break-words">
              {val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="max-w-2xl mx-auto"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Add New Employee
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Step {currentStep} of 3 — {STEPS[currentStep - 1]}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-5">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
              />
              <p
                className={`text-xs mt-1.5 font-medium ${i + 1 === currentStep ? "text-blue-600" : i + 1 < currentStep ? "text-gray-400" : "text-gray-300"}`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Step content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep <= 3 ? renderStep() : renderSummary()}

          {/* Navigation */}
          <div className="flex gap-3 pt-1">
            {onCancel && currentStep === 1 && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-5 py-3 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-5 py-3 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-50"
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || !isStepValid(currentStep)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid(currentStep)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Employee…" : "Create Employee"}
              </button>
            )}
          </div>
        </form>

        <p className="text-xs text-gray-400 mt-3">
          <span className="text-red-400">*</span> Required fields
        </p>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
